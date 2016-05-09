import moment from 'moment';
import assert from 'assert';
import fetchHtml from '../fetch/html';

export async function getArchive() {
  const url = 'https://archive.mozilla.org/pub/firefox/releases/';
  const $ = await fetchHtml(url);
  const versions = [];
  $('tr a').each((i, element) => {
    const version = $(element).text().slice(0, -1);
    const major = parseInt(version);
    if (major > 30 && !/\-/.test(version)) {
      versions.push(version);
    }
  });
  return versions;
}

export async function getReleaseDate(version, channel = 'release') {
  if (typeof version === 'number') {
    version = `${version}.0`;
    if (channel !== 'release') {
      version += `${channel.charAt(0)}1`;
    }
  }
  assert.ok(/^\d+\.\d+(\.\d+|\.\d+esr|(a|b)\d*)?$/.test(version), `Invalid number version number: ${version}`);
  const url = `https://archive.mozilla.org/pub/firefox/releases/${version}/`;
  const $ = await fetchHtml(url);
  // Invalid version
  if (!$) {
    return null;
  }
  const date = moment($('tr:last-child td:last-child').text().trim(), 'DD-MMM-YYYY HH:mm');
  assert.ok(date.isValid(), `Invalid date from ${url}`);
  return {
    date: date.format('YYYY-MM-DD'),
    version
  };
}
