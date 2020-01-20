import React from 'react';
import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { selectFrom } from '../vendor/vectors';
import { COMBOS, PLATFORMS, TESTS } from './config';
import { withNavigation } from '../vendor/components/navigation';
import Picker from '../vendor/components/navigation/Picker';
import DashboardPage from '../utils/DashboardPage';
import { PerfherderGraphContainer } from '../utils/PerfherderGraphContainer';
import { timePickers } from '../utils/timePickers';
import { TimeDomain } from '../vendor/jx/domains';

const styles = {
  chart: {
    justifyContent: 'center',
    padding: '1rem',
  },
};

class PowerDetails extends React.Component {
  render() {
    const {
      classes, navigation, suite, browser, past, ending,
    } = this.props;
    const timeDomain = new TimeDomain({ past, ending, interval: 'day' });
    const suiteCombos = selectFrom(COMBOS)
      .where({ suite });

    return (
      <DashboardPage
        title="Power Usage"
        key={`page_${browser}_${suite}_${past}_${ending}`}
      >
        {navigation}
        <Grid container spacing={24}>
          {selectFrom(TESTS).map(({ id: testId, label: testLabel, filter: testFilter }) => (
            PLATFORMS.map(({ id: platformId, label: platformLabel, filter: platformFilter }) => (
              <Grid
                item
                xs={6}
                key={`page_${testId}_${platformId}_${suite}`}
                className={classes.chart}
              >
                <PerfherderGraphContainer
                  timeDomain={timeDomain}
                  title={`${testLabel} - ${platformLabel}`}
                  series={selectFrom(suiteCombos)
                    .map(({ browserLabel, filter: browserFilter }) => ({
                      label: browserLabel,
                      filter: {
                        and: [testFilter, platformFilter, browserFilter],
                      },
                    }))
                    .toArray()}
                  missingDataInterval={10}
                />
              </Grid>
            ))))}
        </Grid>
      </DashboardPage>
    );
  }
}

const nav = [
  {
    type: Picker,
    id: 'suite',
    label: 'Suite',
    defaultValue: 'speedometer',
    options: selectFrom(COMBOS)
      .groupBy('suiteLabel')
      .map(([v]) => ({ id: v.suite, label: v.suiteLabel })),
  },
  ...timePickers,
];

export default withNavigation(nav)(withStyles(styles)(PowerDetails));
