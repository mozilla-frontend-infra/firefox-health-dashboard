import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withErrorBoundary } from '../../vendor/errors';
import ChartJsWrapper from '../../components/ChartJsWrapper';
import nimbledroidFormatter from '../../utils/chartJs/nimbledroidFormatter';
import fetchNimbledroidData from '../../utils/nimbledroid/fetchNimbledroidData';

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
        options={{ scaleLabel: 'Seconds' }}
        title={scenarioName}
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
