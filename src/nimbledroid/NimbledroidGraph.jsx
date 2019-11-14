import React, { Component, lazy, Suspense } from 'react';
import { curveLinear } from 'd3';
import PropTypes from 'prop-types';
import { CONFIG } from './config';
import 'metrics-graphics/dist/metricsgraphics.css';

const MetricsGraphics = lazy(() => import(/* webpackChunkName: "react-metrics-graphics" */ 'react-metrics-graphics'));

class NimbledroidGraph extends Component {
  render() {
    const { profile, targetRatio } = this.props;
    const labels = CONFIG.products.map(
      productID => CONFIG.packageIdLabels[productID],
    );
    const data = CONFIG.products.map(
      productID => profile.data[productID] || [],
    );
    const target = targetRatio * profile[CONFIG.compareProduct];

    return (
      <Suspense fallback="">
        <MetricsGraphics
          full_width
          height={600}
          data={data}
          x_accessor="date"
          y_accessor="value"
          legend={labels}
          legend_target={this.legendTarget}
          aggregate_rollover
          interpolate={curveLinear}
          right={100}
          baselines={[
            {
              value: target,
              label: 'Target',
            },
          ]}
        />
      </Suspense>
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
