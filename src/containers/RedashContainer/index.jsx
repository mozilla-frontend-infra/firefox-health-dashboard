import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ChartJsWrapper from '../../vendor/chartJs/ChartJsWrapper';
import { fetchJson } from '../../vendor/requests';
import { withErrorBoundary } from '../../vendor/errors';
import { Log } from '../../vendor/logs';
import { selectFrom } from '../../vendor/vectors';

/* eslint-disable camelcase */

const telemetryDataToDatasets = (data, dataKeyIdentifier) => {
  const queryResulset = data.query_result;
  // Separate data points into buckets
  const datasets = selectFrom(queryResulset.data.rows)
    .map(datum => {
      const key = datum[dataKeyIdentifier];

      if (!key) {
        Log.error(
          'Check the Redash data and determine what is the key used to categorize the data.'
        );
      }

      return { datum, key };
    })
    .groupBy('key')
    .map((datum, key) => ({
      label: key,
      data: selectFrom(datum)
        .sortBy('submission_date')
        .select({ x: 'submission_date', y: 'value' }),
    }));

  return { datasets };
};

const styles = {
  title: {
    color: '#56565a',
    fontSize: '1rem',
    backgroundColor: '#d1d2d3',
    padding: '.4rem .3rem .3rem .3rem',
    margin: '0 1rem 0 0',
  },
  linkContainer: {
    fontSize: '0.8rem',
  },
};

class RedashContainer extends Component {
  state = {
    datasets: null,
    isLoading: false,
  };

  static propTypes = {
    options: PropTypes.shape({
      title: PropTypes.string,
      'axis.y.label': PropTypes.string,
      ticksCallback: PropTypes.func,
    }),
    classes: PropTypes.shape().isRequired,
    dataKeyIdentifier: PropTypes.string.isRequired,
    redashDataUrl: PropTypes.string.isRequired,
    redashQueryUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  };

  static defaultProps = {
    options: {
      'axis.y.label': 'Miliseconds',
      ticksCallback: value => (value > 999 ? `${value / 1000}k` : value),
    },
    dataKeyIdentifier: 'label',
  };

  async componentDidMount() {
    await this.fetchSetState(this.props);
  }

  async fetchSetState({ dataKeyIdentifier, redashDataUrl }) {
    try {
      this.setState({ isLoading: true });
      const redashData = await fetchJson(redashDataUrl);

      this.setState({
        datasets: telemetryDataToDatasets(redashData, dataKeyIdentifier),
      });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { classes, options, redashQueryUrl, title } = this.props;
    const { datasets, isLoading } = this.state;

    return (
      <div>
        <ChartJsWrapper
          title={title}
          type="line"
          data={datasets}
          isLoading={isLoading}
          options={options}
        />
        <div className={classes.linkContainer}>
          <a
            href={redashQueryUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="go to Redash query">
            <span
              style={{
                verticalAlign: 'middle',
              }}>
              Show Redash query
            </span>
          </a>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(withErrorBoundary(RedashContainer));
