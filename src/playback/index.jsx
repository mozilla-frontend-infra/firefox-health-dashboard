import React from 'react';
import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { selectFrom } from '../vendor/vectors';
import { BROWSERS, ENCODINGS, PLATFORMS, SIZES, SUITES, TESTS } from './config';
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
    const {
      classes,
      navigation,
      platform,
      browser,
      suite,
      encoding,
    } = this.props;
    const platformDetails = selectFrom(PLATFORMS)
      .where({ id: platform })
      .first();
    const browserDetails = selectFrom(BROWSERS)
      .where({ id: browser })
      .first();

    return (
      <DashboardPage
        title="Playback"
        key={`page_${platform}_${browser}_${suite}_${encoding}`}>
        {navigation}
        <Grid container spacing={24}>
          {selectFrom(SIZES).map(({ size }) => (
            <Grid
              item
              xs={6}
              key={`page_${platform}_${browser}_${suite}_${encoding}_${size}`}
              className={classes.chart}>
              <PerfherderGraphContainer
                title={size}
                series={selectFrom(TESTS)
                  .where({
                    suite,
                    encoding,
                    size,
                  })
                  .map(({ speed, filter: testFilter }) => ({
                    label: speed,
                    seriesConfig: {
                      and: [
                        platformDetails.filter,
                        browserDetails.filter,
                        testFilter,
                      ],
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
    defaultValue: 'win64',
    options: PLATFORMS,
  },
  {
    type: Picker,
    id: 'browser',
    label: 'Browser',
    defaultValue: 'firefox',
    options: BROWSERS,
  },
  {
    type: Picker,
    id: 'suite',
    label: 'Suite',
    defaultValue: 'Playback',
    options: selectFrom(SUITES).select({ id: 'suite', label: 'suite' }),
  },
  {
    type: Picker,
    id: 'encoding',
    label: 'Encoding',
    defaultValue: 'H264',
    options: selectFrom(ENCODINGS).select({
      id: 'encoding',
      label: 'encoding',
    }),
  },
];

export default withNavigation(nav)(withStyles(styles)(Power));
