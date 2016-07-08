import Router from 'koa-router';
import moment from 'moment';
import {
  median,
  standardDeviation,
  geometricMean,
 } from 'simple-statistics';
import qs from 'qs';
import { parse as parseVersion } from './meta/version';
import fetchJson from './fetch/json';
import fetchRedash from './fetch/redash';
import fetchCrashStats from './fetch/crash-stats';
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

const dateBlacklist = [
  '2016-05-08',
];
const baseline = new Date('2016-01-17');

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
      if (time.diff(baseline, 'days') < -3) {
        return result;
      }
      const entry = raw[date];
      let rate = (entry.crashes.Browser / entry.adi) * 100;
      const day = moment(date, 'YYYY MM DD').format('dd');
      // Deseasonalize with hardcoded seasonality index
      if (product === 'firefox') {
        rate *= {
          Fr: 0.99,
          Sa: 0.91,
          Su: 0.92,
          Mo: 1,
        }[day] || 1;
      } else {
        rate *= {
          Fr: 0.99,
          Sa: 0.93,
          Su: 0.895,
          Mo: 0.99,
        }[day] || 1;
      }
      result.push({ date, rate });
      return result;
    }, []);
    ctx.body = ratesByDay;
  })

  .get('/', async (ctx) => {
    const raw = await fetchRedash(331);
    const reduced = raw.query_result.data.rows
      .map((row) => {
        return {
          date: row.activity_date,
          rate: row.main_crash_rate,
        };
      })
      .filter(({ rate, date }) => {
        return rate > 3 && dateBlacklist.indexOf(date) < 0;
      });
    ctx.body = reduced;
  })

  .get('/beta', async (ctx) => {
    const raw = await fetchRedash(475);
    const results = raw.query_result.data.rows.map((row) => {
      return {
        date: row.activity_date,
        rate: row.main_crash_rate,
      };
    });
    ctx.body = results;
  })

  .get('/beta/builds', async (ctx) => {
    const history = await getHistory({
      channel: 'beta',
      tailVersion: 5,
    });
    const betaRaw = sortBy(
      (await fetchRedash(207)).query_result.data.rows,
      'activity_date',
      (a) => Date.parse(a)
    );
    const betaE10sRaw = sortBy(
      (await fetchRedash(497)).query_result.data.rows,
      'activity_date',
      (a) => Date.parse(a)
    );

    let builds = betaRaw.reduce((lookup, row) => {
      if (dateBlacklist.indexOf(row.activity_date) > -1) {
        return lookup;
      }
      let result = find(lookup, ({ build }) => build === row.build_id);
      if (!result) {
        const buildDate = moment(row.build_id, 'YYYYMMDD');
        const release = find(history, ({ date }) => {
          const diff = moment(date, 'YYYY MM DD').diff(buildDate, 'day');
          return diff >= 0 && diff <= 2;
        });
        result = {
          date: buildDate.format('YYYY-MM-DD'),
          release: release && release.date,
          candidate: release
            ? parseVersion(release.version).candidate
            : 'rc',
          build: row.build_id,
          version: row.build_version,
          dates: [],
          startDate: row.activity_date,
        };
        lookup.push(result);
      }
      const add = {
        date: row.activity_date,
        rate: row.main_crash_rate,
        hours: row.usage_kilohours,
      };
      const e10sRow = find(betaE10sRaw, {
        activity_date: row.activity_date,
        build_id: row.build_id,
      });
      if (e10sRow) {
        add.e01sMain = e10sRow.main_crash_rate;
        add.e01sContent = e10sRow.content_crash_rate;
      }
      result.dates.push(add);
      return lookup;
    }, []);
    builds.forEach((build) => {
      build.dates = sortBy(
        build.dates,
        'date',
        (a) => Date.parse(a)
      );
      build.hours = sumBy(build.dates, 'hours');
      const avg = median(build.dates.map(({ rate }) => rate));
      const brokenDate = (build.dates[0].rate > avg);
      const slice = brokenDate
        ? build.dates.slice(-Math.round(build.dates.length / 2))
        : build.dates.slice(1);
      if (slice.length > 2) {
        const rates = slice.map(({ rate }) => rate);
        build.rate = median(rates) || 0;
        build.variance = standardDeviation(rates) || 0;
        build.dates = build.dates.filter(({ rate }) => {
          return Math.abs(build.rate - rate) < build.variance * 2;
        });
        if (build.rate < 3 && build.candidate === 'rc') {
          build.rate = 0;
        }
      }
    });
    builds = sortBy(builds, 'build');

    const releases = builds.reduce((lookup, result) => {
      let entry = find(lookup, ({ version }) => version === result.version);
      if (!entry) {
        entry = {
          version: result.version,
          builds: [],
        };
        lookup.push(entry);
      }
      entry.builds.push(result);
      return lookup;
    }, []);
    releases.forEach((release) => {
      release.hours = sumBy(release.builds, 'hours');
      const rates = release.builds
        .map(({ rate }) => rate)
        .filter((rate) => rate > 0);
      if (rates.length > 0) {
        release.rate = geometricMean(rates) || 0;
        release.variance = standardDeviation(rates) || 0;
      }
    });
    ctx.body = releases;
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
