import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withErrorBoundary } from '../vendor/errors';
import NimbledroidGraph from './NimbledroidGraph';
import StatusWidget from './StatusWidget';
import { siteMetrics } from './config';
import fetchNimbledroidData from './NimbledroidApiHandler';

class NimbledroidSiteDrilldown extends Component {
  state = {
    profile: null,
  };

  constructor(props) {
    super(props);
    const { configuration, nimbledroidData } = this.props;

    if (nimbledroidData) {
      this.state = this.generateData(configuration, nimbledroidData);
    }
  }

  async componentDidMount() {
    const { configuration } = this.props;
    const nimbledroidData = await fetchNimbledroidData(configuration.products);
    const data = this.generateData(configuration, nimbledroidData);

    this.setState(data);
  }

  generateData(configuration, nimbledroidData) {
    const {
      baseProduct, compareProduct, targetRatio, site,
    } = configuration;
    const { scenarios } = nimbledroidData;
    const profile = scenarios[site];
    const generatedData = {
      profile,
      ...siteMetrics(
        profile[baseProduct],
        profile[compareProduct],
        targetRatio,
      ),
    };

    return generatedData;
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
        <NimbledroidGraph profile={profile} targetRatio={targetRatio} />
      </StatusWidget>
    );
  }
}

NimbledroidSiteDrilldown.propTypes = {
  nimbledroidData: PropTypes.shape({}),
  configuration: PropTypes.shape({
    baseProduct: PropTypes.string.isRequired,
    compareProduct: PropTypes.string.isRequired,
    products: PropTypes.arrayOf(PropTypes.string),
    site: PropTypes.string.isRequired,
    targetRatio: PropTypes.number.isRequired,
  }).isRequired,
};

export default withErrorBoundary(NimbledroidSiteDrilldown);
