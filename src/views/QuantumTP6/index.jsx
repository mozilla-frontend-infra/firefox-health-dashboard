import React from 'react';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { frum } from '../../utils/queryOps';
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
    const { bits } = this.state;

    return (
      <div className={classes.body}>
        <DashboardPage
          key={bits}
          title="TP6"
          subtitle={`Page load on ${bits} bits`}>
          <Grid container spacing={24}>
            {frum(TP6_PAGES)
              .where({ bits })
              .groupBy('title')
              .map(([series, { title }]) => (
                <Grid
                  item
                  xs={6}
                  key={`page_${title}_${bits}`}
                  className={classes.chart}>
                  <PerfherderGraphContainer
                    title={title}
                    series={frum(series)
                      .sortBy(['browser'])
                      .reverse()
                      .map(s => ({ label: s.label, seriesConfig: s }))
                      .toArray()}
                  />
                </Grid>
              ))
              .toArray()}
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
