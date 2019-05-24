import React from 'react';
import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { selectFrom } from '../vendor/vectors';
import { BROWSERS, PLATFORMS, TESTS } from './config';
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
    const { classes, navigation, platform: platformId } = this.props;
    const platform = selectFrom(PLATFORMS)
      .where({ id: platformId })
      .first();

    return (
      <DashboardPage title="Power Usage" key={`page_${platform.id}`}>
        {navigation}
        <Grid container spacing={24}>
          {selectFrom(TESTS).map(({ id, label, filter: testFilter }) => (
            <Grid
              item
              xs={6}
              key={`page_${id}_${platform.id}`}
              className={classes.chart}>
              <PerfherderGraphContainer
                title={label}
                series={selectFrom(BROWSERS)
                  .map(({ label, filter: browserFilter }) => ({
                    label,
                    seriesConfig: {
                      and: [testFilter, platform.filter, browserFilter],
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
    id: 'platform',
    label: 'Platform',
    defaultValue: 'p2-aarch64',
    options: PLATFORMS,
  },
];

export default withNavigation(nav)(withStyles(styles)(Power));
