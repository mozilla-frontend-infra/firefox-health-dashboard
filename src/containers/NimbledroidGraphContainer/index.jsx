import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withErrorBoundary from '../../hocs/withErrorBoundary';
import ChartJsWrapper from '../../components/ChartJsWrapper';
import generateOptions from '../../utils/chartJs/generateOptions';
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
    const { configuration, handleError, scenarioName } = this.props;
    try {
      const nimbledroidData = await fetchNimbledroidData(configuration.products);
      const data = this.generateData(nimbledroidData.scenarios[scenarioName]);
      this.setState(data);
    } catch (error) {
      handleError(error);
    }
  }

  generateData(scenarioData) {
    return {
        data: nimbledroidFormatter(scenarioData),
        options: generateOptions({ scaleLabel: 'Seconds' }),
    };
  }

  render() {
    const { scenarioName } = this.props;
    const { data, options } = this.state;

    return data ? (
      <ChartJsWrapper
        data={data}
        options={options}
        title={scenarioName}
      />
    ) : <div />;
  }
}

NimbledroidGraphContainer.propTypes = ({
    configuration: PropTypes.shape({
        products: PropTypes.arrayOf(PropTypes.string),
      }).isRequired,
    handleError: PropTypes.func.isRequired,
    scenarioData: PropTypes.shape({}),
    scenarioName: PropTypes.string.isRequired,
});

export default withErrorBoundary(NimbledroidGraphContainer);
