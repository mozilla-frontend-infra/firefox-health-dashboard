import qs from 'qs';
import fetchJson from '../fetch/json';
import getVersions from '../release/versions';

const base = 'https://bugzilla.mozilla.org/rest/bug';

export async function getRelease(bugs) {
  const fields = [
    'id',
    'cf_tracking_firefox_relnote',
    'target_milestone',
  ];
  const latest = parseInt((await getVersions()).aurora, 10) + 1;
  for (let i = latest - 10; i <= latest; i++) {
    fields.push(`cf_status_firefox${i}`);
  }
  const query = qs.stringify({
    id: bugs.join(','),
    include_fields: fields.join(','),
  });
  const response = await fetchJson(`${base}?${query}`);
  return response.bugs.map((bug) => {
    let version = null;
    if (bug.cf_tracking_firefox_relnote !== '---') {
      version = parseInt(bug.cf_tracking_firefox_relnote, 10);
    }
    if (!version) {
      for (let i = latest - 10; i <= latest; i++) {
        const field = `cf_status_firefox${i}`;
        if (/^(fixed|verified)/.test(bug[field])) {
          version = i;
          break;
        }
      }
    }
    if (!version && bug.target_milestone !== '---') {
      version = parseInt(bug.target_milestone.replace('mozilla', ''), 10);
    }
    return {
      id: bug.id,
      version: version || null,
    };
  });
}
