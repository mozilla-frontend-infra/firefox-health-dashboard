import Router from 'koa-router';
import moment from 'moment';
import Telemetry from 'telemetry-next-node';
import { median, standardDeviation } from 'simple-statistics';
import qs from 'qs';
import fetchJson from './fetch/json';
import fetchRedash from './fetch/redash';
import fetchCrashStats from './fetch/crash-stats';
import { getVersions } from './release';
import { getHistory } from './release/history';

import {
  uniq,
  flatten,
  sumBy,
  zipObject,
  without,
  countBy,
  sortBy,
  toPairs,
  find,
} from 'lodash';

async function fetchLast4Beta() {
  const versions = await getVersions();
  return Array(4).fill(versions.beta).map((version, i) => version - i);
}

async function fetchUptime(versions) {
  const filters = {
    application: 'Firefox',
  };
  return new Promise((resolve, reject) => {
    Telemetry.init(resolve, reject);
  })
  .then(() => {
    return Promise.all(versions.map((version) => {
      return new Promise((resolve) => {
        Telemetry.getEvolution(
          'beta',
          String(version),
          'SIMPLE_MEASURES_UPTIME',
          filters,
          true,
          (evo) => {
            resolve(evo[''].sanitized());
          }
        );
      });
    }));
  })
  .then((evolutions) => {
    return evolutions.reduce((result, evolution, idx) => {
      result[versions[idx]] = evolution.map((h, i, date) => {
        return {
          date: +moment(date).format('x'),
          stats: h.mean(),
          count: h.submissions,
        };
      });
      return result;
    }, {});
  });
}

export const router = new Router();

