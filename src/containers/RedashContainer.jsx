/* eslint-disable camelcase */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ChartJsWrapper from '../vendor/components/chartJs/ChartJsWrapper';
import { fetchJson } from '../vendor/requests';
import { withErrorBoundary } from '../vendor/errors';
import { selectFrom } from '../vendor/vectors';
import { LinkIcon } from '../utils/icons';

const telemetryDataToDatasets = (sourceData, dataKeyIdentifier) => {
  // Separate data points into percentile buckets

  const series = selectFrom(sourceData.query_result.data.rows)
    .groupBy(dataKeyIdentifier)
    .map((_, label) => ({
      label,
      select: { value: label },
    }))
    .append({
      label: 'Submission Date',
      select: { value: 'submission_date', axis: 'x' },
    })
    .toArray();
  const data = selectFrom(sourceData.query_result.data.rows)
    .sort('submission_date')
    .map(r => {
      const { submission_date, value } = r;
      const label = r[dataKeyIdentifier];

      if (label) {
        return {
          submission_date,
          [label]: value,
        };
      }

      return null;
    })
    .exists()
    .toArray();

  return { series, data };
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
    data: null,
    isLoading: true,
  };

  async componentDidMount() {
    await this.fetchSetState(this.props);
  }

  async fetchSetState({ dataKeyIdentifier, redashDataUrl }) {
    this.setState({ isLoading: true });

    try {
      const redashData = await fetchJson(redashDataUrl);

      this.setState({
        standardOptions: telemetryDataToDatasets(redashData, dataKeyIdentifier),
      });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { redashQueryUrl, title } = this.props;

    return (
      <div>
        <ChartJsWrapper
          title={
            <div>
              {title}{' '}
              <a
                href={redashQueryUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="go to Redash query">
                <LinkIcon />
              </a>
            </div>
          }
          {...this.state}
        />
      </div>
    );
  }
}

RedashContainer.propTypes = {
  standardOptions: PropTypes.shape({
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

RedashContainer.defaultProps = {
  standardOptions: {
    'axis.y.label': 'Miliseconds',
    ticksCallback: value => (value > 999 ? `${value / 1000}k` : value),
  },
  dataKeyIdentifier: 'label',
};

export default withStyles(styles)(withErrorBoundary(RedashContainer));
