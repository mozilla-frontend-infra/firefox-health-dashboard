import Router from 'koa-router';
import { getChromePopular } from './status/chrome';
import { getInDevelopment } from './status/caniuse';

export const router = new Router();

router

  .get('/caniuse', async (ctx) => {
    const features = await getInDevelopment();
    ctx.body = features;
  })

  .get('/chrome/popular', async (ctx) => {
    const features = await getChromePopular();
    ctx.body = features;
  });
