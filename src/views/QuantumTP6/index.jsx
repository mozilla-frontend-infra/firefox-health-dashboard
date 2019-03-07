/* eslint-disable react/no-array-index-key */
import React from 'react';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { frum } from '../../vendor/queryOps';
import { TP6_TESTS, TP6_PAGES } from '../../quantum/config';
import { withNavigation } from '../../vendor/utils/navigation';
import Picker from '../../vendor/utils/navigation/Picker';
import DashboardPage from '../../components/DashboardPage';
import PerfherderGraphContainer from '../../containers/PerfherderGraphContainer';
import { ErrorMessage, Log } from '../../vendor/errors';

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
    const { classes, navigation, test, bits } = this.props;
    const subtitle = `${
      frum(TP6_TESTS)
        .where({ id: test })
        .first().label
    } on ${bits} bits`;

    if (bits !== 32 && bits !== 64) Log.error('Invalid URL');

    return (
      <div className={classes.body}>
        <DashboardPage key={subtitle} title="TP6 Desktop" subtitle={subtitle}>
          {navigation}
          <Grid container spacing={24}>
            {frum(TP6_PAGES)
              .where({ bits })
              .groupBy('title')
              .map((series, title) => (
                <Grid
                  item
                  xs={6}
                  key={`page_${title}_${test}_${bits}`}
                  className={classes.chart}>
                  <ErrorMessage>
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
                  </ErrorMessage>
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
    defaultValue: 'loadtime',
    options: TP6_TESTS,
  },

  {
    type: Picker,
    id: 'bits',
    label: 'Bits',
    defaultValue: 64,
    options: [{ id: 32, label: '32 bits' }, { id: 64, label: '64 bits' }],
  },
];

export default withNavigation(nav)(withStyles(styles)(TP6));
