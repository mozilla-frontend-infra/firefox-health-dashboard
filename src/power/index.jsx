import React from 'react';
import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { selectFrom } from '../vendor/vectors';
import { COMBOS, PLATFORMS, TESTS } from './config';
import { withNavigation } from '../vendor/components/navigation';
import Picker from '../vendor/components/navigation/Picker';
import DashboardPage from '../components/DashboardPage';
import PerfherderGraphContainer from '../containers/PerfherderGraphContainer';
import Date from '../vendor/dates';
import {
  DurationPicker,
  QUERY_TIME_FORMAT,
} from '../vendor/components/navigation/DurationPicker';
import { Domain } from '../vendor/jx/domains';

const styles = {
  chart: {
    justifyContent: 'center',
    padding: '1rem',
  },
};

class Power extends React.Component {
  render() {
    const { classes, navigation, suite, platform, past, ending } = this.props;
    const timeDomain = Domain.newInstance({ type: 'time', past, ending });
    const platformDetails = selectFrom(PLATFORMS)
      .where({ id: platform })
      .first();
    const combos = selectFrom(COMBOS).where({ suite });
    const idleFilter = selectFrom(COMBOS)
      .where({ suite: 'scn-power-idle', browser: 'geckoview' })
      .first().filter;

    return (
      <DashboardPage title="Power Usage" key={`page_${platform}_${suite}`}>
        {navigation}
        <Grid container spacing={24}>
          {selectFrom(TESTS).map(({ id, label, filter: testFilter }) => (
            <Grid
              item
              xs={6}
              key={`page_${id}_${platform}_${suite}`}
              className={classes.chart}>
              <PerfherderGraphContainer
                timeDomain={timeDomain}
                title={label}
                series={combos
                  .map(({ browserLabel, filter: browserFilter }) => ({
                    label: browserLabel,
                    filter: {
                      and: [testFilter, platformDetails.filter, browserFilter],
                    },
                  }))
                  .append({
                    label: 'Idle Power (geckoview)',
                    filter: {
                      and: [testFilter, platformDetails.filter, idleFilter],
                    },
                  })
                  .toArray()}
              />
            </Grid>
          ))}
        </Grid>
      </DashboardPage>
    );
  }
}

const todayText = Date.today().format(QUERY_TIME_FORMAT);
const nav = [
  {
    type: Picker,
    id: 'platform',
    label: 'Platform',
    defaultValue: 'p2-aarch64',
    options: PLATFORMS,
  },
  {
    type: Picker,
    id: 'suite',
    label: 'Suite',
    defaultValue: 'speedometer',
    options: selectFrom(COMBOS)
      // .filter(jx({ not: { eq: { suite: 'scn-power-idle' } } }))
      .groupBy('suite')
      .map((v, suite) => ({ id: suite, label: suite })),
  },
  {
    type: DurationPicker,
    id: 'past',
    label: 'Show past',
    defaultValue: 'month',
    options: [
      { id: 'day', label: '1 day' },
      { id: '2day', label: '2 days' },
      { id: 'week', label: 'week' },
      { id: '2week', label: '2 weeks' },
      { id: 'month', label: 'month' },
      { id: '3month', label: '3 months' },
      { id: 'year', label: 'year' },
    ],
  },
  {
    type: Picker,
    id: 'ending',
    label: 'Ending',
    defaultValue: todayText,
    options: [{ id: todayText, label: 'Today' }],
  },
];

export default withNavigation(nav)(withStyles(styles)(Power));
