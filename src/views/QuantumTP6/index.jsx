/* eslint-disable react/no-array-index-key */
import React from 'react';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { frum } from '../../utils/queryOps';
import { TP6_PAGES, TP6_TESTS } from '../../quantum/config';
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

class TP6 extends React.Component {
  constructor(props) {
    super(props);
    const { location } = this.props;
    const params = new URLSearchParams(location.search);

    this.state = {
      test: params.get('test') || 'loadtime',
      bits: params.get('bits') || '64',
    };
  }

  render() {
    const { classes } = this.props;
    const { test, bits } = this.state;
    const tests = TP6_TESTS;
    const subtitle = `${
      frum(tests)
        .where({ id: test })
        .first().label
    } on ${bits} bits`;

    return (
      <div className={classes.body}>
        <DashboardPage key={subtitle} title="TP6 Desktop" subtitle={subtitle}>
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

TP6.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
};

export default withStyles(styles)(TP6);
