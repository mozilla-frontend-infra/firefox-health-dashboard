import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid/Grid';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import { URL } from '../vendor/requests';
import { selectFrom } from '../vendor/vectors';
import { coalesce, missing } from '../vendor/utils';
import {
  geomean, round, sum,
} from '../vendor/math';
import {
  BROWSER_PLATFORMS,
  TP6_COMBOS,
  TP6_TESTS,
  TP6M_SITES,
} from '../quantum/config';
import { getData } from '../vendor/perfherder';
import { withErrorBoundary } from '../vendor/errors';
import jx from '../vendor/jx/expressions';
import { Cube, HyperCube, window } from '../vendor/jx/cubes';
import { TARGET_NAME } from './config';
import ChartJSWrapper from '../vendor/components/chartJs/ChartJsWrapper';
import timer from '../vendor/timer';
import { DetailsIcon } from '../utils/icons';
import { TimeDomain } from '../vendor/jx/domains';


const DESIRED_TESTS = ['cold-loadtime'];
const DESIRED_PLATFORMS = ['p2-aarch64', 'g5'];
const DESIRED_BROWSER = ['fenix'];
const REFERENCE_BROWSER = ['fennec64'];

/*
condition - json expression to pull perfherder data
 */
async function pullAggregate({
  condition,
  test,
  platform,
  timeDomain,
}) {
  const tests = selectFrom(TP6_TESTS).where({ test });
  const testMode = tests.select('mode').first();
  const sites = TP6M_SITES.filter(({ mode }) => mode.includes(testMode)).materialize();
  const platforms = selectFrom(BROWSER_PLATFORMS).where({ platform, browser: DESIRED_BROWSER });
  const readData = timer('read data');
  const referenceRange = new TimeDomain({ past: 'month', ending: 'today' });
  const referencePlatforms = selectFrom(BROWSER_PLATFORMS).where({ platform, browser: REFERENCE_BROWSER });
  const referenceFilter = TP6_COMBOS
    .where({
      browser: REFERENCE_BROWSER,
      platform,
      test,
    })
    .select('filter')
    .toArray();
  const [fennec64, sources] = await Promise.all([
    getData({ or: referenceFilter }),
    getData(condition),
  ]);

  readData.done();

  const processData = timer('process data');

  const reference = selectFrom(fennec64)
    .select('data')
    .flatten()
  /* eslint-disable-next-line camelcase */
    .filter(({ push_timestamp }) => referenceRange.includes(push_timestamp))
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
          partitions: referencePlatforms.select({
            name: 'platform',
            value: 'platform',
            where: 'platformFilter',
          }),
        },
      },
    ]);
  const refMax = window(
    { reference },
    {
      edges: ['test', 'site', 'platform'],
      value: ({ reference }) => selectFrom(reference).select('value').max(),
    },
  );
  const refMin = window(
    { reference },
    {
      edges: ['test', 'site', 'platform'],
      value: ({ reference }) => selectFrom(reference).select('value').min(),
    },
  );


  const measured = selectFrom(sources)
    .select('data')
    .flatten()
    /* eslint-disable-next-line camelcase */
    .filter(({ push_timestamp }) => timeDomain.includes(push_timestamp))
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
        domain: timeDomain,
      },
    ]);
  const afterLastGoodDate = window(
    { measured },
    {
      // INDEX OF DATE MARKS THE END OF THE DATA
      edges: ['test', 'site', 'platform'],
      value: ({ measured }) => measured.length
        - measured
          .slice()
          .reverse()
          .findIndex(m => m.length > 0),
    },
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
    },
  );
  const result = window(
    { daily, refMin },
    {
      edges: ['test', 'platform', 'pushDate'],
      value: (row) => {
        const { daily, refMin } = row;

        return round(
          selectFrom(daily, refMin)
            // IF NO REFERENCE VALUE FOR SITE, DO NOT INCLUDE IN AGGREGATE
            .map((d, r) => (missing(r) ? null : d))
            .geomean(),
          { places: 4 },
        );
      },
    },
  );
  const mask = window(
    { daily },
    {
      edges: ['test', 'platform', 'site'],
      value: ({ daily }) => !selectFrom(daily)
        .reverse()
        .limit(8) // 7+1 for the null entry
        .exists()
        .isEmpty(),
    },
  );
  const count = window(
    { mask },
    {
      edges: ['test', 'platform'],
      value: ({ mask }) => sum(selectFrom(mask).map(m => (m ? 1 : 0))),
    },
  );
  const total = Cube.newInstance({ edges: [], zero: () => sites.count() });


  const refMeanMax = window(
    { mask, refMax },
    {
      edges: ['test', 'platform'],
      value: ({ mask, refMax }) => geomean(selectFrom(mask, refMax).map((m, r) => (m ? r : null))),
    },
  );
  const refMeanMin = window(
    { mask, refMin },
    {
      edges: ['test', 'platform'],
      value: ({ mask, refMin }) => geomean(selectFrom(mask, refMin).map((m, r) => (m ? r : null))),
    },
  );

  processData.done();

  return new HyperCube({
    result, refMeanMin, refMeanMax, refMax, refMin, count, total,
  });
}

