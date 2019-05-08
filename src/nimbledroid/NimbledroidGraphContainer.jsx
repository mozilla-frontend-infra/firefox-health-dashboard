import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CONFIG } from './config';
import { withErrorBoundary } from '../vendor/errors';
import ChartJsWrapper from '../vendor/chartJs/ChartJsWrapper';
import fetchNimbledroidData from './NimbledroidApiHandler';
import { selectFrom, toPairs } from '../vendor/vectors';
import Date from '../vendor/dates';

const SINCE = Date.newInstance('today-13week').milli();
const nimbledroidFormatter = ({ data }) => ({
  datasets: toPairs(data)
    .map((details, packageId) => ({
      data: selectFrom(details)
        .filter(({ date }) => date > SINCE)
        .select({ x: 'date', y: 'value' })
        .toArray(),
      label: CONFIG.packageIdLabels[packageId],
    }))
    .toArray(),
});

class NimbledroidGraphContainer extends Component {
  state = {
    data: null,
  };

  constructor(props) {
    super(props);
    const { scenarioData } = this.props;

    if (scenarioData) {
      this.state = this.generateData(scenarioData);
    }
  }

  async componentDidMount() {
    const { configuration, scenarioName } = this.props;
    const nimbledroidData = await fetchNimbledroidData(configuration.products);
    const data = this.generateData(nimbledroidData.scenarios[scenarioName]);

    this.setState(data);
  }

  generateData(scenarioData) {
    return { data: nimbledroidFormatter(scenarioData) };
  }

  render() {
    const { scenarioName } = this.props;
    const { data } = this.state;

    return (
      <ChartJsWrapper
        data={data}
        options={{ 'axis.y.label': 'Seconds' }}
        title={`${scenarioName} on Nexus 5`}
      />
    );
  }
}

NimbledroidGraphContainer.propTypes = {
  configuration: PropTypes.shape({
    products: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  scenarioData: PropTypes.shape({}),
  scenarioName: PropTypes.string.isRequired,
};

export default withErrorBoundary(NimbledroidGraphContainer);
