import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Lock } from '@material-ui/icons';
import ChartJsWrapper from '../../components/ChartJsWrapper';
import generateOptions from '../../utils/chartJs/generateOptions';
import fetchJson from '../../utils/fetchJson';
import SETTINGS from '../../settings';

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
      backgroundColor: SETTINGS.colors[index],
      borderColor: SETTINGS.colors[index],
      fill: false,
      pointRadius: '0',
      pointHoverBackgroundColor: 'white',
      data: dataToChartJSformat(datum.sort(sortByDate)),
    };
  });
  return { datasets };
};

const styles = {
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
      options: generateOptions(chartOptions),
    });
  }

  render() {
    const { classes, redashQueryUrl } = this.props;
    const { datasets, options } = this.state;
    return (
      <div>
        {datasets && (
          <ChartJsWrapper
            type='line'
            data={datasets}
            options={options}
          />
        )}
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
