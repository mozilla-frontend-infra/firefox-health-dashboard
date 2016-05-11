import Router from 'koa-router';
import getVersions from './release/versions';
import getHistory from './release/history';
import { getFixedCount, getMissedCount } from './bz/regressions';

export const router = new Router();

router

  .get('/regressions', async function (ctx, next) {
    const versions = await getVersions();
    const start = versions.release;
    const counts = [];
    for (let i = 0; i < 1; i++) {
      const version = parseInt(start) - i;
      const count = await getFixedCount(version);
      counts.push({ version, count });
    }
    ctx.body = counts;
  })

  .get('/regressions/missed', async function (ctx, next) {
    const history = await getHistory('release', 5);
    const counts = [];
    for (var i = 0; i < history.length; i++) {
      const release = history[i];
      const version = parseInt(release.version);
      let { count, query } = await getMissedCount(version, release.date);
      counts.push({ version, count, query });
    }
    ctx.body = counts;
  });
