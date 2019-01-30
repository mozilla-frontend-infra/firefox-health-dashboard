/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
import queryBugzilla from './queryBugzilla';
import generateDatasetStyle from '../chartJs/generateDatasetStyle';
import SETTINGS from '../../settings';

const newDate = (datetime, startDate) => {
  const onlyDate = datetime.substring(0, 10);

  return startDate && onlyDate < startDate ? startDate : onlyDate;
};

// startDate enables counting into a starting date all previous data points
const bugsByCreationDate = (bugs, startDate) => {
  // Count bugs created on each day
  const byCreationDate = bugs.reduce(
    (result, { creation_time, cf_last_resolved }) => {
      const createdDate = newDate(creation_time, startDate);

      if (!result[createdDate]) {
        result[createdDate] = 0;
      }

      result[createdDate] += 1;

      if (cf_last_resolved) {
        const resolvedDate = newDate(cf_last_resolved, startDate);

        if (!result[resolvedDate]) {
          result[resolvedDate] = 0;
        }

        result[resolvedDate] -= 1;
      }

      return result;
    },
    {}
  );
  let count = 0;
  let lastDataPoint;
  const accumulatedCount = Object.keys(byCreationDate)
    .sort()
    .reduce((result, date) => {
      count += byCreationDate[date];
      lastDataPoint = { x: new Date(date), y: count };
      result.push(lastDataPoint);

      return result;
    }, []);
  // This guarantees that the line goes all the way to the end of the graph
  const today = new Date();
  const todaysDate = `${today.getUTCFullYear()}-${today.getMonth() +
    1}-${today.getDate()}`;

  if (lastDataPoint && lastDataPoint.x !== todaysDate) {
    accumulatedCount.push({ x: new Date(todaysDate), y: count });
  }

  return accumulatedCount;
};

const chartJsFormatter = (bugSeries, startDate) => {
  const newData = { data: { datasets: [] } };

  bugSeries.forEach(({ bugs, label }, index) => {
    const bugCountPerDay = bugsByCreationDate(bugs, startDate);

    newData.data.datasets.push({
      ...generateDatasetStyle(SETTINGS.colors[index]),
      data: bugCountPerDay,
      label,
    });
  });

  return newData;
};

// It formats the data and options to meet chartJs' data structures
const getBugsData = async (queries = [], startDate) => {
  const data = await Promise.all(
    queries.map(async ({ label, parameters }) => {
      // This speeds up and the size of the call to Bugzilla
      parameters.include_fields = ['cf_last_resolved', 'creation_time'];

      return {
        label,
        ...(await queryBugzilla(parameters)),
      };
    })
  );

  return chartJsFormatter(data, startDate);
};

export default getBugsData;
