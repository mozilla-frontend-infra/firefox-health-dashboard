/* eslint-disable react/no-array-index-key */
import React from 'react';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { round } from '../vendor/math';
import { exists, missing } from '../vendor/utils';
import { selectFrom } from '../vendor/vectors';
import { PLATFORMS, TP6_COMBOS, TP6_TESTS, TP6M_SITES, } from '../quantum/config';
import { withNavigation } from '../vendor/components/navigation';
import Picker from '../vendor/components/navigation/Picker';
import DashboardPage from '../components/DashboardPage';
import PerfherderGraphContainer from '../containers/PerfherderGraphContainer';
import ChartJSWrapper from '../vendor/components/chartJs/ChartJsWrapper';
import { g5Reference, TARGET_NAME } from './config';
import { pullAggregate } from './TP6mAggregate';
import Section from '../components/Section';
import { timePickers} from "../utils/timePickers";
import { Domain } from '../vendor/jx/domains';

const styles = {
  chart: {
    justifyContent: 'center',
    padding: '1rem',
  },
};

class TP6M extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  async componentDidMount() {
    const {test, platform, past, ending} = this.props;

    // BE SURE THE timeDomain IS SET BEFORE DOING ANY await
    const timeDomain = Domain.newInstance({type: 'time', past, ending});
    const tests = selectFrom(TP6_TESTS).where({test});
    const testMode = tests.select('mode').first();
    const sites = TP6M_SITES.filter(({ mode }) =>
      mode.includes(testMode)
    ).materialize();
    const aggregate = await pullAggregate({
      condition: {
        or: TP6_COMBOS.where({ test, platform }).select('filter'),
      },
      sites,
      tests,
      platforms: selectFrom(PLATFORMS).where({ platform }),
      timeDomain,
    });
    const referenceValue = aggregate.where({ test, platform }).ref.getValue();


    if (missing(referenceValue)) {
      // THERE IS NO GEOMEAN TO CALCULATE
      this.setState({ summaryData: null, test, platform });

      return;
    }

    const summaryData = {
      datasets: aggregate
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
        .append(
          exists(referenceValue) && {
            label: TARGET_NAME,
            style: {
              type: 'line',
              backgroundColor: 'gray',
              borderColor: 'gray',
              fill: false,
              pointRadius: '0',
              pointHoverBackgroundColor: 'gray',
              lineTension: 0,
            },
            data: aggregate
              .where({ test, platform })
              .along('pushDate')
              .map(({ pushDate, ref }) => ({
                x: pushDate.getValue(),
                y: ref.getValue(),
              }))
              .toArray(),
          }
        )
        .toArray(),
    };

    this.setState({ summaryData, test, platform });
  }

  async componentDidUpdate(prevProps) {
    if (["test", "platform", "past", "ending"].every(v=>this.props[v]===prevProps[v])){
      return;
    }

    this.componentDidMount();
  }

  render() {
    const { classes, navigation, test, platform, past, ending } = this.props;
    const timeDomain = Domain.newInstance({type: 'time', past, ending});
    let { summaryData } = this.state;
    if (test !== this.state.test || platform !== this.state.platform) {
      summaryData = null;
    }

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
              {summaryData && (
                <ChartJSWrapper
                  title={`Geomean of ${subtitle}`}
                  data={summaryData}
                  height={200}
                  options={{
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
                  className={classes.chart}>
                  <PerfherderGraphContainer
                    timeDomain={timeDomain}
                    title={site}
                    reference={(() => {
                      const value = round(
                        g5Reference.where({ test, platform, site }).getValue(),
                        { places: 2 }
                      );

                      return {
                        label: `Target (${value})`,
                        value,
                      };
                    })()}
                    series={selectFrom(series)
                      .sortBy(['ordering'])
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
    defaultValue: 'warm-loadtime',
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
  ...timePickers
];

export default withNavigation(nav)(withStyles(styles)(TP6M));
