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

const app = new Koa();

app.use(logger());
app.use(responseTime());
app.use(cors());
app.use(compress());

import { router as release } from './release';
import { router as crashes } from './crashes';

const index = new Router();
index.get('/version', (ctx, next) => {
  ctx.body = require('../package.json').version;
});
index.use('/release', release.routes());
index.use('/crashes', crashes.routes());
app.use(index.routes());

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
    console.log(`http://${address}:${port}/`);
  });
  server.listen(process.env.PORT || 3000);
}

export default app;
