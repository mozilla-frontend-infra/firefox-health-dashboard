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
    const { classes, location } = this.props;
    const params = new URLSearchParams(location.search);
    const limits = { bits: params.get('bits') };

    return (
      <div className={classes.body}>
        <DashboardPage key={limits.bits} title={`TP6 - Page load on ${limits.bits} bits`}>
          <Grid container spacing={24} className={classes.area}>
            {
              frum(TP6_PAGES)
                .filter(limits)
                .groupBy('title')
                .map(([series, { title }]) => (
                  <Grid item xs={6} key={`page_${title}_${limits.bits}`} className={classes.chart}>
                    <PerfherderGraphContainer
                      title={title}
                      series={series.map((s) => { return { label: s.label, seriesConfig: s }; })}
                    />
                  </Grid>
                ))
                .toArray()
            }
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
