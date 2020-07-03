/* eslint-disable react/no-array-index-key */
import React from 'react';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { withNavigation } from '../vendor/components/navigation';
import Picker from '../vendor/components/navigation/Picker';
import DashboardPage from '../utils/DashboardPage';
import { PerfherderGraphContainer } from '../utils/PerfherderGraphContainer';
import { timePickers } from '../utils/timePickers';
import { TimeDomain } from '../vendor/jx/domains';
import { PLATFORMS, TP6_FISSION_COMBOS } from './config';
import { selectFrom } from '../vendor/vectors';
import { TP6_TESTS } from '../windows/config';

const styles = {
  body: {
    backgroundColor: 'white',
  },
  chart: {
    justifyContent: 'center',
    padding: '1rem',
  },
};

class TP6Fission extends React.Component {
  render() {
    const {
      classes, navigation, platform, past, ending, test,
    } = this.props;
    const timeDomain = new TimeDomain({ past, ending, interval: 'day' });
    const { label } = selectFrom(TP6_TESTS)
      .where({ test })
      .first();
    const subtitle = `${label} on ${platform}`;
    const platformFilter = selectFrom(PLATFORMS)
      .where({ id: platform })
      .first().filter;

    return (
      <div className={classes.body}>
        <DashboardPage key={subtitle} title="TP6 Fission Comparison" subtitle={subtitle}>
          {navigation}
          <Grid container spacing={1}>
            {selectFrom(TP6_FISSION_COMBOS)
              .where({ test })
              .map(({ browser, filter, site }) => (
                <Grid
                  item
                  xs={6}
                  key={`page_${site}_${test}_${platform}_${past}_${ending}`}
                  className={classes.chart}
                >
                  <PerfherderGraphContainer
                    timeDomain={timeDomain}
                    title={site}
                    series={[{
                      label: `${browser}`,
                      filter: { and: [platformFilter, filter, { eq: { fission: false } }] },
                    }, {
                      label: `${browser} (fission)`,
                      filter: { and: [platformFilter, filter, { eq: { fission: true } }] },
                    }]}
                  />
                </Grid>
              ))}
          </Grid>
        </DashboardPage>
      </div>
    );
  }
}

TP6Fission.propTypes = {
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
    defaultValue: 'cold-loadtime',
    options: selectFrom(TP6_TESTS)
      .select({ id: 'test', label: 'label' })
      .toArray(),
  },
  {
    type: Picker,
    id: 'platform',
    label: 'Platform',
    defaultValue: 'win64-qr',
    options: selectFrom(PLATFORMS)
      .select({ id: 'id', label: 'label' })
      .toArray(),
  },
  ...timePickers,
];

export default withNavigation(nav)(withStyles(styles)(TP6Fission));
