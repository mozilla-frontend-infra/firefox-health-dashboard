import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'react-chartjs-2';
import CircularProgress from '@material-ui/core/CircularProgress';
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
      padding: '.3rem .3rem .3rem .3rem',
    },
};

const ChartJsWrapper = ({
  classes, data, options, title, type, chartHeight, spinnerSize,
}) => (
  data ? (
    <div className={classes.chartContainer}>
      {title && <h2>{title}</h2>}
      <Chart
        type={type}
        data={data}
        height={chartHeight}
        options={generateOptions(options)}
      />
    </div>
  ) : (
    <div style={{ lineHeight: spinnerSize, textAlign: 'center', width: spinnerSize }}>
      <CircularProgress />
    </div>
  )
);

// The properties are to match ChartJs properties
ChartJsWrapper.propTypes = {
    classes: PropTypes.shape({}).isRequired,
    options: PropTypes.shape({
      reverse: PropTypes.bool,
      scaleLabel: PropTypes.string,
      title: PropTypes.string,
      tooltipFormat: PropTypes.bool,
      tooltips: PropTypes.shape({
        callbacks: PropTypes.object,
      }),
      ticksCallback: PropTypes.func,
    }),
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
    }),
    title: PropTypes.string,
    type: PropTypes.string,
    chartHeight: PropTypes.number,
    spinnerSize: PropTypes.string,
};

ChartJsWrapper.defaultProps = {
    data: undefined,
    options: undefined,
    title: '',
    type: 'line',
    chartHeight: 80,
    spinnerSize: '8rem',
};

export default withStyles(styles)(ChartJsWrapper);
