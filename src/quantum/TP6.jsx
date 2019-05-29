/* eslint-disable react/no-array-index-key */
import React from 'react';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { selectFrom } from '../vendor/vectors';
import { TP6_COMBOS, TP6_TESTS } from './config';
import { withNavigation } from '../vendor/components/navigation';
import Picker from '../vendor/components/navigation/Picker';
import DashboardPage from '../components/DashboardPage';
import PerfherderGraphContainer from '../containers/PerfherderGraphContainer';
import { timePickers } from '../utils/timePickers';
import { Domain } from '../vendor/jx/domains';

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
    const { classes, navigation, test, bits, past, ending } = this.props;
    const timeDomain = Domain.newInstance({ type: 'time', past, ending });
    const { label } = selectFrom(TP6_TESTS)
      .where({ test })
      .first();
    const subtitle = `${label} on ${bits} bits`;

    return (
      <div className={classes.body}>
        <DashboardPage key={subtitle} title="TP6 Desktop" subtitle={subtitle}>
          {navigation}
          <Grid container spacing={24}>
            {selectFrom(TP6_COMBOS)
              .where({ bits, test })
              .groupBy('site')
              .map((series, site) => (
                <Grid
                  item
                  xs={6}
                  key={`page_${site}_${test}_${bits}`}
                  className={classes.chart}>
                  <PerfherderGraphContainer
                    timeDomain={timeDomain}
                    title={site}
                    series={selectFrom(series)
                      .sortBy(['ordering'])
                      .select({ label: 'browser', filter: 'filter' })
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
    id: 'bits',
    label: 'Bits',
    defaultValue: 64,
    options: [{ id: 32, label: '32 bits' }, { id: 64, label: '64 bits' }],
  },
  ...timePickers,
];

export default withNavigation(nav)(withStyles(styles)(TP6));
