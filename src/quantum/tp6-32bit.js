import _ from 'lodash';
import React from 'react';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import { PAGES } from './config';
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
  constructor({ classes }) {
    super({});
    const allCharts = _
      .chain(PAGES.data)
      // ZIP HEADER WITH ROWS TO GET OBJECTS
      .map(row => _.zipObject(PAGES.header, row))
      // GROUP BY title
      .groupBy(row => row.title)
      // LOOP OVER EACH KEY/VALUE
      .toPairs()
      .map(([title, series], i) => {
        return (
          <div className={classes.chart}>
            <PerfherderGraphContainer
              key={`pages${i}`}
              title={title}
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
        );
      })
      // SPLIT INTO TWO
      .chunk(2)
      // TRANSPOSE, SO WE HAVE TWO COLUMNS
      .unzip()
      .value();
    this.props = { classes: classes, allCharts: allCharts };
    const temp = this.props.allCharts;
    console.log(temp);
  }

  render() {
    const { classes, allCharts } = this.props;
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
  allCharts: PropTypes.shape({}),
};


export default withStyles(styles)(TP6_32);
