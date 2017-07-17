import qs from 'qs';
import fetchJson from '../fetch/json';
import getVersions from '../release/versions';

const base = 'https://bugzilla.mozilla.org/rest/bug';

export async function getRelease(bugs) {
  const fields = ['id', 'cf_tracking_firefox_relnote', 'target_milestone', 'assigned_to', 'flags'];
  const latest = parseInt((await getVersions()).nightly, 10);
  for (let i = latest - 10; i <= latest; i += 1) {
    fields.push(`cf_status_firefox${i}`);
  }
  if (!bugs.length) {
    return [];
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
      for (let i = latest - 10; i <= latest; i += 1) {
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
    let contact = null;
    if (!version) {
      if (bug.flags) {
        const ni = bug.flags.find(flag => flag.name === 'needinfo');
        if (ni) {
          contact = ni.requestee;
        }
      }
      if (!contact && bug.assigned_to_detail) {
        contact = bug.assigned_to_detail.real_name.replace(/.*(:[a-z0-9]+).*/, '$1');
      }
    }
    return {
      id: bug.id,
      contact: contact,
      version: version || null,
    };
  });
}
