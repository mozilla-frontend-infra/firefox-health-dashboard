import React from 'react';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import _ from '../utils/more_lodash';
import { TP6_PAGES } from './config';
import DashboardPage from '../components/DashboardPage/index';
import PerfherderGraphContainer from '../containers/PerfherderGraphContainer/index';


const styles = {
  // This div helps with canvas size changes
  // https://www.chartjs.org/docs/latest/general/responsive.html#important-note
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

class TP6_32 extends React.Component {
  constructor(props) {
    super(props);
    const { classes } = this.props;

    this.state = {
      allCharts: _
        .chain(TP6_PAGES)
        .filter(row => row.bits === 32)
        // GROUP BY title
        .groupBy(row => row.title)
        // LOOP OVER EACH KEY/VALUE
        .toPairs()
        .map(([title, series], i) => (
          <div className={classes.chart}>
            <PerfherderGraphContainer
              key={`pages${i}`}
              title={title}
              type='scatter'
              series={_
                .chain(series)
                .map((s) => {
                  return {
                    label: s.label,
                    seriesConfig: s,
                  };
                })
                .value()
              }
            />
          </div>
        ))
        // SPLIT INTO TWO
        .chunk(2)
        // TRANSPOSE, SO WE HAVE TWO COLUMNS
        .unzip()
        .value(),
    };
  }

  render() {
    const { classes } = this.props;
    const { allCharts } = this.state;
    return (
      <div className={classes.body}>
        <DashboardPage title='TP6 - Page load on 32bit'>
          <div className={classes.area}>
            <div className={classes.column}>
              {allCharts[0]}
            </div>
            <div className={classes.column}>
              {allCharts[1]}
            </div>
          </div>
        </DashboardPage>
      </div>
    );
  }
}


TP6_32.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};


export default withStyles(styles)(TP6_32);
