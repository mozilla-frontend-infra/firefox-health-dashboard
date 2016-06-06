import moment from 'moment';
import assert from 'assert';
// import semver from 'semver';
import fetchHtml from '../fetch/html';
import { parse as parseVersion } from '../meta/version';

const archives = {
  firefox: 'https://archive.mozilla.org/pub/firefox/releases/',
  fennec: 'https://archive.mozilla.org/pub/mobile/releases/',
};

export async function getArchive(product = 'firefox', {
  channel = 'release',
} = {}) {
  const url = archives[product];
  const $ = await fetchHtml(url);
  const versions = [];
  $('tr a').each((i, element) => {
    const version = $(element).text().slice(0, -1);
    const parsed = parseVersion(version);
    if (!channel || parsed.channel === channel) {
      versions.push(version);
    }
  });
  versions.reverse();
  return versions;
}

export async function getReleaseDate(fuzzyVersion, {
  product = 'firefox',
  channel = 'release',
} = {}) {
  let version = fuzzyVersion;
  if (typeof version === 'number') {
    version = `${version}.0`;
    if (channel !== 'release') {
      version += `${channel.charAt(0)}1`;
    }
  }
  const url = `${archives[product]}${version}/`;
  // assert.ok(parseVersion(version).major, `Invalid number version number: ${version}`);
  const $ = await fetchHtml(url);
  // Invalid version
  if (!$) {
    return null;
  }
  const date = moment($('tr:last-child td:last-child').text().trim(), 'DD-MMM-YYYY HH:mm');
  return {
    date: date.isValid() ? date.format('YYYY-MM-DD') : null,
    version,
  };
}
