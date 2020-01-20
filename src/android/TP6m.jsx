/* eslint-disable react/no-array-index-key */
import React from 'react';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { exists, missing } from '../vendor/utils';
import { selectFrom } from '../vendor/vectors';
import { BROWSER_PLATFORMS, TP6_COMBOS, TP6_TESTS } from '../windows/config';
import { withNavigation } from '../vendor/components/navigation';
import Picker from '../vendor/components/navigation/Picker';
import DashboardPage from '../utils/DashboardPage';
import { PerfherderGraphContainer } from '../utils/PerfherderGraphContainer';
import ChartJSWrapper from '../vendor/components/chartJs/ChartJsWrapper';
import {
  GEOMEAN_DESCRIPTION, geoTip, REFERENCE_COLOR, TARGET_NAME,
} from './config';
import { pullAggregate } from './TP6mAggregate';
import Section from '../utils/Section';
import { timePickers } from '../utils/timePickers';
import { TimeDomain } from '../vendor/jx/domains';


const styles = {
  chart: {
    justifyContent: 'center',
    padding: '1rem',
  },
};

class TP6M extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async update() {
    const {
      test, browserPlatform, past, ending,
    } = this.props;
    // BE SURE THE timeDomain IS SET BEFORE DOING ANY await
    const timeDomain = new TimeDomain({ past, ending, interval: 'day' });
    const { browser, platform, label: browserPlatformLabel } = BROWSER_PLATFORMS.where({ id: browserPlatform }).first();
    const aggregate = await pullAggregate({
      condition: {
        or: TP6_COMBOS.where({ test, browser, platform }).select('filter'),
      },
      test,
      browser,
      platform,
      timeDomain,
    });
    // THE SPECIFIC combo FOR THIS VERSION OF THE PAGE
    const combo = aggregate.where({ test, platform });
    const { referenceValue, refMean } = combo;

    if (missing(refMean.getValue())) {
      // THERE IS NO GEOMEAN TO CALCULATE
      this.setState({
        data: null,
        referenceValue: null,
        test,
        browserPlatform,
      });

      return;
    }

    const count = combo.count.getValue();
    const total = combo.total.getValue();
    const geomean = aggregate
      .where({ test, platform })
      .along('platform') // dummy (only one)
      .map(({ result }) => ({
        label: browserPlatformLabel,
        data: result
          .along('pushDate')
          .map(point => ({
            pushDate: point.pushDate.getValue(),
            result: point.getValue(),
          }))
          .toArray(),
      }))
      .toArray();
    const { data } = geomean[0];

    this.setState({
      data, count, total, test, browserPlatform, referenceValue, refMean,
    });
  }

  async componentDidMount() {
    await this.update();
  }

  async componentDidUpdate(prevProps) {
    if (
      ['test', 'browserPlatform', 'past', 'ending'].every(
        v => this.props[v] === prevProps[v],
      )
    ) {
      return;
    }

    await this.update();
  }

  render() {
    const {
      classes, navigation, test, browserPlatform, past, ending,
    } = this.props;
    const { browser, platform } = BROWSER_PLATFORMS.where({ id: browserPlatform }).first();
    const timeDomain = new TimeDomain({ past, ending, interval: 'day' });
    const {
      data, count, total, referenceValue, refMean,
    } = (() => {
      if (test !== this.state.test || browserPlatform !== this.state.browserPlatform) {
        return {};
      }

      const {
        data, count, total, referenceValue, refMean,
      } = this.state;

      return {
        data, count, total, referenceValue, refMean,
      };
    })();
    const subtitle = selectFrom(TP6_TESTS)
      .where({ test })
      .first()
      .label;

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
                  urls={GEOMEAN_DESCRIPTION}
                  standardOptions={{
                    data,
                    tip: geoTip,
                    series: [
                      { label: 'Geomean', select: { value: 'result' } },
                      {
                        label: TARGET_NAME,
                        select: refMean.getValue(),
                        style: { color: REFERENCE_COLOR },
                      },
                      { label: 'Date', select: { value: 'pushDate', axis: 'x' } },
                    ],
                    'axis.y.label': 'Geomean',
                    'axis.x': timeDomain,
                  }}
                />
              )}
            </Grid>

            {selectFrom(TP6_COMBOS)
              .where({
                browser,
                platform,
                test,
              })
              .groupBy('site')
              .map((series, site) => (
                <Grid
                  item
                  xs={6}
                  key={`page_${site}_${test}_${browserPlatform}_${past}_${ending}_${exists(referenceValue)}`}
                  className={classes.chart}
                >
                  <PerfherderGraphContainer
                    timeDomain={timeDomain}
                    title={site}

                    reference={referenceValue ? referenceValue.where({ site }).getValue() : null}
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
  browserPlatform: PropTypes.string.isRequired,
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
    id: 'browserPlatform',
    label: 'Platform',
    defaultValue: 'fenix-g5',
    options: selectFrom(BROWSER_PLATFORMS)
      .where({ browser: ['geckoview', 'fenix'] })
      .select(['id', 'label'])
      .toArray(),
  },
  ...timePickers,
];

export default withNavigation(nav)(withStyles(styles)(TP6M));