router
  .get('/adi', async (ctx) => {
    const product = (ctx.request.query.product === 'fennec') ? 'fennec' : 'firefox';
    const urls = {
      fennec: 'https://crash-analysis.mozilla.com/rkaiser/FennecAndroid-release-bytype.json',
      firefox: 'https://crash-analysis.mozilla.com/rkaiser/Firefox-release-bytype.json',
    };
    const raw = await fetchJson(urls[product]);
    const ratesByDay = Object.keys(raw).reduce((result, date) => {
      const time = moment(date, 'YYYY MM DD');
      if (moment().diff(time, 'days') > 130) {
        return result;
      }
      const entry = raw[date];
      const mainRate = (entry.crashes.Browser / entry.adi) * 100;
      const contentRate = ((entry.crashes.Content || 0) / entry.adi) * 100;
      result.push({
        date,
        crash_rate: mainRate,
        combined_crash_rate: mainRate + contentRate,
      });
      return result;
    }, []);
    ctx.body = ratesByDay;
  })

  .get('/', async (ctx) => {
    // const product = (ctx.request.query.product === 'fennec') ? 'fennec' : 'firefox';
    // const channel = (ctx.request.query.channel === 'beta') ? 'beta' : 'channel';
    const raw = await fetchRedash(331);
    const reduced = raw.query_result.data.rows.map((row) => {
      return {
        date: row.activity_date,
        main_crash_rate: row.main_crash_rate,
        combined_crash_rate: row.app_crash_rate,
      };
    });
    ctx.body = reduced;
  })

  .get('/release/versions', async (ctx) => {
    const raw = await fetchRedash(184);
    const reduced = raw.query_result.data.rows.map((row) => {
      return {
        date: row.activity_date,
        main_crash_rate: row.main_crash_rate,
        combined_crash_rate: row.app_crash_rate,
      };
    });
    ctx.body = reduced;
  })

  .get('/beta', async (ctx) => {
    const raw = await fetchRedash(475);
    const results = raw.query_result.data.rows.map((row) => {
      return {
        date: row.activity_date,
        main_crash_rate: row.main_crash_rate,
      };
    });
    ctx.body = results;
  })

  .get('/beta/builds', async (ctx) => {
    const history = await getHistory({
      channel: 'beta',
      tailVersion: 5,
    });
    const raw = (await fetchRedash(207)).query_result.data.rows;
    const rawSorted = sortBy(raw, 'activity_date', (a) => Date.parse(a));

    let results = rawSorted.reduce((lookup, row) => {
      let result = find(lookup, ({ build }) => build === row.build_id);
      if (!result) {
        const buildDate = moment(row.build_id, 'YYYYMMDD');
        const release = find(history, ({ date }) => {
          const diff = moment(date, 'YYYY MM DD').diff(buildDate, 'day');
          return diff >= 0 && diff <= 2;
        });
        // if (release) {
        //   console.log(row.build_version,
        //     release.version.major, release.version.candidate,
        //     release.date
        //   );
        // } else {
        //   console.log(row.build_version, buildDate.format('YYYY-MM-DD'));
        // }
        result = {
          date: buildDate.format('YYYY-MM-DD'),
          release: release && release.date,
          candidate: release && release.version.candidate,
          build: row.build_id,
          version: row.build_version,
          dates: [],
          startDate: row.activity_date,
        };
        lookup.push(result);
      }
      if (row.main_crash_rate < 10 && row.main_crash_rate > 2.5) {
        result.dates.push({
          date: row.activity_date,
          rate: row.main_crash_rate,
        });
      }
      return lookup;
    }, []);
    results.forEach((result) => {
      result.dates = sortBy(
        result.dates,
        'date',
        (a) => Date.parse(a)
      ).slice(0, 14);
      const rates = result.dates
        .slice(4)
        .map(({ rate }) => rate);
      if (rates.length > 1) {
        result.rate = median(rates) || 0;
        result.variance = standardDeviation(rates) || 0;
      }
    });
    results = sortBy(results, 'build');
    ctx.body = results;
  })

  .get('/result', async (ctx) => {
    const versions = await fetchLast4Beta();
    const uptime = await fetchUptime(versions);
    const raw = await fetchJson('https://crash-analysis.mozilla.com/rkaiser/Firefox-daily.json');
    const expr = new RegExp(`^(${versions.join('|')})\\..*0b(\\d+)`);
    const crashes = {};
    const result = { uptime, crashes };
    for (const version in raw) {
      const match = version.match(expr);
      if (!match) {
        continue;
      }
      const major = match[1];
      const tail = match[2];
      const dates = [];
      for (const date in raw[version]) {
        const entry = raw[version][date];
        dates.push({
          date,
          adu: entry.adu,
          count: entry.crashes,
        });
      }
      crashes[major] = crashes[major] || {};
      crashes[major][tail] = dates;
    }
    ctx.body = result;
  })

  .get('/urls', async (ctx) => {
    // const archive = (await getHistory({ tailVersion: 5 })).reverse();
    const sites = [
      'mail.google.com',
      'facebook.com',
      'youtube.com',
      'yahoo.com',
      'web.whatsapp.com',
      'twitter.com',
      'yandex.ru',
      'mail.yandex.ru',
      'www.google.com',
      'docs.google.com',
      'tumblr.com',
      'mail.ru',
      'ok.ru',
      'wetransfer.com',
      'outlook.live.com',
    ];
    const crashIndex = await Promise.all(
      sites.map(async (host) => {
        return fetchCrashStats({
          product: 'Firefox',
          release_channel: 'release',
          version: '46.0.1',
          process_type: 'browser',
          url: `~${host}/`,
          _facets: 'signature',
          _facets_size: '50',
          _results_number: '0',
        });
      })
    );

    const signatureMap = crashIndex.map((data) => {
      return data.facets.signature.map((signature) => signature.term);
    });
    const signatureIds = uniq(flatten(signatureMap));

    const bugIndex = (await Promise.all(signatureIds.map((signature) => {
      return fetchCrashStats({
        signatures: signature,
      }, {
        endpoint: 'Bugs',
      });
    }))).map((result) => {
      return result.hits
        // .filter((hit) => hit.signature === signatureIds[i])
        .map((hit) => hit.id);
    });
    const bugIds = uniq(flatten(bugIndex));
    const query = {
      id: bugIds.join(','),
      product: 'Core',
      include_fields: 'id,component',
    };
    const bugsUrl = `https://bugzilla.mozilla.org/rest/bug?${qs.stringify(query)}`;

    const componentMap = (await fetchJson(bugsUrl, { ttl: 'day' })).bugs
      .reduce((bugs, { id, component }) => {
        bugs[id] = component && component.split(': ')[0];
        return bugs;
      }, {});

    const signatureToBugs = zipObject(signatureIds, bugIndex);

    const siteAggregate = sites.map((site, siteIdx) => {
      const data = crashIndex[siteIdx];
      const components = sortBy(
        data.facets.signature.reduce((counted, signature) => {
          let component = '';
          let convidence = 1;
          if (/^shutdownhang/.test(signature.term)) {
            return counted;
          }
          if (/^OOM/.test(signature.term)) {
            component = 'OOM';
          } else {
            const bugs = signatureToBugs[signature.term];
            const sorted = sortBy(
              toPairs(
                countBy(
                  without(
                    bugs.map((bug) => componentMap[bug]),
                    'Untriaged', 'XPCOM', undefined
                  )
                )
              ),
              1
            );
            if (!sorted.length) {
              return counted;
            }
            sorted.reverse();
            convidence = sorted[0][1] / bugs.length;
            component = sorted[0][0];
          }
          if (!component) {
            return counted;
          }
          const existing = find(counted, { name: component });
          if (!existing) {
            counted.push({
              name: component,
              convidence,
              ratio: signature.count,
              signatures: [signature.term],
              bugs: [],
            });
          } else {
            existing.ratio += signature.count;
            existing.signatures.push(signature.term);
          }
          return counted;
        }, []),
        'ratio'
      ).reverse();
      const componentSum = sumBy(components, 'ratio');
      components.forEach((entry) => {
        entry.ratio /= componentSum;
        // Object.keys(componentMap).forEach((bug) => {
        //   if () {
        //
        //   }
        //   const component = componentMap[bug];
        //   if (component === entry.name) {
        //     entry.bugs
        //   }
        // });
      });
      return {
        site,
        components,
        ratio: data.total,
      };
    });

    const crashSum = sumBy(siteAggregate, 'ratio');
    siteAggregate.forEach((entry) => {
      entry.ratio /= crashSum;
    });

    ctx.body = sortBy(siteAggregate, 'ratio').reverse();
  });
