import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Lock } from '@material-ui/icons';
import ChartJsWrapper from '../../components/ChartJsWrapper';
import generateOptions from '../../utils/chartJs/generateOptions';
import telemetryDataToDatasets from '../../utils/chartJs/redashFormatter';
import fetchJson from '../../utils/fetchJson';

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
