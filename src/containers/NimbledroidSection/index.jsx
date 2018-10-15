import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetchNimbledroidData from '../../utils/nimbledroid/fetchNimbledroidData';
import NimbledroidProductVersions from '../NimbledroidProductVersions';
import NimbledroidSummaryTable from '../NimbledroidSummaryTable';
import withErrorBoundary from '../../hocs/withErrorBoundary';

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
    const { configuration, handleError } = this.props;
    try {
      const nimbledroidData = await fetchNimbledroidData(configuration.products);
      this.setState({ nimbledroidData });
    } catch (error) {
      handleError(error);
    }
  }

  render() {
    const { configuration } = this.props;
    const { nimbledroidData } = this.state;
    return nimbledroidData ? (
      <div>
        <NimbledroidProductVersions
          nimbledroidData={nimbledroidData}
          products={configuration.products}
        />
        <NimbledroidSummaryTable
          nimbledroidData={nimbledroidData}
          configuration={configuration}
        />
      </div>
    ) : <div />;
  }
}

NimbledroidSection.propTypes = ({
  handleError: PropTypes.func.isRequired,
  nimbledroidData: PropTypes.shape({}),
  configuration: PropTypes.shape({
    baseProduct: PropTypes.string.isRequired,
    compareProduct: PropTypes.string.isRequired,
    products: PropTypes.arrayOf(PropTypes.string).isRequired,
    targetRatio: PropTypes.number.isRequired,
  }).isRequired,
});

export default withErrorBoundary(NimbledroidSection);
