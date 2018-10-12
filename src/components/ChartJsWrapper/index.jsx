import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'react-chartjs-2';
import { withStyles } from '@material-ui/core/styles';

const styles = {
    // This div helps with canvas size changes
    // https://www.chartjs.org/docs/latest/general/responsive.html#important-note
    chartContainer: {
      // Two graphs side by side should fit on a 13" screen
      width: '48vw',
      // Do not let it squeeze too much and deform
      minWidth: '400px',
    },
};

const ChartJsWrapper = ({ classes, data, options, type }) => (
  <div className={classes.chartContainer}>
    <Chart
      type={type}
      data={data}
      height={80}
      options={options}
    />
  </div>
);

// The properties are to match ChartJs properties
ChartJsWrapper.propTypes = {
    classes: PropTypes.shape({}).isRequired,
    data: PropTypes.shape({}).isRequired,
    options: PropTypes.shape({}).isRequired,
    type: PropTypes.string.isRequired,
};

export default withStyles(styles)(ChartJsWrapper);
