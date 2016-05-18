import Router from 'koa-router';
import { getUpdates } from './release/updates';
import getVersions from './release/versions';
import { getArchive, getReleaseDate } from './release/archive';
import getHistory from './release/history';
import getChromeHistory from './release/chrome';
import getCalendar from './release/calendar';

export const router = new Router();

router
  .get('/', async function (ctx, next) {
    ctx.body = await getVersions();
  })
  .get('/latest', async function (ctx, next) {
    const versions = await getVersions();
    for (let channel in versions) {
      const release = await getReleaseDate(versions[channel], channel);
      versions[channel] = release;
    }
    ctx.body = versions;
  })
  .get('/history', async function (ctx, next) {
    const channel = ctx.request.query.channel || 'release';
    const product = ctx.request.query.product || 'firefox';
    ctx.body = await getHistory(channel, product);
  })
  .get('/archive', async function (ctx, next) {
    const channel = ctx.request.query.channel || 'release';
    ctx.body = await getArchive(channel);
  })
  .get('/updates', async function (ctx, next) {
    ctx.body = await getUpdates();
  })
  .get('/calendar', async function (ctx, next) {
    ctx.body = await getCalendar();
  })
  .get('/chrome', async function (ctx, next) {
    ctx.body = await getChromeHistory();
  });
