import fetchJson from '../fetch/json';

export default async function getVersions() {
  const raw = await fetchJson('https://product-details.mozilla.org/1.0/firefox_versions.json');
  return {
    release: raw.LATEST_FIREFOX_VERSION,
    beta: raw.LATEST_FIREFOX_DEVEL_VERSION,
    aurora: raw.FIREFOX_AURORA,
    nightly: raw.FIREFOX_NIGHTLY,
  };
}
