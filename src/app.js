import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import logger from 'koa-logger';
import responseTime from 'koa-response-time';
import compress from 'koa-compress';
import Router from 'koa-router';
import cors from 'koa-cors';
import staticCache from 'koa-static-cache';
import webpackMiddleware from 'koa-webpack-dev-middleware';
import webpack from 'webpack';
import webpackConfig from './../webpack.config.babel.js';
import Koa from 'koa';
import rewrite from 'koa-rewrite';

const app = new Koa();

app.use(logger());
app.use(responseTime());
app.use(cors());
app.use(compress());

const api = new Router();
api.get('/version', (ctx, next) => {
  ctx.body = {
    version: require('../package.json').version
  };
});

import { router as release } from './release';
api.use('/release', release.routes());
import { router as crashes } from './crashes';
api.use('/crashes', crashes.routes());
import { router as bz } from './bz';
api.use('/bz', bz.routes());

const index = new Router();
index.use('/api', api.routes());
app.use(index.routes());

app.use(rewrite('/regressions', '/'));
app.use(rewrite('/crashes', '/'));

/* istanbul ignore if */
if (process.env.NODE_ENV !== 'test') {
  if (process.env.NODE_ENV === 'production') {
    app.use(staticCache('./dist', {
      maxAge: 24 * 60 * 60,
      alias: {
        '/': '/index.html'
      }
    }));
  } else {
    app.use(webpackMiddleware(webpack(webpackConfig), {
      noInfo: true
    }));
  }

  const server = http.createServer(app.callback());
  server.on('listening', (evt) => {
    const { address, port } = server.address();
    console.log('http://%s:%d/ in %s', address, port, process.env.NODE_ENV);
  });
  server.listen(process.env.PORT || 3000);
}

export default app;
