import fetchJson from '../fetch/json';
import { parse as parseVersion } from '../meta/version';

const base = 'https://bugzilla.mozilla.org/rest/bug';
function patchQuery(input, replace) {
  return Object.keys(replace).reduce((query, key) => {
    return query.replace(new RegExp(key, 'g'), replace[key]);
  }, input);
}

const queryMissed = `keywords=regression%2C &keywords_type=allwords&list_id=13007736&
o1=anywordssubstr&o2=equals&chfield=cf_status_firefox46&chfieldfrom=2016-04-25&
chfieldvalue=affected&v1=unaffected%2C %3F%2C ---%2C wontfix&v2=affected&f1=cf_status_firefox45&
resolution=FIXED&resolution=SUPPORT&resolution=MOVED&query_format=advanced&f2=cf_status_firefox46`;

export async function getMissedCount(version, date) {
  version = parseVersion(version).major;
  const prior = version - 1;
  const query = patchQuery(queryMissed, {
    cf_status_firefox46: `cf_status_firefox${version}`,
    cf_status_firefox45: `cf_status_firefox${prior}`,
    '2016-04-25': date,
  });
  const response = await fetchJson(`${base}?${query}&include_fields=id`);
  return {
    query: query,
    count: response.bugs.length,
  };
}
