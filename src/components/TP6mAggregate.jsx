import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid/Grid';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import { toQueryString } from '../vendor/convert';
import { selectFrom } from '../vendor/vectors';
import { last, missing, notLast } from '../vendor/utils';
import { geomean, round } from '../vendor/math';
import {
  PLATFORMS,
  TP6_COMBOS,
  TP6_TESTS,
  TP6M_SITES,
} from '../quantum/config';
import { getData } from '../vendor/perfherder';
import generateOptions from '../utils/chartJs/generateOptions';
import { withErrorBoundary } from '../vendor/errors';
import jx from '../vendor/jx/expressions';
import { HyperCube, window } from '../vendor/jx/cubes';
import { g5Reference, TARGET_NAME } from '../config/mobileG5';
import ChartJSWrapper from './ChartJsWrapper';
import timer from '../vendor/timer';
import generateDatasetStyle from '../utils/chartJs/generateDatasetStyle';
import SETTINGS from '../settings';

/*
condition - json expression to pull perfherder data
timeRange - any valid Duration
 */
async function pullAggregate({
  condition,
  tests,
  sites,
  platforms,
  timeRange,
}) {
  const readData = timer('read data');
  const sources = await getData(condition);

  readData.done();

  const processData = timer('process data');
  const measured = selectFrom(sources)
    .select('data')
    .flatten()
    .filter(jx({ gte: { push_timestamp: { date: timeRange } } }))
    .map(row => ({ ...row, ...row.meta }))
    .edges([
      {
        name: 'test',
        domain: {
          type: 'set',
          partitions: tests.select({
            name: 'label',
            value: 'test',
            where: 'testFilter',
          }),
        },
      },
      {
        name: 'site',
        domain: {
          type: 'set',
          partitions: sites.select({
            name: 'site',
            value: 'site',
            where: 'siteFilter',
          }),
        },
      },
      {
        name: 'platform',
        domain: {
          type: 'set',
          partitions: platforms.select({
            name: 'platform',
            value: 'platform',
            where: 'platformFilter',
          }),
        },
      },
      {
        name: 'pushDate',
        value: 'push_timestamp',
        domain: {
          type: 'time',
          min: timeRange,
          max: 'today',
          interval: 'day',
        },
      },
    ]);
  const afterLastGoodDate = window(
    { measured },
    {
      // INDEX OF DATE MARKS THE END OF THE DATA
      edges: ['test', 'site', 'platform'],
      value: ({ measured }) =>
        measured.length -
        measured
          .slice()
          .reverse()
          .findIndex(m => m.length > 0),
    }
  );
  const daily = window(
    { measured, afterLastGoodDate },
    {
      // CHECK EACH TEST/SITE/DAY FOR MISSING VALUES
      edges: ['test', 'site', 'platform'],
      along: ['pushDate'],
      value: (row, num, rows) => {
        const { measured, afterLastGoodDate } = row;

        if (num > 0 && num < afterLastGoodDate && measured.length === 0) {
          return rows[num - 1];
        }

        return selectFrom(measured)
          .select('value')
          .average();
      },
    }
  );
  const result = window(
    { daily, g5Reference },
    {
      edges: ['test', 'platform', 'pushDate'],
      value: row => {
        const { daily, g5Reference } = row;

        return round(
          selectFrom(daily, g5Reference)
            // IF NO REFERENCE VALUE FOR SITE, DO NOT INCLUDE IN AGGREGATE
            .map((d, r) => (missing(r) ? null : d))
            .geomean(),
          { places: 4 }
        );
      },
    }
  );
  const ref = window(
    { result, g5Reference },
    {
      edges: ['test', 'platform'],
      value: ({ result, g5Reference }) => {
        const lastMeasure = last(notLast(result));

        if (missing(lastMeasure)) return null;

        return geomean(g5Reference);
      },
    }
  );

  processData.done();

  return new HyperCube({ result, ref });
}

const DESIRED_TESTS = ['cold-loadtime', 'warm-loadtime'];
const DESIRED_PLATFORMS = ['android-g5', 'android-p2-aarch64'];

class TP6mAggregate_ extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const timeRange = 'today-6week';
    const platforms = selectFrom(PLATFORMS).where({
      platform: DESIRED_PLATFORMS,
    });
    const condition = {
      or: TP6_COMBOS.filter(
        jx({
          and: [
            { eq: { browser: 'geckoview' } },
            {
              or: [
                { eq: { platform: 'android-g5', test: 'warm-loadtime' } },
                {
                  eq: { platform: 'android-p2-aarch64', test: 'cold-loadtime' },
                },
              ],
            },
          ],
        })
      ).select('seriesConfig'),
    };
    const data = await pullAggregate({
      condition,
      sites: TP6M_SITES,
      tests: TP6_TESTS.where({ test: DESIRED_TESTS }),
      platforms,
      timeRange,
    });

    this.setState({ data });
  }

  render() {
    const { data } = this.state;

    if (missing(data))
      return (
        <div
          style={{
            lineHeight: '100%',
            textAlign: 'center',
            width: '100%',
          }}>
          <CircularProgress />
        </div>
      );

    return (
      <Grid container spacing={24}>
        {selectFrom(TP6_TESTS)
          .where({ test: DESIRED_TESTS })
          .enumerate()
          .map(({ label, test }) =>
            data
              .where({ test })
              .along('platform')
              .enumerate()
              .map((row, i) => {
                const platform = row.platform.getValue();
                const chartData = {
                  datasets: [
                    {
                      label: platform,
                      type: 'line',
                      data: row
                        .along('pushDate')
                        .map(({ pushDate, result }) => ({
                          x: pushDate.getValue(),
                          y: result.getValue(),
                        }))
                        .toArray(),
                      ...generateDatasetStyle(SETTINGS.colors[i]),
                    },
                    {
                      label: TARGET_NAME,
                      type: 'line',
                      backgroundColor: 'gray',
                      borderColor: 'gray',
                      fill: false,
                      pointRadius: '0',
                      pointHoverBackgroundColor: 'gray',
                      lineTension: 0,
                      data: row
                        .along('pushDate')
                        .map(({ pushDate, ref }) => ({
                          x: pushDate.getValue(),
                          y: ref.getValue(),
                        }))
                        .toArray(),
                    },
                  ],
                };

                // do not show charts with no data
                if (!chartData.datasets.some(ds => ds.data.some(({ y }) => y)))
                  return null;

                return (
                  <Grid item xs={6} key={label}>
                    <ChartJSWrapper
                      title={
                        <span>
                          Geomean of&nbsp;
                          {label}
                          {' ('}
                          <a
                            href={`/android/tp6m?${toQueryString({
                              test,
                              platform,
                            })}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '0.9em' }}>
                            {'details'}
                          </a>
                          {')'}
                        </span>
                      }
                      type="line"
                      data={chartData}
                      height={200}
                      options={generateOptions()}
                    />
                  </Grid>
                );
              })
          )
          .flatten()
          .toArray()}
      </Grid>
    );
  }
}

const TP6mAggregate = withErrorBoundary(TP6mAggregate_);

export { TP6mAggregate, pullAggregate };
