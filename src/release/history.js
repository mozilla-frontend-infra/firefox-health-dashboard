import moment from 'moment';
import { sortBy, maxBy, filter, find } from 'lodash';
import { partition, flow } from 'lodash/fp';
import fetchJson from '../fetch/json';
import { parse as parseVersion } from '../meta/version';

const feeds = {
  firefox: {
    release: [
      'https://svn.mozilla.org/libs/product-details/json/firefox_history_major_releases.json',
      'https://svn.mozilla.org/libs/product-details/json/firefox_history_stability_releases.json',
    ],
    beta: 'https://svn.mozilla.org/libs/product-details/json/firefox_history_development_releases.json',
  },
  fennec: {
    release: [
      'https://svn.mozilla.org/libs/product-details/json/mobile_history_major_releases.json',
      'https://svn.mozilla.org/libs/product-details/json/mobile_history_stability_releases.json',
    ],
    beta: 'https://svn.mozilla.org/libs/product-details/json/mobile_history_development_releases.json',
  },
};

export async function getHistory({
  channel = 'release',
  product = 'firefox',
  major = false,
  tailVersion = null,
  tailDate = null,
}) {
  const history = {};
  if (channel === 'release') {
    Object.assign(
      history,
      await fetchJson(feeds[product].release[0]),
      await fetchJson(feeds[product].release[1])
    );
  } else {
    Object.assign(
      history,
      await fetchJson(feeds[product].beta)
    );
  }
  let results = Object.keys(history).reduce((reduced, version) => {
    const parsed = parseVersion(version);
    if (major && !parsed.isMajor) {
      return reduced;
    }
    if (parsed.channel !== channel) {
      return reduced;
    }
    reduced.push({
      version: parsed,
      date: history[version],
    });
    return reduced;
  }, []);
  if (!results.length) {
    console.warn('No results for %s/%s, major: %s', product, channel, major);
  } else if (tailVersion) {
    const tail = maxBy(results, 'version.major').version.major - tailVersion;
    results = filter(results, ({ version }) => version.major > tail);
  }
  results = sortBy(results, 'date', (a) => Date.parse(a))
    .map(({ version, date }) => {
      return {
        version: version.clean,
        date: date,
      };
    });
  if (tailDate) {
    const split = flow(
      partition(({ date }) => {
        return new Date(date) > new Date(tailDate);
      })
    )(results);
    results = split[0].concat([split[1].slice(-1)]);
  }
  return results;
}

export async function getReleaseDate(version, {
  product = 'firefox',
  channel = 'release',
} = {}) {
  if (typeof version === 'number') {
    version = `${version}.0`;
    if (channel !== 'release') {
      version += `${channel.charAt(0)}1`;
    }
  }
  const parsed = parseVersion(version);
  const history = await getHistory({
    product,
    channel: channel || parsed.channel,
  });
  const found = find(history, (entry) => {
    return parsed.full === entry.version.full;
  });
  return {
    date: found ? moment(found.date).format('YYYY-MM-DD') : null,
    version,
  };
}
