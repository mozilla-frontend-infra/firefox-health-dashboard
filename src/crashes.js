import Router from 'koa-router';
import moment from 'moment';
import {
  standardDeviation,
  geometricMean,
  mean,
 } from 'simple-statistics';
import {
   uniq,
   flatten,
   sumBy,
   zipObject,
   without,
   countBy,
   sortBy,
   toPairs,
   find,
 } from 'lodash';
import qs from 'qs';
import { parse as parseVersion } from './meta/version';
import fetchJson from './fetch/json';
import fetchRedash from './fetch/redash';
import { getHistory } from './release/history';

const dateBlacklist = [
  '2016-05-01',
  '2016-05-03',
  '2016-05-04',
  '2016-05-07',
  '2016-05-08',
  '2016-06-03',
  '2016-07-04',
];

export const router = new Router();

const bandwidth = 7;
const weeklyAverage = (result, idx, results) => {
  if (idx < bandwidth) {
    return result;
  }
  const weekRate = results
    .slice(idx - bandwidth, idx + bandwidth).map(past => past.dirty);
  const avg = mean(weekRate);
  result.rate = avg;
  return result;
};

router
  .get('/', async (ctx) => {
    const raw = await fetchRedash(331);
    const reduced = raw.query_result.data.rows
      .map((row) => {
        return {
          date: row.activity_date,
          dirty: row.main_crash_rate,
        };
      })
      .filter(({ date }) => {
        return dateBlacklist.indexOf(date) < 0;
      })
      .map(weeklyAverage);
    ctx.body = reduced;
  })

  .get('/beta', async (ctx) => {
    const raw = await fetchRedash(475);
    const results = raw.query_result.data.rows.map((row) => {
      return {
        date: row.activity_date,
        rate: row.main_crash_rate,
      };
    });
    ctx.body = results;
  })

  .get('/xp', async (ctx) => {
    const nonXpRates = await fetchRedash(689);
    const xpRates = await fetchRedash(690);
    const raw = await fetchRedash(331);
    ctx.body = [
      nonXpRates.query_result.data.rows
        .map((row) => {
          return {
            date: row.activity_date,
            rate: row.main_crash_rate,
          };
        })
        .filter(({ date }) => {
          return dateBlacklist.indexOf(date) < 0;
        }),
      xpRates.query_result.data.rows
        .map((row) => {
          return {
            date: row.activity_date,
            rate: row.main_crash_rate,
          };
        })
        .filter(({ date }) => {
          return dateBlacklist.indexOf(date) < 0;
        }),
      raw.query_result.data.rows
        .map((row) => {
          return {
            date: row.activity_date,
            rate: row.main_crash_rate,
          };
        })
        .filter(({ rate, date }) => {
          return rate > 3 && dateBlacklist.indexOf(date) < 0;
        }),
    ];
  })

  .get('/beta/builds', async (ctx) => {
    const history = await getHistory({
      channel: 'beta',
      tailVersion: 5,
    });
    const betaRaw = (await fetchRedash(2856)).query_result.data.rows;
    // const betaE10sRaw = sortBy(
    //   (await fetchRedash(497)).query_result.data.rows,
    //   'activity_date',
    //   (a) => Date.parse(a)
    // );

    const builds = betaRaw.reduce((lookup, row) => {
      const buildDate = moment(row.build_id, 'YYYYMMDD');
      const release = find(history, ({ date }) => {
        const diff = moment(date, 'YYYY MM DD').diff(buildDate, 'day');
        return diff >= 0 && diff <= 2;
      });
      const result = {
        date: buildDate.format('YYYY-MM-DD'),
        release: release && release.date,
        candidate: release
          ? parseVersion(release.version).candidate
          : 'rc',
        build: row.build_id,
        version: row.build_version,
        hours: row.usage_kilohours,
        rate: row.main_crash_rate,
        contentRate: row.content_crash_rate,
        dates: [],
      };
      lookup.push(result);
      return lookup;
    }, []);

    const releases = builds.reduce((lookup, result) => {
      let entry = find(lookup, ({ version }) => version === result.version);
      if (!entry) {
        entry = {
          version: result.version,
          builds: [],
        };
        lookup.push(entry);
      }
      entry.builds.push(result);
      return lookup;
    }, []);
    releases.forEach((release) => {
      release.hours = sumBy(release.builds, 'hours');
      const rates = release.builds
        .map(({ rate }) => rate)
        .filter(rate => rate > 0);
      const contentRates = release.builds
        .map(({ contentRate }) => contentRate)
        .filter(contentRate => contentRate > 0);
      if (rates.length > 0) {
        release.rate = geometricMean(rates) || 0;
        release.contentRate = geometricMean(contentRates) || 0;
        release.variance = standardDeviation(rates) || 0;
      }
    });
    ctx.body = releases;
  });
