import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Lock } from '@material-ui/icons';
import ChartJsWrapper from '../../components/ChartJsWrapper';
import telemetryDataToDatasets from '../../utils/chartJs/redashFormatter';
import fetchJson from '../../utils/fetchJson';

const styles = {
  linkContainer: {
    fontSize: '0.8rem',
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
    options: PropTypes.shape({
      title: PropTypes.string,
      scaleLabel: PropTypes.string,
      tooltipFormat: PropTypes.bool,
      tooltips: PropTypes.shape({
        callbacks: PropTypes.object,
      }),
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
      scaleLabel: 'Miliseconds',
      tooltipFormat: true,
      tooltips: {
        callbacks: {
          label: (tooltipItems, data) =>
            `${data.datasets[tooltipItems.datasetIndex].label}: ${
              tooltipItems.yLabel
            } ms`,
        },
      },
      ticksCallback: value => (value > 999 ? `${value / 1000}k` : value),
    },
    dataKeyIdentifier: 'label',
  };

  async componentDidMount() {
    this.fetchSetState(this.props);
  }

  async fetchSetState({ dataKeyIdentifier, redashDataUrl }) {
    const redashData = await fetchJson(redashDataUrl);

    this.setState({
      datasets: telemetryDataToDatasets(redashData, dataKeyIdentifier),
    });
  }

  render() {
    const { classes, options, redashQueryUrl, title } = this.props;
    const { datasets } = this.state;

    return (
      <div>
        <ChartJsWrapper
          title={title}
          type="line"
          data={datasets}
          options={options}
        />
        <div className={classes.linkContainer}>
          <a href={redashQueryUrl} target="_blank" rel="noopener noreferrer">
            <span className={classes.middleVerticalAlignment}>
              Redash query
            </span>
            <Lock
              className={classes.middleVerticalAlignment}
              style={{ height: '1rem' }}
            />
          </a>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(RedashContainer);
