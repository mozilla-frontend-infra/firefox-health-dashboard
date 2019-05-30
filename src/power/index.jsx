import React from 'react';
import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { selectFrom } from '../vendor/vectors';
import { COMBOS, PLATFORMS, TESTS } from './config';
import { withNavigation } from '../vendor/utils/navigation';
import Picker from '../vendor/utils/navigation/Picker';
import DashboardPage from '../components/DashboardPage';
import PerfherderGraphContainer from '../containers/PerfherderGraphContainer';

const styles = {
  chart: {
    justifyContent: 'center',
    padding: '1rem',
  },
};

class Power extends React.Component {
  render() {
    const { classes, navigation, suite, browser } = this.props;
    const browserFilter = selectFrom(COMBOS)
      .where({ browser, suite })
      .first().filter;

    return (
      <DashboardPage title="Power Usage" key={`page_${browser}_${suite}`}>
        {navigation}
        <Grid container spacing={24}>
          {selectFrom(TESTS).map(({ id, label, filter: testFilter }) => (
            <Grid
              item
              xs={6}
              key={`page_${id}_${browser}_${suite}`}
              className={classes.chart}>
              <PerfherderGraphContainer
                title={label}
                series={selectFrom(PLATFORMS)
                  .map(({ label, filter: platformFilter }) => ({
                    label,
                    seriesConfig: {
                      and: [testFilter, platformFilter, browserFilter],
                    },
                  }))
                  .toArray()}
              />
            </Grid>
          ))}
        </Grid>
      </DashboardPage>
    );
  }
}

const nav = [
  {
    type: Picker,
    id: 'browser',
    label: 'Browser',
    defaultValue: 'fenix',
    options: selectFrom(COMBOS)
      .groupBy('browserLabel')
      .map(([v]) => ({ id: v.browser, label: v.browserLabel })),
  },
  {
    type: Picker,
    id: 'suite',
    label: 'Suite',
    defaultValue: 'speedometer',
    options: selectFrom(COMBOS)
      .groupBy('suiteLabel')
      .map(([v]) => ({ id: v.suite, label: v.suiteLabel })),
  },
];

export default withNavigation(nav)(withStyles(styles)(Power));
