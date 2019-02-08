import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withErrorBoundary from '../../hocs/withErrorBoundary';
import NimbledroidGraph from '../../components/NimbledroidGraph';
import StatusWidget from '../../components/StatusWidget';
import { siteMetrics } from '../../utils/nimbledroid';
import { zipObject } from '../../utils/queryOps';
import fetchNimbledroidData from '../../utils/nimbledroid/fetchNimbledroidData';

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
    const { configuration, handleError } = this.props;

    try {
      const nimbledroidData = await fetchNimbledroidData(
        configuration.products
      );
      const data = this.generateData(configuration, nimbledroidData);

      this.setState(data);
    } catch (error) {
      handleError(error);
    }
  }

  generateData(configuration, nimbledroidData) {
    const { baseProduct, compareProduct, targetRatio, site } = configuration;
    const defaults = zipObject(
      [baseProduct, compareProduct],
      [{ data: [] }, { data: [] }]
    );
    const profile = {
      ...defaults,
      ...nimbledroidData.where({ url: site }).index('packageId'),
    };

    return {
      profile,
      ...siteMetrics(
        profile[baseProduct].lastDataPoint,
        profile[compareProduct].lastDataPoint,
        targetRatio
      ),
    };
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
        }}>
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
