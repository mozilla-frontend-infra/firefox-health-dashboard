import React from 'react';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import frum from '../../utils/queryOps';
import { TP6_PAGES } from '../../quantum/config';
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
    this.state = { bits: params.get('bits') };
  }

  render() {
    const { classes } = this.props;
    const state = this.state;

    return (
      <div className={classes.body}>
        <DashboardPage
          key={state.bits}
          title={'TP6'}
          subtitle={`Page load on ${state.bits} bits`}
        >
          <Grid container spacing={24}>
            {
              frum(TP6_PAGES)
                .filter(state)
                .groupBy('title')
                .map(([series, { title }]) => (
                  <Grid item xs={6} key={`page_${title}_${state.bits}`} className={classes.chart}>
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
