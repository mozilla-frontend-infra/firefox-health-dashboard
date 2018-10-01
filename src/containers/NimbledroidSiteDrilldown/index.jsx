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
    const { nimbledroidData, site, targetRatio } = this.props;
    if (nimbledroidData) {
      this.setSiteData(nimbledroidData[site], targetRatio);
    } else {
      try {
        const data = await fetchNimbledroidData(this.props.products);
        this.setSiteData(data[site], targetRatio);
      } catch (error) {
        // eslint-disable-next-line react/prop-types
        this.props.handleError(error);
      }
    }
  }

  setSiteData(profile, targetRatio) {
    const { GV, WV } = profile;
    this.setState({
      profile,
      ...siteMetrics(GV, WV, targetRatio),
    });
  }

  render() {
    const { site, targetRatio } = this.props;
    if (!this.state.profile) {
      return null;
    }

    return (
      <StatusWidget
        extraInfo={this.state.widgetLabel}
        statusColor={this.state.color}
        title={{
          enrich: true,
          text: site,
          hyperlink: site,
        }}
      >
        <NimbledroidGraph
          profile={this.state.profile}
          targetRatio={targetRatio}
        />
      </StatusWidget>
    );
  }
}

SiteDrillDown.propTypes = ({
  nimbledroidData: PropTypes.shape({}),
  products: PropTypes.arrayOf(PropTypes.string),
  site: PropTypes.string.isRequired,
  targetRatio: PropTypes.number.isRequired,
});

export default withErrorBoundary(SiteDrillDown);
