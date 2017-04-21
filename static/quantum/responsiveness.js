/* global fetch */
import 'babel-polyfill';
import React from 'react';
import ChannelMetric from './channel-metric';

export default class QuantumResponsivenessParent extends React.Component {

  render() {
    return (
      <ChannelMetric
        title='Responsiveness'
        subtitle='Main Process Input Latency'
        query='metric=INPUT_EVENT_RESPONSE_MS&child=parent&os=Windows_NT&e10sEnabled=true'
      />
    );
  }
}

QuantumResponsivenessParent.defaultProps = {
};
QuantumResponsivenessParent.propTypes = {
};
