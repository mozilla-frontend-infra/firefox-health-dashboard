import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CONFIG } from './config';
import { withErrorBoundary } from '../vendor/errors';
import ChartJsWrapper from '../vendor/components/chartJs/ChartJsWrapper';
import fetchNimbledroidData from './NimbledroidApiHandler';
import { selectFrom, toPairs } from '../vendor/vectors';
import { GMTDate as Date } from '../vendor/dates';

const SINCE = Date.newInstance('today-13week').milli();
const nimbledroidFormatter = sourceData => {
  const data = toPairs(sourceData.data)
    .map((details, packageId) => {
      const label = CONFIG.packageIdLabels[packageId];

      return selectFrom(details)
        .filter(({ date }) => date > SINCE)
        .map(({ date, value }) => ({ date, [label]: value }));
    })
    .flatten()
    .toArray();

  return {
    'axis.y.label': 'Seconds',
    series: toPairs(sourceData.data)
      .map((_, packageId) => {
        const label = CONFIG.packageIdLabels[packageId];

        return {
          label,
          select: { value: label },
        };
      })
      .append({
        label: 'Run Date',
        select: { value: 'date', axis: 'x' },
      })
      .toArray(),
    data,
  };
};

class NimbledroidGraphContainer extends Component {
  state = {
    standardOptions: null,
  };

  constructor(props) {
    super(props);
    const { scenarioData } = this.props;

    if (scenarioData) {
      this.state = { standardOptions: nimbledroidFormatter(scenarioData) };
    }
  }

  async componentDidMount() {
    const { configuration, scenarioName } = this.props;
    const nimbledroidData = await fetchNimbledroidData(configuration.products);

    this.setState({
      standardOptions: nimbledroidFormatter(
        nimbledroidData.scenarios[scenarioName],
      ),
    });
  }

  render() {
    const { scenarioName } = this.props;
    const { standardOptions } = this.state;

    return (
      <ChartJsWrapper
        standardOptions={standardOptions}
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
