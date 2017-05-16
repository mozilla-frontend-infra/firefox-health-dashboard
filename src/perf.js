import Router from 'koa-router';
import GitHubApi from 'github';
import json2csv from 'json2csv';
import moment from 'moment';
import { stringify } from 'query-string';
import {
  median,
  standardDeviation,
} from 'simple-statistics';
import { getSummary, getEvolution, getLatestEvolution } from './perf/tmo';
import fetchJson from './fetch/json';
import channels from './release/channels';
import getVersions from './release/versions';
import { getReleaseDate } from './release/history';
import { sanitize } from './meta/version';
import getCalendar from './release/calendar';

channels.splice(2, 1);

export const router = new Router();
const gh = new GitHubApi();

gh.authenticate({
  type: 'oauth',
  token: '0d762cbc855c11db20a0e410a5a13c928a1d2ef3',
  headers: {
    Accept: 'application/vnd.github.v3.raw',
  },
});

const summarizeHistogram = (hist) => {
  if (!hist.mean) {
    console.error('Unexpected histogram', hist);
    return null;
  }
  return {
    // p5: hist.percentile(5),
    // p25: hist.percentile(25),
    p50: hist.percentile(50),
    p95: hist.percentile(95),
    // p99: hist.percentile(99),
    submissions: hist.submissions,
    count: hist.count,
  };
};

const summaryKeys = [
  // 'p5',
  // 'p25',
  'p50',
  'p95',
  'p99',
  'submissions',
  'count',
];

const windowRadius = 7;

const averageEvolution = (evolution) => {
  evolution.forEach((summary, idx) => {
    summaryKeys.forEach((key) => {
      const windo = evolution
        .slice(Math.max(0, idx - windowRadius), idx + windowRadius + 1)
        .map(entry => entry[key]);
      summary[`${key}Avg`] = median(windo);
    });
  });
  return evolution;
};

const summarizeIpcTable = async (metric) => {
  const evolutions = await getLatestEvolution({
    metric: metric,
    channel: 'nightly',
    application: 'Firefox',
  });
  return evolutions
  .filter(({ evolution }) => evolution)
  .map(({ key, evolution }) => {
    const lastDate = evolution.dates().slice(-1)[0];
    // console.log(moment().add(-7, 'days').format('YYYY-MM-DD'));
    const hist = evolution
      .dateRange(
        moment(lastDate).add(-7, 'days').toDate(),
        lastDate,
      )
      .histogram();
    return {
      key,
      count: hist.count,
      submissions: hist.submissions,
      mean: hist.mean(),
      median: hist.percentile(50),
    };
  });
};

