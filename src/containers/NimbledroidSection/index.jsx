import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetchNimbledroidData from '../../utils/nimbledroid/fetchNimbledroidData';
import NimbledroidGraphContainer from '../NimbledroidGraphContainer';
import NimbledroidProductVersions from '../NimbledroidProductVersions';
import NimbledroidSummaryTable from '../NimbledroidSummaryTable';
import { withErrorBoundary } from '../../vendor/errors';

class NimbledroidSection extends Component {
  state = {
    nimbledroidData: null,
  };

  constructor(props) {
    super(props);
    const { nimbledroidData } = this.props;

    if (nimbledroidData) {
      this.state = { nimbledroidData };
    }
  }

  async componentDidMount() {
    const { configuration } = this.props;

    try {
      const nimbledroidData = await fetchNimbledroidData(
        configuration.products
      );

      this.setState({ nimbledroidData });
    } catch (error) {
      this.setState({ error });
    }
  }

  render() {
    const { configuration } = this.props;
    const { nimbledroidData, error } = this.state;

    if (error) throw error;

    return nimbledroidData ? (
      <div>
        <NimbledroidProductVersions
          nimbledroidData={nimbledroidData}
          products={configuration.products}
        />
        <NimbledroidSummaryTable
          configuration={configuration}
          nimbledroidData={nimbledroidData}
        />
        <NimbledroidGraphContainer
          configuration={configuration}
          scenarioData={nimbledroidData.scenarios['Cold Startup']}
          scenarioName="Cold Startup"
        />
      </div>
    ) : (
      <div />
    );
  }
}

NimbledroidSection.propTypes = {
  nimbledroidData: PropTypes.shape({}),
  configuration: PropTypes.shape({
    baseProduct: PropTypes.string.isRequired,
    compareProduct: PropTypes.string.isRequired,
    products: PropTypes.arrayOf(PropTypes.string).isRequired,
    targetRatio: PropTypes.number.isRequired,
  }).isRequired,
};

export default withErrorBoundary(NimbledroidSection);
