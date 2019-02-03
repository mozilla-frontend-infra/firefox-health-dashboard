import React, { Component } from 'react';
import { curveLinear } from 'd3';
import PropTypes from 'prop-types';
import MetricsGraphics from 'react-metrics-graphics';

class NimbledroidGraph extends Component {
  render() {
    const { profile, targetRatio } = this.props;
    profile.WV = profile['com.chrome.beta']; // temporary until other PRs get merged
    const labels = Object.keys(profile.data);
    const data = labels.map(product => profile.data[product]);
    const target = targetRatio * profile.WV;

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
