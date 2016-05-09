import Router from 'koa-router';
import getVersions from './release/versions';
import { getRegressionCount } from './bz/regressions';

export const router = new Router();

router
  .get('/regressions', async function (ctx, next) {
    const versions = await getVersions();
    const start = versions.release;
    const counts = [];
    for (let i = 0; i <= 5; i++) {
      const version = parseInt(start) - i;
      const count = await getRegressionCount(version);
      counts.push({ version, count });
    }
    ctx.body = counts;
  });
