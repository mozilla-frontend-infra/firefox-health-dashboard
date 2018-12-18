import React from 'react';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { frum } from '../utils/query_ops';
import { TP6_PAGES } from './config';
import DashboardPage from '../components/DashboardPage/index';
import PerfherderGraphContainer from '../containers/PerfherderGraphContainer/index';

const styles = {
  body: {
    backgroundColor: 'white',
  },
  area: {
    display: 'flex',
  },
  column: {
    flex: '50%',
    alignItems: 'center',
  },
  chart: {
    justifyContent: 'center',
    padding: '1rem',
  },
};

class TP6 extends React.Component {
  render() {
    const { classes, match } = this.props;
    const bits = match.params.bits;

    return (
      <div className={classes.body}>
        <DashboardPage key={bits} title={`TP6 - Page load on ${bits} bits`}>
          <Grid container spacing={24} className={classes.area}>
            {
              frum(TP6_PAGES)
              // CHOOSE CHARTS BASED ON bits
                .filter(row => row.bits === bits)
                // GROUP BY title
                .groupBy('title')
                // LOOP OVER EACH title FILL MAKE ONE CHART
                .map(([series, { title }, i]) => (
                  <Grid item xs={6} key={`page_${bits}_${i}`} className={classes.chart}>
                    <PerfherderGraphContainer
                      title={title}
                      series={series.map((s) => { return { label: s.label, seriesConfig: s }; })}
                    />
                  </Grid>
                ))
                .value()
            }
          </Grid>
        </DashboardPage>
      </div>
    );
  }
}


TP6.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      bits: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};


export default withStyles(styles)(TP6);
