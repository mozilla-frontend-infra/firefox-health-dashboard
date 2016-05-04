import Router from 'koa-router';
import moment from 'moment';
import Telemetry from 'telemetry-next-node';
import fetchJson from './fetch/json';
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
router.get('/', async function (ctx, next) {
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
