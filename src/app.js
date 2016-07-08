import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import logger from 'koa-logger';
import responseTime from 'koa-response-time';
import Router from 'koa-router';
import cors from 'koa-cors';
import staticCache from 'koa-static-cache';
import webpackDevMiddleware from 'koa-webpack-dev-middleware';
import webpackHotMiddleware from 'koa-webpack-hot-middleware';
import webpack from 'webpack';
import webpackConfig from './../webpack.config.babel.js';
import Koa from 'koa';
import { createClient } from 'then-redis';
const version = require('../package.json').version;

const app = new Koa();

app.use(logger());
app.use(responseTime());
app.use(cors());

const api = new Router();
api.get('/version', (ctx) => {
  ctx.body = {
    version: version,
    source: process.env.SOURCE_VERSION || '',
  };
});
api.get('/cache/flush', async (ctx) => {
  const db = createClient(process.env.REDIS_URL);
  const rows = await db.keys('cache:*');
  const flushed = await Promise.all(rows.map((row) => db.del(row)));
  await db.quit();
  ctx.body = {
    flushed: flushed.length,
  };
});

import { router as release } from './release';
api.use('/release', release.routes());
import { router as crashes } from './crashes';
api.use('/crashes', crashes.routes());
import { router as bz } from './bz';
api.use('/bz', bz.routes());
import { router as status } from './status';
api.use('/status', status.routes());

const index = new Router();
index.use('/api', api.routes());
app.use(index.routes());

app.use(async (ctx, next) => {
  const route = ctx.path;
  if (/^\/[a-z\/]*$/.test(route)) {
    ctx.path = '/index.html';
  }
  await next();
  ctx.path = route;
});

/* istanbul ignore if */
if (process.env.NODE_ENV !== 'test') {
  if (process.env.NODE_ENV === 'production') {
    app.use(staticCache('./dist', {
      maxAge: 24 * 60 * 60,
    }));
  } else {
    const compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
      noInfo: true,
      hot: true,
      historyApiFallback: true,
    }));
    app.use(webpackHotMiddleware(compiler));
  }

  const server = http.createServer(app.callback());
  server.on('listening', () => {
    const { address, port } = server.address();
    console.log('http://%s:%d/ in %s', address, port, process.env.NODE_ENV || 'dev');
  });
  server.listen(process.env.PORT || 3000);
}

export default app;
