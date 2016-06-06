import { createClient } from 'then-redis';
import fetch from 'node-fetch';
import moment from 'moment';

const defaultTtl = moment.duration(4, 'hours').as('seconds');

const db = process.env.REDIS_URL ? createClient(process.env.REDIS_URL) : null;
const devCache = {};

export default async function fetchText(url, {
  fuzzyTtl = defaultTtl,
  headers = {},
  method = 'get',
} = {}) {
  let ttl = fuzzyTtl;
  if (typeof ttl === 'string') {
    ttl = moment.duration(1, ttl).as('seconds');
  }
  const cached = db ? await db.get(url) : devCache[url];
  if (cached) {
    return cached;
  }
  const response = await fetch(url, { method, headers });
  if (!response.ok) {
    console.error(`Response for ${url} not OK: ${response.status}`);
    return null;
  }
  const text = await response.text();
  if (db) {
    db.set(url, text);
    db.expire(url, ttl);
  } else {
    devCache[url] = text;
  }
  return text;
}