router

  .get('/herder', async (ctx) => {
    const { signature } = ctx.request.query;
    const signatures = signature.split(',');
    const data = await fetchJson(`https://treeherder.mozilla.org/api/project/mozilla-central/performance/data/?${stringify({
      framework: 1,
      interval: 31536000 / 2,
      signatures: signatures,
    })}`);
    ctx.body = signatures.map((current) => {
      const series = data[current].reduce((reduced, entry) => {
        const date = moment(entry.push_timestamp * 1000).format('YYYY-MM-DD');
        let found = reduced.find(needle => needle.date === date);
        if (!found) {
          found = {
            runs: [],
            value: entry.value,
            avg: entry.value,
            date: date,
          };
          reduced.push(found);
        }
        found.runs.push({
          time: entry.push_timestamp,
          value: entry.value,
        });
        return reduced;
      }, []);
      series.forEach((serie) => {
        serie.value = median(serie.runs.map(entry => entry.value));
        serie.time = median(serie.runs.map(entry => entry.time));
      });
      const runs = series.reduce((all, entry) => {
        return all.concat(entry.runs);
      }, []);
      // const md = median(values);
      // const sd = standardDeviation(values);
      const slice = 60 * 60 * 24 * 7;
      series.forEach((entry, idx) => {
        const now = entry.runs[0].time;
        const sliced = runs
          .filter((check) => {
            return check.time > now - slice && check.time < now + slice;
          })
          .map(check => check.value);
        entry.avg = median(sliced);
      });
      return series;
    });
  })

  // .get('/evolution', async (ctx) => {
  //   const opts = Object.assign({}, ctx.request.query);
  //   const evolution = await getEvolution(opts);
  //   if (!evolution) {
  //     ctx.body = [];
  //     return;
  //   }
  //   ctx.body = evolution.map((histogram, i, date) => {
  //     return {
  //       date: moment(date).format('YYYY-MM-DD'),
  //       mean: histogram.mean(),
  //       50: histogram.percentile(50),
  //       75: histogram.percentile(75),
  //       95: histogram.percentile(95),
  //       99: histogram.percentile(99),
  //     };
  //   });
  // })

  .get('/version-evolutions', async (ctx) => {
    const query = Object.assign({}, ctx.request.query);
    const channelVersions = await getVersions();
    const calendar = await getCalendar();
    const start = parseInt(channelVersions.nightly, 10);
    const oldestRelease = start - 3;
    const versions = [];
    const nightlyToRelease = channels.slice().reverse();
    let endDate = null;
    let oldestNightlyStart = null;
    const channelDates = [];
    for (let version = start; version >= start - 5; version -= 1) {
      const evolutions = await Promise.all(
        nightlyToRelease.map((channel, channelIdx) => {
          if (version > parseInt(channelVersions[channel], 10)) {
            return null;
          }
          return getEvolution(Object.assign({}, query, {
            channel,
            version: version,
            useSubmissionDate: channel !== 'nightly',
          }));
        },
      ));
      if (!evolutions[0]) {
        break;
      }
      if (channelDates.length) {
        nightlyToRelease.forEach((channel, channelIdx) => {
          if (!evolutions[channelIdx] || !channelDates[channelIdx]) {
            return;
          }
          evolutions[channelIdx] = evolutions[channelIdx].dateRange(
            oldestNightlyStart || evolutions[channelIdx].dates()[0],
            channelDates[channelIdx],
          );
          if (evolutions[channelIdx] && !evolutions[channelIdx].dates().length) {
            evolutions[channelIdx] = null;
          }
        });
      }
      nightlyToRelease.forEach((channel, channelIdx) => {
        if (!evolutions[channelIdx]) {
          return;
        }
        channelDates[channelIdx] = evolutions[channelIdx].dates()[0];
      });
      if (oldestRelease === version) {
        oldestNightlyStart = channelDates[0];
        console.log(oldestRelease, oldestNightlyStart);
      }
      const nightlyDate = moment(evolutions.find(evoluion => evoluion).dates()[0]).format('YYYY-MM-DD');
      const versionStr = sanitize(version);
      let releaseDate = (await getReleaseDate(versionStr)).date;
      if (!releaseDate) {
        const planned = calendar.find(release => release.version === versionStr);
        if (planned) {
          releaseDate = planned.date;
        }
      }
      versions.push({
        version: versionStr,
        start: nightlyDate,
        release: releaseDate,
        end: endDate,
        channels: nightlyToRelease
          .map((channel, i) => {
            if (!evolutions[i]) {
              return null;
            }
            const submissionsAvg = median(evolutions[i].map(date => date.submissions));
            const countAvg = median(evolutions[i].map(date => date.count));
            const cutoff = submissionsAvg * 0.5;
            const dates = averageEvolution(
              evolutions[i]
                .map((histogram, j, date) => {
                  if (histogram.submissions < cutoff) {
                    return null;
                  }
                  return Object.assign(
                    summarizeHistogram(histogram),
                    {
                      date: moment(date).format('YYYY-MM-DD'),
                    },
                  );
                })
                .filter(entry => entry && entry.p50),
            );
            return {
              channel: channel,
              submissionsAvg: submissionsAvg,
              countAvg: countAvg,
              dates: dates,
            };
          }),
      });
      endDate = releaseDate;
    }

    ctx.body = versions;
  })

  .get('/tracking', async (ctx) => {
    const opts = ctx.request.query;
    const evolution = await getLatestEvolution(opts);
    if (!evolution) {
      ctx.body = { status: 0 };
      return;
    }
    const histogram = evolution.histogram();
    ctx.body = summarizeHistogram(histogram);
  })

  .get('/ipc', async (ctx) => {
    const summary = await summarizeIpcTable('IPC_SYNC_MAIN_LATENCY_MS');
    ctx.body = json2csv({ data: summary });
  })

  .get('/ipc/write', async (ctx) => {
    const summary = await summarizeIpcTable('IPC_WRITE_MAIN_THREAD_LATENCY_MS');
    ctx.body = json2csv({ data: summary });
  })

  .get('/ipc/read', async (ctx) => {
    const summary = await summarizeIpcTable('IPC_READ_MAIN_THREAD_LATENCY_MS');
    ctx.body = json2csv({ data: summary });
  })

  .get('/ipc/mm', async (ctx) => {
    const summary = await summarizeIpcTable('IPC_SYNC_MESSAGE_MANAGER_LATENCY_MS');
    ctx.body = json2csv({ data: summary });
  })

  .get('/e10s/hangs', async (ctx) => {
    const beta = await gh.repos.getContent({
      owner: 'mozilla',
      repo: 'e10s_analyses',
      path: '',
    });
    const tree = (await gh.gitdata.getTree({
      owner: 'mozilla',
      repo: 'e10s_analyses',
      sha: beta.find(({ path }) => path === 'beta').sha,
      recursive: 1,
    })).tree.filter(({ path }) => {
      return /e10s_experiment\.ipynb/.test(path);
    });
    const blobs = await Promise.all(
      tree.map(({ sha }) => {
        return gh.gitdata.getBlob({
          owner: 'mozilla',
          repo: 'e10s_analyses',
          sha: sha,
        });
      }),
    );

    // const commits = await Promise.all(
    //   tree.map(({ path }) => {
    //     return gh.repos.getCommits({
    //       owner: 'mozilla',
    //       repo: 'e10s_analyses',
    //       path: `beta/${path}`,
    //     });
    //   })
    // );

    const hangs = blobs
      .map((blob, idx) => {
        const re = /Median difference in hangs over 100ms per minute \(parent\)[^(]+\(([^)]+)/;
        const str = Buffer.from(blob.content, 'base64').toString('utf8');
        const bits = str.match(re);
        const path = tree[idx].path;
        if (bits) {
          return [path].concat(bits[1].split(', ').map(Number));
        }
        return null;
      })
      .filter(data => data);

    ctx.body = hangs;
  });
