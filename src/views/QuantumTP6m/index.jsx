/* eslint-disable react/no-array-index-key */
import React from 'react';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { frum } from '../../utils/queryOps';
import { TP6M_PAGES, TP6_TESTS } from '../../quantum/config';
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
  constructor(props) {
    super(props);
    this.state = {
      test: 'loadtime',
      platform: 'android-hw-g5-7-0-arm7-api-16',
    };
  }

  render() {
    const { test, platform } = this.state;
    const { classes } = this.props;

    // const filters = frum([])
    //   .append({label: "Test", id:"test", "options": TP6_TESTS})
    //   .append({
    //     label: "Platform",
    //     id:"platform",
    //     options: TP6M_PAGES
    //       .where({browser:'geckoview'})
    //       .groupBy("platform")
    //       .map((v, k)=>({id:k, label:k}))
    //   });

    return (
      <div className={classes.body}>
        <DashboardPage
          key="tp6m"
          title="TP6 Mobile"
          subtitle={
            frum(TP6_TESTS)
              .where({ id: test })
              .first().label
          }>
          <Grid container spacing={24}>
            {frum(TP6M_PAGES)
              .where({ platform })
              .groupBy('title')
              .map((series, title) => (
                <Grid
                  item
                  xs={6}
                  key={`page_${title}_${test}`}
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

export default withStyles(styles)(TP6M);
