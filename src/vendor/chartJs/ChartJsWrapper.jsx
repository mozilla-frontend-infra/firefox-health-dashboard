import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'react-chartjs-2';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { generateDatasetStyle, generateOptions } from './utils';
import { ErrorMessage } from '../errors';
import { selectFrom } from '../vectors';

const styles = {
  // This div helps with canvas size changes
  // https://www.chartjs.org/docs/latest/general/responsive.html#important-note
  chartContainer: {
    width: '100%',
    // Do not let it squeeze too much and deform
    minWidth: '400px',
    background: 'white',
  },
  title: {
    width: '100%',
    color: '#56565a',
    fontSize: '1rem',
    backgroundColor: '#d1d2d3',
    padding: '.2rem .3rem .3rem .3rem',
    margin: '0 1rem 0 0',
  },
  errorPanel: {
    margin: '26px auto 40px',
    width: '70%',
  },
};
const ChartJsWrapper = ({
  classes,
  data,
  isLoading,
  options,
  title,
  style = {},
  chartHeight,
  spinnerSize,
}) =>
  (() => {
    if (isLoading) {
      return (
        <div className={classes.chartContainer}>
          {title && <h2 className={classes.title}>{title}</h2>}
          <div
            style={{
              height: chartHeight,
              lineHeight: spinnerSize,
              textAlign: 'center',
              width: spinnerSize,
            }}>
            <CircularProgress />
          </div>
        </div>
      );
    }

    if (!data)
      return (
        <div className={classes.chartContainer}>
          {title && <h2 className={classes.title}>{title}</h2>}
          <div style={{ height: chartHeight }} />
        </div>
      );

    const allOldData = data.datasets.every(dataset => {
      const latestDataDate = new Date(
        selectFrom(dataset.data)
          .select('x')
          .max()
      );
      const currentDate = new Date(); // get current date
      const timeDifference = Math.abs(
        currentDate.getTime() - latestDataDate.getTime()
      );
      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

      return daysDifference > 3;
    });
    const cOptions = generateOptions(options, data);
    const defaultStyle = style;
    const cData = {
      datasets: data.datasets.map((ds, i) => {
        const { style = {}, data, label } = ds;
        const type = style.type || defaultStyle.type;

        return {
          ...generateDatasetStyle(i, type),
          ...defaultStyle,
          ...style,
          data,
          label,
        };
      }),
    };

    if (allOldData) {
      const error = new Error(
        'This item has been missing data for at least 3 days.'
      );

      return (
        <div className={classes.chartContainer}>
          <ErrorMessage error={error}>
            {title && <h2 className={classes.title}>{title}</h2>}
            <Chart
              type="line"
              data={cData}
              height={chartHeight}
              options={cOptions}
            />
          </ErrorMessage>
        </div>
      );
    }

    return (
      <div className={classes.chartContainer}>
        {title && <h2 className={classes.title}>{title}</h2>}
        <Chart
          type="line"
          data={cData}
          height={chartHeight}
          options={cOptions}
        />
      </div>
    );
  })();

// The properties are to match ChartJs properties
ChartJsWrapper.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  options: PropTypes.shape({
    reverse: PropTypes.bool,
    scaleLabel: PropTypes.string,
    title: PropTypes.string,
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
            ]),
            y: PropTypes.number,
          })
        ),
        label: PropTypes.string.isRequired,
      })
    ).isRequired,
  }),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  isLoading: PropTypes.bool,
  chartHeight: PropTypes.number,
  spinnerSize: PropTypes.string,
};

ChartJsWrapper.defaultProps = {
  data: undefined,
  options: undefined,
  title: '',
  chartHeight: 80,
  spinnerSize: '100%',
  isLoading: false,
};

export default withStyles(styles)(ChartJsWrapper);
