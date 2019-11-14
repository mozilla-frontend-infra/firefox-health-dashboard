import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid/Grid';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import { URL } from '../vendor/requests';
import { selectFrom } from '../vendor/vectors';
import { missing } from '../vendor/utils';
import { geomean, round, sum } from '../vendor/math';
import {
  BROWSER_PLATFORMS, TP6_COMBOS, TP6_TESTS, TP6M_SITES,
} from '../quantum/config';
import { getData } from '../vendor/perfherder';
import { withErrorBoundary } from '../vendor/errors';
import jx from '../vendor/jx/expressions';
import { Cube, HyperCube, window } from '../vendor/jx/cubes';
import {
  GEOMEAN_DESCRIPTION,
  geoTip,
  REFERENCE_BROWSER,
  REFERENCE_COLOR,
  TARGET_NAME,
} from './config';
import ChartJSWrapper from '../vendor/components/chartJs/ChartJsWrapper';
import timer from '../vendor/timer';
import { DetailsIcon } from '../utils/icons';
import { TimeDomain } from '../vendor/jx/domains';


/*
condition - json expression to pull perfherder data
 */
async function pullAggregate({
  condition,
  test,
  browser,
  platform,
  timeDomain,
}) {
  const tests = selectFrom(TP6_TESTS).where({ test });
  const testMode = tests.select('mode').first();
  const sites = TP6M_SITES.filter(({ mode }) => mode.includes(testMode)).materialize();
  const platforms = selectFrom(BROWSER_PLATFORMS).where({ platform, browser });
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

  const rawReference = selectFrom(fennec64)
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

  const referenceValue = window(
    { rawReference },
    {
      edges: ['test', 'platform', 'site'],
      value: ({ rawReference }) => {
        const values = selectFrom(rawReference).select('value');
        if (values.count() === 0) return null;
        const min = values.min() * 0.8;
        const max = values.max() * 0.8;
        const avg = round((min + max) / 2, { places: 2 });
        return {
          label: `Target (approx ${avg})`,
          range: { min, max },
        };
      },
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
    { daily, referenceValue },
    {
      edges: ['test', 'platform', 'pushDate'],
      value: row => {
        const { daily, referenceValue } = row;

        return round(
          selectFrom(daily, referenceValue)
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
    { mask, referenceValue },
    {
      edges: ['test', 'platform'],
      value: ({ mask, referenceValue }) => sum(selectFrom(mask, referenceValue).map((m, r) => ((m && r) ? 1 : 0))),
    },
  );
  const total = Cube.newInstance({ edges: [], zero: () => sites.count() });


  const refMean = window(
    { mask, referenceValue },
    {
      edges: ['test', 'platform'],
      value: ({ mask, referenceValue }) => ({
        range: {
          min: round(
            geomean(selectFrom(mask, referenceValue).map((m, r) => ((m && r) ? r.range.min : null))),
            { places: 3 },
          ),
          max: round(
            geomean(selectFrom(mask, referenceValue).map((m, r) => ((m && r) ? r.range.max : null))),
            { places: 3 },
          ),
        },
      }),
    },
  );

  processData.done();

  return new HyperCube({
    result, refMean, referenceValue, count, total,
  });
}

class TP6mAggregate_ extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const {
      browser, platform, test, timeDomain,
    } = this.props;
    const condition = {
      or: TP6_COMBOS.filter(
        jx({
          eq: {
            browser,
            platform,
            test,
          },
        }),
      ).select('filter'),
    };
    const data = await pullAggregate({
      condition,
      sites: TP6M_SITES,
      test,
      browser,
      platform,
      timeDomain,
    });

    this.setState({ data });
  }

  render() {
    const { browser, test } = this.props;
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
          .where({ test })
          .enumerate()
          .map(({ label, test }) => data
            .where({ test })
            .along('platform')
            .enumerate()
            .map(row => {
              const platform = row.platform.getValue();
              const count = row.count.getValue();
              const total = row.total.getValue();
              const platformLabel = selectFrom(BROWSER_PLATFORMS)
                .where({ browser, platform })
                .first()
                .label;

              return (
                <Grid item xs={6} key={platform}>
                  <ChartJSWrapper
                    title={`Geomean of ${label} for ${platformLabel} (${count} of ${total} sites reporting)`}
                    urls={[
                      {
                        title: 'show details',
                        icon: DetailsIcon,
                        url: URL({
                          path: '/android/tp6m',
                          query: {
                            test,
                            platform,
                          },
                        }),
                      },
                      GEOMEAN_DESCRIPTION,
                    ]}
                    standardOptions={{
                      tip: geoTip,
                      series: [
                        {
                          label: platformLabel,
                          select: { value: 'result' },
                        },
                        {
                          label: TARGET_NAME,
                          select: row.refMean.getValue(),
                          style: { color: REFERENCE_COLOR },
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

export { TP6mAggregate, pullAggregate };
