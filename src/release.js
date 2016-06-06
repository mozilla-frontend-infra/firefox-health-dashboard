import Router from 'koa-router';
import { getUpdates } from './release/updates';
import getVersions from './release/versions';
import { getHistory, getReleaseDate } from './release/history';
import getChromeHistory from './release/chrome';
import getCalendar from './release/calendar';

export const router = new Router();

router
  .get('/', async (ctx) => {
    ctx.body = await getVersions();
  })
  .get('/latest', async (ctx) => {
    const versions = await getVersions();
    for (const channel in versions) {
      const release = await getReleaseDate(versions[channel], { channel });
      versions[channel] = release;
    }
    ctx.body = versions;
  })
  .get('/history', async (ctx) => {
    const {
      product = 'firefox',
      channel = 'release',
      tailVersion = 0,
      major = true,
    } = ctx.request.query;
    ctx.body = await getHistory({ channel, product, tailVersion, major });
  })
  .get('/updates', async (ctx) => {
    ctx.body = await getUpdates();
  })
  .get('/calendar', async (ctx) => {
    ctx.body = await getCalendar();
  })
  .get('/chrome', async (ctx) => {
    ctx.body = await getChromeHistory();
  });
