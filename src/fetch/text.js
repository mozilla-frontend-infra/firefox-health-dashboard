import { createClient } from 'then-redis';
import fetch from 'node-fetch';

const oneHour = 60 * 60;

const db = process.env.REDIS_URL ? createClient(process.env.REDIS_URL) : null;
const devCache = {};

export default async function fetchText(url, xml = false) {
  const cached = db ? await db.get(url) : devCache[url];
  if (cached) {
    return cached;
  }
  const response = await fetch(url);
  if (!response.ok) {
    console.error(`Response for ${url} not OK: ${response.status}`);
    return null;
  }
  const text = await response.text();
  if (db) {
    db.set(url, text);
    db.expire(url, oneHour);
  } else {
    devCache[url] = text;
  }
  return text;
}
