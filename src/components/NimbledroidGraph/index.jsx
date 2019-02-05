import React, { Component } from 'react';
import { curveLinear } from 'd3';
import PropTypes from 'prop-types';
import MetricsGraphics from 'react-metrics-graphics';
import CONFIG from '../../utils/nimbledroid/config';


class NimbledroidGraph extends Component {
  render() {
    const { profile, targetRatio } = this.props;
    const labels = CONFIG.products.map(productID => CONFIG.packageIdLabels[productID]);
    const data = CONFIG.products.map(productID => profile.data[productID]);
    const target = targetRatio * profile[CONFIG.compareProduct];

    return (
      <MetricsGraphics
        full_width
        height={600}
        data={data}
        x_accessor='date'
        y_accessor='value'
        legend={labels}
        legend_target={this.legendTarget}
        aggregate_rollover
        interpolate={curveLinear}
        right={100}
        baselines={[{
          value: target,
          label: 'Target',
        }]}
      />
    );
  }
}

NimbledroidGraph.propTypes = {
  profile: PropTypes.shape({
    title: PropTypes.string.isRequired,
    data: PropTypes.shape({}).isRequired,
  }),
  targetRatio: PropTypes.number.isRequired,
};

export default NimbledroidGraph;
