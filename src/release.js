import Router from 'koa-router';
import assert from 'assert';
import moment from 'moment';
import ical from 'ical';
import fetchJson from './fetch/json';
import fetchHtml from './fetch/html';
import fetchText from './fetch/text';

export async function getUpdates(channel = 'release') {
  const versions = await getVersions();
  const latest = versions[channel] || versions.aurora;
  // https://aus5.mozilla.org/update/3/%PRODUCT%/%VERSION%/%BUILD_ID%/%BUILD_TARGET%/%LOCALE%/%CHANNEL%/%OS_VERSION%/%DISTRIBUTION%/%DISTRIBUTION_VERSION%/update.xml
  const url = `https://aus5.mozilla.org/update/3/Firefox/${latest}/0/Darwin_x86_64-gcc3-u-i386-x86_64/en-US/${channel}/Darwin%2015.4.0/default/default/update.xml?force=1`;
  const $ = await fetchHtml(url);
  const field = $('update');
  const date = moment(field.prop('buildid'), 'YYYYMMDDHHmmss');
  return {
    version: field.prop('appversion'),
    build_id: field.prop('buildid'),
    date: date.format('YYYY-MM-DD')
  };
}

export async function getCalendar() {
  const url = 'https://calendar.google.com/calendar/ical/mozilla.com_2d37383433353432352d3939%40resource.calendar.google.com/public/basic.ics';
  const ics = await fetchText(url);
  const parsed = ical.parseICS(ics);
  const data = Object.keys(parsed).reduce((data, key) => {
    const entry = parsed[key];
    if (moment().diff(entry.start, 'days') > 7) {
      return data;
    }
    const summary = entry.summary.match(/Firefox\s+(ESR)?\s*([\d.]+)\s+Release/);
    if (!summary) {
      return data;
    }
    data.push({
      version: summary[2],
      channel: summary[1] ? 'esr' : 'release',
      date: moment(entry.start).format('YYYY-MM-DD')
    });
    return data;
  }, []);
  data.sort((a, b) => (a.date < b.date) ? -1 : 1);
  return data;
}

export async function getVersions() {
  const raw = await fetchJson('https://svn.mozilla.org/libs/product-details/json/firefox_versions.json');
  return {
    release: raw.LATEST_FIREFOX_VERSION,
    beta: raw.LATEST_FIREFOX_DEVEL_VERSION,
    aurora: raw.FIREFOX_AURORA
  };
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

export async function getAll() {
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

export async function getHistory(channel = 'release', tail = 10) {
  const versions = await getVersions();
  const start = parseInt(versions[channel]);
  const lookup = [];
  for (let i = 0; i < tail; i++) {
    const release = await getReleaseDate(start - i, channel);
    lookup.push({
      version: release.version,
      date: release.date
    });
  }
  return lookup;
}

export async function getChromeHistory() {
  const versions = [];
  let lastDate = null;
  for (let i = 1; i <= 10; i++) {
    const $ = await fetchHtml(`http://filehippo.com/download_google_chrome/history/${i}/`);
    $('#program-history-list li').each((i, li) => {
      const labelish = $(li).find('a:first-of-type').text().trim();
      if (labelish.endsWith('Beta')) {
        return;
      }
      const datish = $(li).find('.detailLine').text().trim();
      const version = labelish.match(/(\d+\.)+\d+/)[0].trim();
      const date = moment(datish.match(/\s(\d{2}\s[a-z]{3}\s\d{4})\s/i)[1], 'DD MMM YYYY');
      if (date.isValid()) {
        lastDate = date;
        versions.push({
          date: date.format('YYYY-MM-DD'),
          version
        });
      }
    });
    if (moment().diff(lastDate, 'months') > 12) {
      break;
    }
  }
  return versions;
}

export const router = new Router();

router.get('/', async function (ctx, next) {
  ctx.body = await getVersions();
});

router.get('/latest', async function (ctx, next) {
  const versions = await getVersions();
  for (let channel in versions) {
    const release = await getReleaseDate(versions[channel], channel);
    versions[channel] = release;
  }
  ctx.body = versions;
});

router.get('/history', async function (ctx, next) {
  const channel = ctx.request.query.channel || 'release';
  ctx.body = await getHistory(channel);
});

router.get('/all', async function (ctx, next) {
  ctx.body = await getAll();
});

router.get('/updates', async function (ctx, next) {
  const channel = ctx.request.query.channel || 'release';
  ctx.body = await getUpdates(channel);
});

router.get('/calendar', async function (ctx, next) {
  ctx.body = await getCalendar();
});

router.get('/chrome', async function (ctx, next) {
  ctx.body = await getChromeHistory();
});