class TP6mAggregate_ extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const { timeDomain } = this.props;
    const condition = {
      or: TP6_COMBOS.filter(
        jx({
          eq: {
            browser: DESIRED_BROWSER,
            platform: DESIRED_PLATFORMS,
            test: DESIRED_TESTS,
          },
        }),
      ).select('filter'),
    };
    const data = await pullAggregate({
      condition,
      sites: TP6M_SITES,
      test: DESIRED_TESTS,
      platform: DESIRED_PLATFORMS,
      timeDomain,
    });

    this.setState({ data });
  }

  render() {
    const { data } = this.state;

    if (missing(data)) {
      return (
        <div
          style={{
            lineHeight: '100%',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <CircularProgress />
        </div>
      );
    }

    return (
      <Grid container spacing={24}>
        {selectFrom(TP6_TESTS)
          .where({ test: DESIRED_TESTS })
          .enumerate()
          .map(({ label, test }) => data
            .where({ test })
            .along('platform')
            .enumerate()
            .map((row) => {
              const platform = row.platform.getValue();
              const count = row.count.getValue();
              const total = row.total.getValue();
              const platformLabel = selectFrom(BROWSER_PLATFORMS)
                .where({ platform })
                .first().label;

              return (
                <Grid item xs={6} key={platform}>
                  <ChartJSWrapper
                    title={(
                      <span>
                        {`Geomean of ${label}`}
                        {' for '}
                        {platformLabel}
                        {' ( '}
                        {count}
                        {' of '}
                        {total}
                        {' sites reporting)'}
                        <a
                          href={URL({
                            path: '/android/tp6m',
                            query: {
                              test,
                              platform,
                            },
                          })}
                          title="show details"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <DetailsIcon />
                        </a>
                      </span>
                    )}
                    standardOptions={{
                      series: [
                        {
                          label: platformLabel,
                          select: { value: 'result' },
                        },
                        {
                          label: `max${TARGET_NAME}`,
                          select: { value: coalesce(row.refMeanMax.getValue(), 0) },
                          style: { color: 'gray' },
                        },
                        {
                          label: `min ${TARGET_NAME}`,
                          select: { value: coalesce(row.refMeanMin.getValue(), 0) },
                          style: { color: 'gray' },
                        },
                        {
                          label: 'Push Date',
                          select: { value: 'pushDate', axis: 'x' },
                        },
                      ],
                      data: row
                        .along('pushDate')
                        .map(({ pushDate, result }) => ({
                          pushDate: pushDate.getValue(),
                          result: result.getValue(),
                        }))
                        .toArray(),
                    }}
                  />
                </Grid>
              );
            }))
          .flatten()
          .toArray()}
      </Grid>
    );
  }
}

const TP6mAggregate = withErrorBoundary(TP6mAggregate_);

export { TP6mAggregate, pullAggregate, DESIRED_BROWSER };
