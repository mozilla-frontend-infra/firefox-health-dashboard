/* global fetch */
import React from 'react';
import PropTypes from 'prop-types';
import ChannelMetric from './channel-metric';

export default class QuantumTracking extends React.Component {

  render() {
    const { metric, child } = this.props.location.query;
    const params = {
      metric: metric,
      os: 'Windows_NT',
      e10sEnabled: true,
    };
    const subtitle = [];
    if (child) {
      params.child = child;
      subtitle.push('For', child);
    }
    return (
      <ChannelMetric
        title={metric}
        subtitle={subtitle.join(' ')}
        query={params}
      />
    );
  }
}

QuantumTracking.propTypes = {
  location: PropTypes.object.isRequired,
};
