import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import Chart from 'react-chartjs-2';
import ChartJS from 'chart.js';
import { cjsGenerator } from './utils';
import { Data, isEqual } from '../../datas';
import { GMTDate as Date } from '../../dates';
import { ErrorMessage } from '../../errors';
import { selectFrom } from '../../vectors';
import { coalesce, toArray } from '../../utils';
import { withTooltip } from './CustomTooltip';
import { ChartIcon, ImageIcon } from '../../../utils/icons';
import { Notes } from './Notes';

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


ChartJS.plugins.register({
  afterRender(c) {
    // SET CHART BACKGROUND FOR WHEN COPYING IMAGE
    const { ctx } = c.chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = styles.chartContainer.background;
    ctx.fillRect(0, 0, ctx.width, ctx.height);
    ctx.restore();
  },
});


const ToolTipChart = withTooltip()(Chart);


class ChartJsWrapper extends React.Component {
  constructor(props) {
    super(props);
    const { standardOptions } = props;

    this.state = standardOptions ? cjsGenerator(standardOptions) : {};
    this.state.showImage = null;
    this.chartRef = React.createRef();
  }

  async componentDidUpdate(prevProps) {
    const { standardOptions } = this.props;

    if (isEqual(standardOptions, prevProps.standardOptions)) {
      return;
    }

    // eslint-disable-next-line react/no-did-update-set-state
    this.setState(cjsGenerator(standardOptions));
  }

  render() {
    const {
      classes,
      isLoading,
      title,
      urls,
      chartHeight,
      missingDataInterval,
      notes,
    } = this.props;
    const { cjsOptions, standardOptions, showImage } = this.state;

    const showTitle = () => (
      <h2 className={classes.title}>
        {title}
        {toArray(urls).map(({ title, icon, url }) => (
          <a id={title} href={url} title={title} target="_blank" rel="noopener noreferrer">
            {icon()}
          </a>
        ))}
        {(
          () => {
            if (showImage) {
              return (
                <span
                  title="show chart"
                  style={{ cursor: 'pointer' }}
                  onClick={() => this.setState({ showImage: null })}
                >
                  <ChartIcon />
                </span>
              );
            }
            return (
              <span
                title="show image for copy"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  const chart = this.chartRef.current.chartInstance;
                  const data = chart.toBase64Image();
                  this.setState({ showImage: data });
                }}
              >
                <ImageIcon />
              </span>
            );
          }
        )()}
      </h2>
    );

    if (isLoading) {
      return (
        <div className={classes.chartContainer}>
          {showTitle({ classes, title, urls })}

          <div
            style={{
              position: 'relative',
              height: chartHeight,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '50%',
                right: '50%',
              }}
            >
              <CircularProgress />
            </div>
          </div>
        </div>
      );
    }

    if (!standardOptions) {
      return (
        <div className={classes.chartContainer}>
          {showTitle({ classes, title, urls })}
          <div style={{ height: chartHeight }} />
        </div>
      );
    }

    if (!standardOptions.data.length) {
      return (
        <div className={classes.chartContainer}>
          {showTitle({ classes, title, urls })}
          <div
            style={{
              position: 'relative',
              height: chartHeight,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '50%',
                right: '50%',
              }}
            >
              No Data
            </div>
          </div>
        </div>
      );
    }

    const currentDate = coalesce(
      Data.get(Data.fromConfig(standardOptions), 'axis.x.max'),
      Date.eod(),
    );
    const allOldData = cjsOptions.data.datasets.every(dataset => {
      const latestDataDate = Date.newInstance(
        selectFrom(dataset.data)
          .select('x')
          .max(),
      );
      const timeDifference = Math.abs(
        currentDate.getTime() - latestDataDate.getTime(),
      );
      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

      return daysDifference > missingDataInterval;
    });

    if (allOldData) {
      const error = new Error(
        `This item has been missing data for at least ${missingDataInterval} days.`,
      );

      return (
        <div className={classes.chartContainer} ref={this.chartRef}>
          <ErrorMessage error={error}>
            {showTitle({ classes, title, urls })}
            <ToolTipChart
              height={chartHeight}
              standardOptions={standardOptions}
              {...cjsOptions}
            />
          </ErrorMessage>
        </div>
      );
    }

    // Log.note(value2json(cjsOptions));

    return (
      <div className={classes.chartContainer}>
        {showTitle({ classes, title, urls })}
        <div style={{ position: 'relative' }}>
          <Notes chartRef={this.chartRef} notes={notes} />
          <ToolTipChart
            height={chartHeight}
            standardOptions={standardOptions}
            chartRef={this.chartRef}
            {...cjsOptions}
          />
          {showImage && (
          <img
            style={{
              position: 'absolute',
              borderColor: 'grey',
              borderStyle: 'dashed',
              borderWidth: '0.25rem',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
            src={showImage}
            alt="chart for copy"
          />
          )}
        </div>
      </div>
    );
  }
}

// The properties are to match ChartJs properties
ChartJsWrapper.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  isLoading: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  chartHeight: PropTypes.number,
  spinnerSize: PropTypes.string,
  standardOptions: PropTypes.shape({
    reverse: PropTypes.bool,
    'axis.y.label': PropTypes.string,
    title: PropTypes.string,
    ticksCallback: PropTypes.func,
    data: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  missingDataInterval: PropTypes.number,
  notes: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }),
  ),
};

ChartJsWrapper.defaultProps = {
  title: '',
  chartHeight: 80,
  spinnerSize: '100%',
  isLoading: false,
  missingDataInterval: 3,
};


export default withStyles(styles)(ChartJsWrapper);
