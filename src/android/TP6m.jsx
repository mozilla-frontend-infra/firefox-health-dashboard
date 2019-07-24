/* eslint-disable react/no-array-index-key */
import React from 'react';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { round } from '../vendor/math';
import { missing } from '../vendor/utils';
import { selectFrom } from '../vendor/vectors';
import {
  PLATFORMS,
  TP6_COMBOS,
  TP6_TESTS,
  TP6M_SITES,
} from '../quantum/config';
import { withNavigation } from '../vendor/components/navigation';
import Picker from '../vendor/components/navigation/Picker';
import DashboardPage from '../utils/DashboardPage';
import PerfherderGraphContainer from '../utils/PerfherderGraphContainer';
import ChartJSWrapper from '../vendor/components/chartJs/ChartJsWrapper';
import { g5Reference, TARGET_NAME } from './config';
import { pullAggregate } from './TP6mAggregate';
import Section from '../utils/Section';
import { timePickers } from '../utils/timePickers';
import { GMTDate as Date } from '../vendor/dates';
import { TimeDomain } from '../vendor/jx/domains';

const styles = {
  chart: {
    justifyContent: 'center',
    padding: '1rem',
  },
};
const tipStyles = {
  below: {
    color: 'LightGreen',
  },
  above: {
    color: 'Pink',
  },
};
const geoTip = withStyles(tipStyles)(
  ({
    record, series, classes, standardOptions,
  }) => {
    const referenceValue = selectFrom(standardOptions.series)
      .where({ label: TARGET_NAME })
      .first()
      .selector(record);

    return (
      <div>
        <div className={classes.title}>
          {new Date(record.x).format('yyyy-MM-dd')}
        </div>
        <div>
          <span
            style={{ backgroundColor: series.style.color }}
            className={classes.tooltipKey}
          />
          {series.label}
          {' '}
:
          {round(record.y, { places: 3 })}
        </div>
        <div>
          {(() => {
            const diff = record.y - referenceValue;

            if (diff > 0) {
              return (
                <span className={classes.above}>
                  {`${round(diff, {
                    places: 2,
                  })}ms above target`}
                </span>
              );
            }

            return (
              <span className={classes.below}>
                {`${round(-diff, {
                  places: 2,
                })}ms below target`}
              </span>
            );
          })()}
        </div>
      </div>
    );
  },
);

class TP6M extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async update() {
    const {
      test, platform, past, ending,
    } = this.props;
    // BE SURE THE timeDomain IS SET BEFORE DOING ANY await
    const timeDomain = new TimeDomain({ past, ending, interval: 'day' });
    const tests = selectFrom(TP6_TESTS).where({ test });
    const testMode = tests.select('mode').first();
    const sites = TP6M_SITES.filter(({ mode }) => mode.includes(testMode)).materialize();
    const aggregate = await pullAggregate({
      condition: {
        or: TP6_COMBOS.where({ test, platform }).select('filter'),
      },
      sites,
      tests,
      platforms: selectFrom(PLATFORMS).where({ platform }),
      timeDomain,
    });
    // THE SPECIFIC combo FOR THIS VERSION OF THE PAGE
    const combo = aggregate.where({ test, platform });
    const referenceValue = combo.ref.getValue();

    if (missing(referenceValue)) {
      // THERE IS NO GEOMEAN TO CALCULATE
      this.setState({
        data: null,
        referenceValue: null,
        test,
        platform,
      });

      return;
    }

    const count = combo.count.getValue();
    const total = combo.total.getValue();
    const geomean = aggregate
      .where({ test, platform })
      .along('platform') // dummy (only one)
      .map(({ result }) => ({
        label: selectFrom(PLATFORMS)
          .where({ platform })
          .first().label,
        data: result
          .along('pushDate')
          .map(point => ({
            x: point.pushDate.getValue(),
            y: point.getValue(),
          }))
          .toArray(),
      }))
      .toArray();
    const { data } = geomean[0];

    this.setState({
      data, count, total, test, platform, referenceValue,
    });
  }

  async componentDidMount() {
    await this.update();
  }

  async componentDidUpdate(prevProps) {
    if (
      ['test', 'platform', 'past', 'ending'].every(
        v => this.props[v] === prevProps[v],
      )
    ) {
      return;
    }

    await this.update();
  }

  render() {
    const {
      classes, navigation, test, platform, past, ending,
    } = this.props;
    const timeDomain = new TimeDomain({ past, ending, interval: 'day' });
    const {
      data, count, total, referenceValue,
    } = (() => {
      if (test !== this.state.test || platform !== this.state.platform) {
        return {};
      }

      const {
        data, count, total, referenceValue,
      } = this.state;

      return {
        data, count, total, referenceValue,
      };
    })();
    const subtitle = selectFrom(TP6_TESTS)
      .where({ test })
      .first().label;

    return (
      <DashboardPage key={subtitle} title="TP6 Mobile" subtitle={subtitle}>
        <Section title="Details by site">
          <Grid container spacing={24}>
            <Grid item xs={6} className={classes.chart}>
              {navigation}
            </Grid>
            <Grid item xs={6} className={classes.chart}>
              {data && (
                <ChartJSWrapper
                  title={`${`Geomean of ${subtitle}`
                    + ' ('}${count} of ${total} sites reported)`}
                  standardOptions={{
                    data,
                    tip: geoTip,
                    series: [
                      { label: 'Geomean', select: { value: 'y' } },
                      {
                        label: TARGET_NAME,
                        select: { value: referenceValue },
                        style: { color: 'gray' },
                      },
                      { label: 'Date', select: { value: 'x', axis: 'x' } },
                    ],
                    'axis.y.label': 'Geomean',
                    'axis.x': timeDomain,
                  }}
                />
              )}
            </Grid>

            {selectFrom(TP6_COMBOS)
              .where({
                browser: ['geckoview', 'fenix'],
                platform,
                test,
              })
              .groupBy('site')
              .map((series, site) => (
                <Grid
                  item
                  xs={6}
                  key={`page_${site}_${test}_${platform}_${past}_${ending}`}
                  className={classes.chart}
                >
                  <PerfherderGraphContainer
                    timeDomain={timeDomain}
                    title={site}
                    reference={(() => {
                      const value = round(
                        g5Reference.where({ test, platform, site }).getValue(),
                        { places: 2 },
                      );

                      return {
                        label: `Target (${value})`,
                        value,
                      };
                    })()}
                    series={selectFrom(series)
                      .sort(['ordering'])
                      .select({ label: 'browser', filter: 'filter' })
                      .toArray()}
                  />
                </Grid>
              ))}
          </Grid>
        </Section>
      </DashboardPage>
    );
  }
}

TP6M.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  test: PropTypes.string.isRequired,
  platform: PropTypes.string.isRequired,
};

const nav = [
  {
    type: Picker,
    id: 'test',
    label: 'Test',
    defaultValue: 'cold-loadtime',
    options: selectFrom(TP6_TESTS)
      .select({ id: 'test', label: 'label' })
      .toArray(),
  },
  {
    type: Picker,
    id: 'platform',
    label: 'Platform',
    defaultValue: 'geckoview-g5',
    options: selectFrom(PLATFORMS)
      .where({ browser: ['geckoview', 'fenix'] })
      .select({ id: 'platform', label: 'label' })
      .toArray(),
  },
  ...timePickers,
];

export default withNavigation(nav)(withStyles(styles)(TP6M));
