import assert from 'assert';
import fetchJson from './json';

export default async function fetchRedash(query, options = {}) {
  assert.ok(process.env.REDASH_API_KEY, 'process.env.REDASH_API_KEY missing');
  options.headers = options.headers || {};
  options.headers.Authorization = `Key ${process.env.REDASH_API_KEY}`;
  return await fetchJson(`https://sql.telemetry.mozilla.org/api/queries/${query}/results.json`, options);
}
