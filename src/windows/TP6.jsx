/* eslint-disable react/no-array-index-key */
import React from 'react';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { selectFrom } from '../vendor/vectors';
import { TP6_COMBOS, TP6_TESTS } from './config';
import { withNavigation } from '../vendor/components/navigation';
import Picker from '../vendor/components/navigation/Picker';
import DashboardPage from '../utils/DashboardPage';
import { PerfherderGraphContainer } from '../utils/PerfherderGraphContainer';
import { timePickers } from '../utils/timePickers';
import { TimeDomain } from '../vendor/jx/domains';

const styles = {
  body: {
    backgroundColor: 'white',
  },
  chart: {
    justifyContent: 'center',
    padding: '1rem',
  },
};

class TP6 extends React.Component {
  render() {
    const {
      classes, navigation, test, past, ending, platform,
    } = this.props;
    const timeDomain = new TimeDomain({ past, ending, interval: 'day' });
    const { label } = selectFrom(TP6_TESTS)
      .where({ test })
      .first();
    const subtitle = `${label} on ${platform}`;

    return (
      <div className={classes.body}>
        <DashboardPage key={subtitle} title="TP6 Desktop" subtitle={subtitle}>
          {navigation}
          <Grid container spacing={24}>
            {selectFrom(TP6_COMBOS)
              .where({ test, platform })
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
                    series={selectFrom(series)
                      .sort(['ordering'])
                      .map(({ browser, platform, filter }) => ({
                        label: `${browser} (${platform})`,
                        filter,
                      }))
                      .toArray()}
                  />
                </Grid>
              ))}
          </Grid>
        </DashboardPage>
      </div>
    );
  }
}

TP6.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
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
    defaultValue: 'win64',
    options: ['win32', 'win64', 'aarch64', 'linux64'].map(item => ({
      id: item,
      label: item,
    })),
  },
  ...timePickers,
];

export default withNavigation(nav)(withStyles(styles)(TP6));
