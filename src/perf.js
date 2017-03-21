import Router from 'koa-router';
import GitHubApi from 'github';
import json2csv from 'json2csv';
import moment from 'moment';
import { getSummary, getEvolution } from './perf/tmo';

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
  return {
    mean: hist.mean(),
    p5: hist.percentile(5),
    p50: hist.percentile(50),
    p75: hist.percentile(75),
    p95: hist.percentile(95),
    p99: hist.percentile(99),
  };
};

const summarizeIpcTable = async (metric) => {
  const evolutions = await getEvolution({
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
  //
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

  .get('/evolution', async (ctx) => {
    const opts = Object.assign({}, ctx.request.query);
    const evolution = await getEvolution(opts);
    if (!evolution) {
      ctx.body = null;
      return;
    }
    ctx.body = evolution.map((histogram, i, date) => {
      return Object.assign(
        summarizeHistogram(histogram),
        {
          date: moment(date).format('YYYY-MM-DD'),
        },
      );
    });
  })

  .get('/tracking', async (ctx) => {
    const opts = ctx.request.query;
    const evolution = await getEvolution(opts);
    if (!evolution) {
      ctx.body = { status: 0 };
      return;
    }
    const histogram = evolution.histogram();
    ctx.body = summarizeHistogram(histogram);
  })

  .get('/release', async (ctx) => {
    const metrics = [
      'CHECKERBOARD_SEVERITY',
      'TIME_TO_NON_BLANK_PAINT_MS',
      'FX_TAB_SWITCH_TOTAL_E10S_MS',
      ['TIME_TO_FIRST_CLICK_V2', 'TIME_TO_FIRST_CLICK'],
      ['TIME_TO_FIRST_KEY_INPUT_V2', 'TIME_TO_FIRST_KEY_INPUT'],
      ['TIME_TO_FIRST_MOUSE_MOVE_V2', 'TIME_TO_FIRST_MOUSE_MOVE'],
      ['TIME_TO_FIRST_SCROLL_V2', 'TIME_TO_FIRST_SCROLL'],
      'TOTAL_SCROLL_Y',
      'PAGE_MAX_SCROLL_Y',
    ];
    const baseline = await Promise.all(metrics.map(metric => getSummary({ metric, version: '52', channel: 'beta', application: 'Firefox' })));
    const tracking = await Promise.all(metrics.map(metric => getSummary({ metric, version: '54', channel: 'nightly', application: 'Firefox', e10sEnabled: true })));
    ctx.body = metrics.map((metric, idx) => {
      return {
        metric: metric,
        baseline: baseline[idx],
        tracking: tracking[idx],
      };
    });
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
