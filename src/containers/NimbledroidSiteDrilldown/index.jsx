import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withErrorBoundary from '../../hocs/withErrorBoundary';
import NimbledroidGraph from '../../components/NimbledroidGraph';
import StatusWidget from '../../components/StatusWidget';
import { siteMetrics } from '../../utils/nimbledroid';
import fetchNimbledroidData from '../../utils/nimbledroid/fetchNimbledroidData';

class SiteDrillDown extends Component {
  state = {
    profile: null,
  };

  async componentDidMount() {
    const { handleError, nimbledroidData, configuration } = this.props;
    const { site, products } = configuration;

    try {
      const { scenarios } = nimbledroidData || await fetchNimbledroidData(products);
      this.setSiteData(scenarios[site], configuration);
    } catch (error) {
      handleError(error);
    }
  }

  setSiteData(profile, { baseProduct, compareProduct, targetRatio }) {
    this.setState({
      profile,
      ...siteMetrics(profile[baseProduct], profile[compareProduct], targetRatio),
    });
  }

  render() {
    const { color, profile, widgetLabel } = this.state;
    const { configuration } = this.props;
    const { site, targetRatio } = configuration;

    if (!profile) {
      return null;
    }

    return (
      <StatusWidget
        extraInfo={widgetLabel}
        statusColor={color}
        title={{
          enrich: true,
          text: site,
          hyperlink: site,
        }}
      >
        <NimbledroidGraph
          profile={profile}
          targetRatio={targetRatio}
        />
      </StatusWidget>
    );
  }
}

SiteDrillDown.propTypes = ({
  nimbledroidData: PropTypes.shape({}),
  configuration: PropTypes.shape({
    baseProduct: PropTypes.string.isRequired,
    compareProduct: PropTypes.string.isRequired,
    products: PropTypes.arrayOf(PropTypes.string),
    site: PropTypes.string.isRequired,
    targetRatio: PropTypes.number.isRequired,
  }).isRequired,
});

export default withErrorBoundary(SiteDrillDown);
