/* eslint-disable react/no-array-index-key */
import React from 'react';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { frum } from '../../vendor/queryOps';
import { TP6_TESTS, TP6M_PAGES, PLATFORMS } from '../../quantum/config';
import { withNavigation } from '../../vendor/utils/navigation';
import Picker from '../../vendor/utils/navigation/Picker';
import DashboardPage from '../../components/DashboardPage';
import PerfherderGraphContainer from '../../containers/PerfherderGraphContainer';

const styles = {
  body: {
    backgroundColor: 'white',
  },
  chart: {
    justifyContent: 'center',
    padding: '1rem',
  },
};

class TP6M extends React.Component {
  render() {
    const { classes, navigation, test, platform } = this.props;
    const subtitle = frum(TP6_TESTS)
      .where({ id: test })
      .first().label;

    return (
      <div className={classes.body}>
        <DashboardPage key={subtitle} title="TP6 Mobile" subtitle={subtitle}>
          {navigation}
          <Grid container spacing={24}>
            {frum(TP6M_PAGES)
              .filter(d => d.platform.startsWith(platform))
              .groupBy('title')
              .map((series, title) => (
                <Grid
                  item
                  xs={6}
                  key={`page_${title}_${test}_${platform}`}
                  className={classes.chart}>
                  <PerfherderGraphContainer
                    title={title}
                    series={frum(series)
                      .sortBy(['browser'])
                      .reverse()
                      .map(s => ({
                        label: s.label,
                        seriesConfig: { ...s, test },
                        options: { includeSubtests: true },
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

TP6M.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
};

const nav = [
  {
    type: Picker,
    id: 'test',
    label: 'Test',
    defaultValue: 'loadtime',
    options: TP6_TESTS,
  },

  {
    type: Picker,
    id: 'platform',
    label: 'Platform',
    defaultValue: 'android-hw-g5-7-0-arm7-api-16',
    options: frum(PLATFORMS)
      .where({ browser: 'geckoview' })
      .select({ id: 'platform', label: 'label' })
      .toArray(),
  },
];

export default withNavigation(nav)(withStyles(styles)(TP6M));
