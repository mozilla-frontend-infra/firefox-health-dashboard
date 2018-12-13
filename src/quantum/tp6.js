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

class TP6 extends React.Component {
  constructor(props) {
    super(props);
    const { classes, match } = this.props;
    const bits = match.params.bits;

    this.state = {
      allCharts: _
        .chain(TP6_PAGES)
        .filter(row => row.bits === bits)
        // GROUP BY title
        .groupBy(row => row.title)
        // LOOP OVER EACH KEY/VALUE
        .toPairs()
        .map(([title, series], i) => (
          <div key={`page_${bits}_${i}`} className={classes.chart}>
            <PerfherderGraphContainer
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
        ))
        // SPLIT INTO TWO
        .chunk(2)
        // TRANSPOSE, SO WE HAVE TWO COLUMNS
        .unzip()
        .value(),
    };
  }

  render() {
    const { allCharts } = this.state;
    const { classes, match } = this.props;
    const bits = match.params.bits;

    return (
      <div className={classes.body}>
        <DashboardPage key={bits} title={`TP6 - Page load on ${bits} bits`}>
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


TP6.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      bits: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};


export default withStyles(styles)(TP6);
