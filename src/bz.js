import Router from 'koa-router';
import getVersions from './release/versions';
import { getHistory } from './release/history';
import { getFixedCount, getMissedCount } from './bz/regressions';

export const router = new Router();

router

  .get('/regressions', async (ctx) => {
    const versions = await getVersions();
    const start = versions.release;
    const counts = [];
    for (let i = 0; i < 1; i++) {
      const version = parseInt(start, 10) - i;
      const count = await getFixedCount(version);
      counts.push({ version, count });
    }
    ctx.body = counts;
  })

  .get('/regressions/missed', async (ctx) => {
    const history = await getHistory({
      major: true,
      tailVersion: 5,
    });
    history.reverse();
    const counts = await Promise.all(
      history.map((release) => {
        const version = release.version.major;
        return getMissedCount(version, release.date);
      })
    );
    ctx.body = counts.map(({ count, query }, idx) => {
      return {
        count,
        query,
        version: history[idx].version.major,
      };
    });
  });
