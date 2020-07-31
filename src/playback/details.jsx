import React from 'react';
import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { selectFrom } from '../vendor/vectors';
import {
  BROWSERS, ENCODINGS, PLATFORMS, STANDARD_SIZES, STANDARD_TESTS, WIDEVINE_TESTS, PLAYBACK_SUITES, WIDEVINE_H264_SIZES, WIDEVINE_VP9_SIZES,
} from './config';
import { withNavigation } from '../vendor/components/navigation';
import Picker from '../vendor/components/navigation/Picker';
import DashboardPage from '../utils/DashboardPage';
import { PerfherderGraphContainer } from '../utils/PerfherderGraphContainer';
import { TimeDomain } from '../vendor/jx/domains';
import { timePickers } from '../utils/timePickers';

const styles = {
  chart: {
    justifyContent: 'center',
    padding: '1rem',
  },
};

class PlaybackDetails extends React.Component {
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
    const missingDataInterval = browser === 'fenix' ? 7 : undefined;
    const tests = encoding.includes('WIDEVINE') ? WIDEVINE_TESTS : STANDARD_TESTS;

    // TODO: a better way to get the sizes automatically from tests
    let sizes;
    switch (encoding) {
      case 'WIDEVINE-H264':
        sizes = WIDEVINE_H264_SIZES;
        break;
      case 'WIDEVINE-VP9':
        sizes = WIDEVINE_VP9_SIZES;
        break;
      default:
        sizes = STANDARD_SIZES;
        break;
    }

    return (
      <DashboardPage
        title="Playback Details"
        key={`page_${platform}_${browser}_${encoding}_${past}_${ending}`}
      >
        {navigation}
        <Grid container spacing={1}>
          {selectFrom(sizes).map(({ size }) => (
            <Grid
              item
              xs={6}
              key={`page_${platform}_${browser}_${encoding}_${size}`}
              className={classes.chart}
            >
              <PerfherderGraphContainer
                timeDomain={timeDomain}
                title={`Dropped Frames ${size}`}
                series={selectFrom(tests)
                  .where({
                    encoding,
                    size,
                  })
                  .map(test => {
                    const { suite } = selectFrom(PLAYBACK_SUITES).where({ variant: test.variant, browser }).first();
                    const suiteFilter = { eq: { suite } };
                    return {
                      label: `${test.speed}x`,
                      repo: browserDetails.repo,
                      filter: {
                        and: [
                          platformDetails.filter,
                          browserDetails.filter,
                          test.filter,
                          suiteFilter,
                        ],
                      },
                    };
                  })
                  .toArray()}
                missingDataInterval={missingDataInterval}
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

export default withNavigation(nav)(withStyles(styles)(PlaybackDetails));
