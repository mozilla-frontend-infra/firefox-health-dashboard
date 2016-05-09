import assert from 'assert';
import fetchJson from './json';

export default async function fetchRedash(query) {
  assert.ok(process.env.REDASH_API_KEY, 'process.env.REDASH_API_KEY missing');
  return await fetchJson(`https://sql.telemetry.mozilla.org/api/queries/${query}`, {
    'Authorization': `Key ${process.env.REDASH_API_KEY}`
  });
}
