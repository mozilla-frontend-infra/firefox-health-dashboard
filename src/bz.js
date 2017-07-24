import Router from 'koa-router';
import moment from 'moment';
import _ from 'lodash/fp';
import { stringify } from 'qs';
import fetchJson from './fetch/json';
import { getRelease } from './bz/release';
// import { getHistory } from './release/history';
// import { getMissedCount } from './bz/regressions';

export const router = new Router();

router

  .get('/burnup', async (ctx) => {
    const base = 'https://bugzilla.mozilla.org/rest/bug';
    const query = stringify({
      whiteboard: '[qf:p1]',
      include_fields: [
        'id',
        'is_open',
        'status',
        'creation_time',
        'last_change_time',
        'cf_last_resolved',
        'assigned_to',
        'flags',
      ].join(','),
    });
    const { bugs } = await fetchJson(`${base}?${query}`, { ttl: 'day' });
    const bydate = bugs.map((bug) => {
      const set = {
        id: bug.id,
        total: moment(bug.creation_time, 'YYYY-MM-DD').valueOf(),
      };
      if (bug.is_open) {
        if (bug.assigned_to || bug.assigned_to_detail || bug.flags.find(flag => flag.name === 'needinfo')) {
          bug.assigned = true;
        }
      } else {
        set.closed = moment(bug.cf_last_resolved || bug.last_change_time, 'YYYY-MM-DD').valueOf();
        set.status = bug.status;
      }
      return set;
    });
    const buckets = {
      closed: [],
      total: [],
    };
    const uniqueDates = [];
    const cutOff = (new Date('2017-04-01')).getTime();
    bydate.forEach((bug) => {
      for (const key in buckets) {
        const date = bug[key];
        if (date && date > cutOff) {
          const bucket = buckets[key];
          let pairs = bucket.find(([needle]) => needle === date);
          if (!pairs) {
            if (!uniqueDates.includes(date)) {
              uniqueDates.push(date);
            }
            pairs = [date, []];
            bucket.push(pairs);
          }
          pairs[1].push(bug.id);
        }
      }
    });
    uniqueDates.sort().reverse();
    // const totalIds = bydate.filter(bug => !bug.closed).map(bug => bug.id);
    // const unassignedIds = bydate.filter(bug => bug.assigned).map(bug => bug.id);
    const closedIds = bydate.filter(bug => bug.closed).map(bug => bug.id);

    const countChanged = (bucket, date) => {
      const pairs = buckets[bucket].find(([needle]) => needle === date);
      return pairs ? pairs[1].length : 0;
    };

    let totalPointer = bydate.length;
    let closedPointer = closedIds.length;
    const timeline = uniqueDates.map((date) => {
      totalPointer -= countChanged('total', date);
      closedPointer -= countChanged('closed', date);
      return {
        date,
        total: totalPointer,
        closed: closedPointer,
      };
    });
    timeline.reverse();

    ctx.body = timeline;
  })

  .get('/status', async (ctx) => {
    const { ids } = ctx.request.query;
    ctx.body = await getRelease(ids);
  })

  .get('/regressions/missed', async (ctx) => {
    // const history = await getHistory({
    //   major: true,
    //   tailVersion: 5,
    // });
    // history.reverse();
    // const counts = await Promise.all(
    //   history.map((release) => {
    //     const version = release.version;
    //     return getMissedCount(version, release.date);
    //   })
    // );
    ctx.body = [
      { count: 86, version: 40 },
      { count: 93, version: 41 },
      { count: 109, version: 42 },
      { count: 92, version: 43 },
      { count: 87, version: 44 },
      { count: 76, version: 45 },
      { count: 0, version: 46 },
      { count: 0, version: 47 },
    ];
    // counts.map(({ count, query }, idx) => {
    //   return {
    //     count,
    //     query,
    //     version: history[idx].version,
    //   };
    // });
  });
