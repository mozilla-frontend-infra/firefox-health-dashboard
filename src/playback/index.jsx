import React from 'react';
import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { selectFrom } from '../vendor/vectors';
import { BROWSERS, ENCODINGS, PLATFORMS, SIZES, TESTS } from './config';
import { withNavigation } from '../vendor/components/navigation';
import Picker from '../vendor/components/navigation/Picker';
import DashboardPage from '../components/DashboardPage';
import PerfherderGraphContainer from '../containers/PerfherderGraphContainer';
import { TimeDomain } from '../vendor/jx/domains';
import { timePickers } from '../utils/timePickers';

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
      encoding,
      past,
      ending,
    } = this.props;
    const timeDomain = new TimeDomain({ past, ending, interval: 'day' });
    const platformDetails = selectFrom(PLATFORMS)
      .where({ id: platform })
      .first();
    const browserDetails = selectFrom(BROWSERS)
      .where({ id: browser })
      .first();

    return (
      <DashboardPage
        title="Playback"
        key={`page_${platform}_${browser}_${encoding}_${past}_${ending}`}>
        {navigation}
        <Grid container spacing={24}>
          {selectFrom(SIZES).map(({ size }) => (
            <Grid
              item
              xs={6}
              key={`page_${platform}_${browser}_${encoding}_${size}`}
              className={classes.chart}>
              <PerfherderGraphContainer
                timeDomain={timeDomain}
                title={`Dropped Frames ${size}`}
                style={
                  {
                    // 'axis.y.format': '{{.}}%',
                    // 'axis.y.max.max': 1,
                  }
                }
                series={selectFrom(TESTS)
                  .where({
                    encoding,
                    size,
                  })
                  .map(({ speed, filter: testFilter }) => ({
                    label: `${speed}x`,
                    filter: {
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
    defaultValue: 'mac',
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
    id: 'encoding',
    label: 'Encoding',
    defaultValue: 'VP9',
    options: selectFrom(ENCODINGS).select({
      id: 'encoding',
      label: 'encoding',
    }),
  },
  ...timePickers,
];

export default withNavigation(nav)(withStyles(styles)(Power));
