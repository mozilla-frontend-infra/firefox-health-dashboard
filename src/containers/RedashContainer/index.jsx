import React, { Component } from 'react';
import Chart from 'react-chartjs-2';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Lock } from '@material-ui/icons';
import fetchJson from '../../utils/fetchJson';
import { COLORS } from '../../settings';

const chartJsOptions = ({
  title,
  scaleLabel = 'Miliseconds',
  reverse = false,
 }) => {
  const options = {
    scales: {
      xAxes: [
        {
          type: 'time',
          time: {
            displayFormats: {
              hour: 'MMM D',
            },
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            reverse,
          },
        },
      ],
    },
  };
  if (title) {
    options.title = {
      display: true,
      text: title,
    };
  }
  if (scaleLabel) {
    options.scales.yAxes[0].scaleLabel = {
      display: true,
      labelString: scaleLabel,
    };
  }
  return options;
};

const sortByDate = (a, b) => {
  return new Date(b.submission_date) - new Date(a.submission_date);
};

const dataToChartJSformat = data => data.map(({ submission_date, value }) => ({
    x: submission_date,
    y: value,
  }));

const telemetryDataToDatasets = (data, dataKeyIdentifier) => {
  const queryResulset = data.query_result;
  // Separate data points into buckets
  const buckets = queryResulset.data.rows.reduce((result, datum) => {
    const key = datum[dataKeyIdentifier];
    if (!key) {
      // XXX: Make it a custom error, catch it and display a UI message
      throw new Error('Check the Redash data and determine what is the key used to categorize the data.');
    }
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(datum);
    return result;
  }, {});
  const datasets = Object.keys(buckets).map((key, index) => {
    const datum = buckets[key];
    return {
      label: key,
      backgroundColor: COLORS[index],
      borderColor: COLORS[index],
      fill: false,
      pointRadius: '0',
      pointHoverBackgroundColor: 'white',
      data: dataToChartJSformat(datum.sort(sortByDate)),
    };
  });
  return { datasets };
};

const styles = {
  chartContainer: {
    width: '45vw',
    minWidth: '400px',
  },
  linkContainer: {
    fontSize: '0.8rem',
    textAlign: 'center',
  },
  middleVerticalAlignment: {
    verticalAlign: 'middle',
  },
};

class RedashContainer extends Component {
  state = {
    datasets: null,
  };

  static propTypes = {
    classes: PropTypes.shape().isRequired,
    dataKeyIdentifier: PropTypes.string.isRequired,
    redashDataUrl: PropTypes.string.isRequired,
    redashQueryUrl: PropTypes.string.isRequired,
    chartOptions: PropTypes.shape({
      title: PropTypes.string.isRequired,
      scaleLabel: PropTypes.string,
    }).isRequired,
  };

  static defaultProps = {
    dataKeyIdentifier: 'label',
  };

  async componentDidMount() {
    this.fetchSetState(this.props);
  }

  async fetchSetState({ dataKeyIdentifier, redashDataUrl, chartOptions }) {
    const redashData = await fetchJson(redashDataUrl);
    this.setState({
      datasets: telemetryDataToDatasets(redashData, dataKeyIdentifier),
      options: chartJsOptions(chartOptions),
    });
  }

  render() {
    const { classes, redashQueryUrl } = this.props;
    const { datasets, options } = this.state;
    return (
      <div>
        {/*
        This div helps with canvas size changes
        https://www.chartjs.org/docs/latest/general/responsive.html#important-note
        */}
        <div className={classes.chartContainer}>
          {datasets && (
            <Chart
              type='line'
              data={datasets}
              options={options}
            />
          )}
        </div>
        <div className={classes.linkContainer}>
          <a href={redashQueryUrl} target='_blank' rel='noopener noreferrer'>
            <span className={classes.middleVerticalAlignment}>Redash query</span>
            <Lock className={classes.middleVerticalAlignment} />
          </a>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(RedashContainer);
