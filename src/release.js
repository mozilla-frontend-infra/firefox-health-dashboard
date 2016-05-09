import Router from 'koa-router';
import { getUpdates } from './release/updates';
import getVersions from './release/versions';
import { getArchive, getReleaseDate } from './release/archive';
import getChromeHistory from './release/chrome';
import getCalendar from './release/calendar';

export async function getHistory(channel = 'release', tail = 10) {
  const versions = await getVersions();
  const start = parseInt(versions[channel]);
  const lookup = [];
  for (let i = 0; i < tail; i++) {
    const release = await getReleaseDate(start - i, channel);
    lookup.push({
      version: release.version,
      date: release.date
    });
  }
  return lookup;
}

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
    ctx.body = await getHistory(channel);
  })
  .get('/archive', async function (ctx, next) {
    ctx.body = await getArchive();
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
