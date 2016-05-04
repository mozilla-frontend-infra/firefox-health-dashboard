import http from 'http';
import logger from 'koa-logger';
import responseTime from 'koa-response-time';
import compress from 'koa-compress';
import Router from 'koa-router';
import cors from 'koa-cors';
import staticCache from 'koa-static-cache';
import Koa from 'koa';

const app = new Koa();

app.use(logger());
app.use(responseTime());
app.use(cors());
app.use(compress());

import { router as release } from './release';
import { router as crashes } from './crashes';

const index = new Router();
index.get('/', (ctx, next) => {
  ctx.body = '/';
});
index.use('/release', release.routes());
index.use('/crashes', crashes.routes());

app.use(index.routes());

app.use(staticCache('./dist', {
  maxAge: 24 * 60 * 60
}));

if (process.env.NODE_ENV !== 'test') {
  const server = http.createServer(app.callback());
  server.on('listening', (evt) => {
    const { address, port } = server.address();
    console.log(`http://${address}:${port}/`);
  });
  server.listen(process.env.NOW ? null : 3000);
}

export default app;
