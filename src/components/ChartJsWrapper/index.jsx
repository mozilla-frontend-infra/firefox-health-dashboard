import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'react-chartjs-2';
import { withStyles } from '@material-ui/core/styles';
import generateOptions from '../../utils/chartJs/generateOptions';

const styles = {
    // This div helps with canvas size changes
    // https://www.chartjs.org/docs/latest/general/responsive.html#important-note
    chartContainer: {
      width: '600px',
      // Do not let it squeeze too much and deform
      minWidth: '400px',
      background: 'white',
    },
    title: {
      color: 'white',
      backgroundColor: 'black',
      margin: '0.1rem 0 0 0',
    },
};

const ChartJsWrapper = ({ classes, data, options, title, type = 'line' }) => (
  <div className={classes.chartContainer}>
    {title && <h2 className={classes.title}>{title}</h2>}
    <Chart
      type={type}
      data={data}
      height={80}
      options={generateOptions(options)}
    />
  </div>
);

// The properties are to match ChartJs properties
ChartJsWrapper.propTypes = {
    classes: PropTypes.shape({}).isRequired,
    options: PropTypes.shape({
      reverse: PropTypes.bool,
      scaleLabel: PropTypes.string,
      title: PropTypes.string,
    }).isRequired,
    data: PropTypes.shape({
      datasets: PropTypes.arrayOf(
        PropTypes.shape({
          // There can be more properties than data and value,
          // however, we mainly care about these as a minimum requirement
          data: PropTypes.arrayOf(
            PropTypes.shape({
              x: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.instanceOf(Date),
              ]).isRequired,
              y: PropTypes.number.isRequired,
            }),
          ),
          label: PropTypes.string.isRequired,
        }),
      ).isRequired,
    }).isRequired,
    title: PropTypes.string,
    type: PropTypes.string,
};

export default withStyles(styles)(ChartJsWrapper);
