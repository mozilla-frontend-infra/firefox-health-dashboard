import Router from 'koa-router';
import { getChromePopular } from './status/chromestatus';

export const router = new Router();

router

  .get('/chromestatus/popular', async (ctx) => {
    const features = await getChromePopular();
    ctx.body = features;
  });
