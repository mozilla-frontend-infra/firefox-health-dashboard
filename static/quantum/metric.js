/* global fetch */
import 'babel-polyfill';
import React from 'react';
import ChannelMetric from './channel-metric';

export default class QuantumTracking extends React.Component {

  render() {
    const metric = this.props.location.query.metric;
    console.log(metric);
    return (
      <ChannelMetric
        title={metric}
        subtitle=''
        unit='ms'
        query={`metric=${metric}&os=Windows_NT&e10sEnabled=true`}
        format='.2s'
      />
    );
  }
}

QuantumTracking.propTypes = {
  location: React.PropTypes.object.isRequired,
};
