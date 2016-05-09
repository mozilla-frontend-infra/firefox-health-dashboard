import Router from 'koa-router';
import moment from 'moment';
import Telemetry from 'telemetry-next-node';
import fetchJson from './fetch/json';
import fetchRedash from './fetch/redash';
import { getVersions } from './release';

async function fetchLast4Beta() {
  const versions = await getVersions();
  return Array(4).fill(versions.beta).map((version, i) => version - i);
}

async function fetchUptime(versions) {
  const filters = {
    'application': 'Firefox'
  };
  return new Promise((resolve, reject) => {
    Telemetry.init(resolve, reject);
  })
  .then(() => {
    return Promise.all(versions.map((version) => {
      return new Promise((resolve, reject) => {
        Telemetry.getEvolution('beta', String(version), 'SIMPLE_MEASURES_UPTIME', filters, true, (evo) => {
          evo = evo[''];
          resolve(evo.sanitized());
        });
      });
    }));
  })
  .then((evolutions) => {
    return evolutions.reduce((result, evolution, idx) => {
      result[versions[idx]] = evolution.map((h, i, date) => {
        return {
          date: +moment(date).format('x'),
          stats: h.mean(),
          count: h.submissions
        };
      });
      return result;
    }, {});
  });
}

export const router = new Router();

router
  .get('/adi', async function (ctx, next) {
    const product = (ctx.request.query.product === 'fennec') ? 'fennec' : 'firefox';
    const urls = {
      fennec: 'https://crash-analysis.mozilla.com/rkaiser/FennecAndroid-release-bytype.json',
      firefox: 'https://crash-analysis.mozilla.com/rkaiser/Firefox-release-bytype.json'
    };
    const raw = await fetchJson(urls[product]);
    const ratesByDay = Object.keys(raw).reduce((result, date) => {
      const time = moment(date, 'YYYY MM DD');
      if (moment().diff(time, 'days') > 120) {
        return result;
      }
      const entry = raw[date];
      const mainRate = (entry.crashes.Browser / entry.adi) * 100;
      const contentRate = ((entry.crashes.Content || 0) / entry.adi) * 100;
      result.push({
        date: date,
        crash_rate: mainRate,
        combined_crash_rate: mainRate + contentRate
      });
      return result;
    }, []);
    ctx.body = ratesByDay;
  })
  .get('/', async function (ctx, next) {
    // const product = (ctx.request.query.product === 'fennec') ? 'fennec' : 'firefox';
    // const channel = (ctx.request.query.channel === 'beta') ? 'beta' : 'channel';
    const raw = await fetchRedash(331);
    const reduced = raw.query_result.data.rows.map((row) => {
      return {
        date: row.activity_date,
        main_crash_rate: row.main_crash_rate,
        combined_crash_rate: row.app_crash_rate
      };
    });
    ctx.body = reduced;
  })
  .get('/result', async function (ctx, next) {
    const versions = await fetchLast4Beta();
    const uptime = await fetchUptime(versions);
    const raw = await fetchJson('https://crash-analysis.mozilla.com/rkaiser/Firefox-daily.json');
    const expr = new RegExp(`^(${versions.join('|')})\\..*0b(\\d+)`);
    const crashes = {};
    const result = { uptime, crashes };
    for (let version in raw) {
      const match = version.match(expr);
      if (!match) {
        continue;
      }
      const major = match[1];
      const tail = match[2];
      const dates = [];
      for (let date in raw[version]) {
        let entry = raw[version][date];
        dates.push({
          date,
          adu: entry.adu,
          count: entry.crashes
        });
      }
      crashes[major] = crashes[major] || {};
      crashes[major][tail] = dates;
    }
    ctx.body = result;
  });
