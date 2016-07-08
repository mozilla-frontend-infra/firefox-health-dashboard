import assert from 'assert';
import qs from 'qs';
import fetchJson from './json';

export default async function fetchCrashStats(fuzzyQuery, options = {}) {
  assert.ok(process.env.CRASH_STATS_TOKEN, 'process.env.CRASH_STATS_TOKEN missing');
  let query = fuzzyQuery;
  if (typeof query !== 'string') {
    query = qs.stringify(query, { arrayFormat: 'repeat' });
  }
  options.ttl = 'day';
  options.headers = options.headers || {};
  options.headers['Auth-Token'] = process.env.CRASH_STATS_TOKEN;
  const endpoint = options.endpoint || 'SuperSearchUnredacted';
  return await fetchJson(`https://crash-stats.mozilla.com/api/${endpoint}/?${query}`, options);
}
