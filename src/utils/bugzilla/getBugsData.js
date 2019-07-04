/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
import { queryBugzilla } from './query';
import { GMTDate as Date } from '../../vendor/dates';
import { selectFrom } from '../../vendor/vectors';

// It formats the data and options to meet chartJs' data structures
const getBugsData = async (queries = [], timeDomain) => {
  const bugSeries = await Promise.all(
    queries.map(async ({ label, filter }) => ({
      label,
      ...(await queryBugzilla({
        select: ['cf_last_resolved', 'creation_time'],
        where: filter,
      })),
    }))
  );
  const data = selectFrom(timeDomain.partitions)
    .map(p => ({
      date: p.min,
      ...selectFrom(bugSeries)
        .map(({ bugs, label }) => [
          selectFrom(bugs)
            .filter(({ cf_last_resolved, creation_time }) => {
              const end = Date.newInstance(cf_last_resolved);
              const start = Date.newInstance(creation_time);

              return !(end < p.min || p.max < start);
            })
            .count(),
          label,
        ])
        .args()
        .fromPairs(),
    }))
    .toArray();

  return {
    axis: { x: { domain: timeDomain } },
    series: selectFrom(bugSeries)
      .map(({ label }) => ({
        label,
        select: { value: label },
      }))
      .append({ select: { value: 'date', axis: 'x' } })
      .toArray(),
    data,
  };
};

export default getBugsData;
