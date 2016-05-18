import moment from 'moment';
import assert from 'assert';
// import semver from 'semver';
import fetchHtml from '../fetch/html';
import { parse as parseVersion } from '../meta/version';

export async function getArchive(filter = 'release', product = 'firefox') {
  let url = 'https://archive.mozilla.org/pub/firefox/releases/';
  if (product === 'fennec') {
    url = 'https://archive.mozilla.org/pub/mobile/releases/';
  }
  const $ = await fetchHtml(url);
  const versions = [];
  $('tr a').each((i, element) => {
    const version = $(element).text().slice(0, -1);
    const { major, channel } = parseVersion(version);
    if (major > 30 && (!filter || channel === filter)) {
      versions.push(version);
    }
  });
  versions.reverse();
  return versions;
}

export async function getReleaseDate(version, channel = 'release', product = 'firefox') {
  let url = `https://archive.mozilla.org/pub/firefox/releases/${version}/`;
  if (product === 'fennec') {
    url = `https://archive.mozilla.org/pub/mobile/releases/${version}/`;
  }
  if (typeof version === 'number') {
    version = `${version}.0`;
    if (channel !== 'release') {
      version += `${channel.charAt(0)}1`;
    }
  }
  assert.ok(parseVersion(version).major, `Invalid number version number: ${version}`);
  const $ = await fetchHtml(url);
  // Invalid version
  if (!$) {
    return null;
  }
  const date = moment($('tr:last-child td:last-child').text().trim(), 'DD-MMM-YYYY HH:mm');
  return {
    date: date.isValid() ? date.format('YYYY-MM-DD') : null,
    version
  };
}
