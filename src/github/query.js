/* eslint-disable camelcase */

import { fetchJson, URL } from '../vendor/requests';
import { Template } from '../vendor/Template';
import { GMTDate as Date, ISO_8601 } from '../vendor/dates';
import { selectFrom } from '../vendor/vectors';
import { coalesce } from '../vendor/utils';

// EXAMPLE https://github.com/mozilla-mobile/fenix/labels/eng%3Aperformance
const GITHUB_ISSUES = new Template('https://api.github.com/repos/{{owner}}/{{repo}}/issues');

const BURNDOWN = {
  owner: 'mozilla-mobile',
  repo: 'fenix',
  labels: 'eng:performance',
  filter: 'all',
};


async function getIssues({ timeDomain }) {
  const { labels, filter } = BURNDOWN;
  const since = Date.newInstance(timeDomain.min).format(ISO_8601);

  const response = await fetchJson(URL({
    path: GITHUB_ISSUES.expand(BURNDOWN),
    query: { labels, filter, since },
  }));

  const eod = Date.eod();

  const data = selectFrom(timeDomain.partitions)
    .map(p => ({
      date: p.min,
      count: selectFrom(response)
        .filter(({ created_at, closed_at }) => {
          const end = coalesce(Date.newInstance(closed_at), eod);
          const start = Date.newInstance(created_at);

          return !(end < p.min || p.max < start);
        })
        .count(),
    }))
    .toArray();

  // Log.note('{{response}}', { response });

  return {
    axis: { x: { domain: timeDomain } },
    series: [
      {
        label: 'Performance',
        select: { value: 'count' },
      },
      { select: { value: 'date', axis: 'x' } },
    ],
    data,
  };
}


export { getIssues }; // eslint-disable-line import/prefer-default-export
