import Router from 'koa-router';
import { stringify } from 'qs';
import fetchJson from './fetch/json';
import { getRelease } from './bz/release';
// import { getHistory } from './release/history';
// import { getMissedCount } from './bz/regressions';

export const router = new Router();

router

  .get('/status', async (ctx) => {
    const { ids } = ctx.request.query;
    ctx.body = await getRelease(ids);
  })

  .get('/regressions/missed', async (ctx) => {
    // const history = await getHistory({
    //   major: true,
    //   tailVersion: 5,
    // });
    // history.reverse();
    // const counts = await Promise.all(
    //   history.map((release) => {
    //     const version = release.version;
    //     return getMissedCount(version, release.date);
    //   })
    // );
    ctx.body = [
      { count: 86, version: 40 },
      { count: 93, version: 41 },
      { count: 109, version: 42 },
      { count: 92, version: 43 },
      { count: 87, version: 44 },
      { count: 76, version: 45 },
      { count: 0, version: 46 },
      { count: 0, version: 47 },
    ];
    // counts.map(({ count, query }, idx) => {
    //   return {
    //     count,
    //     query,
    //     version: history[idx].version,
    //   };
    // });
  });
