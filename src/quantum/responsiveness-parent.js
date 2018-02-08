/* global fetch */
import React from 'react';
import ChannelMetric from './channel-metric';

export default class QuantumResponsivenessParent extends React.Component {

  render() {
    return (
      <ChannelMetric
        title='Parent Process Responsiveness'
        subtitle='Input Response Latency'
        unit='ms'
        query={{
          metric: 'INPUT_EVENT_RESPONSE_MS',
          child: 'parent',
          os: 'Windows_NT',
          e10sEnabled: true,
        }}
      />
    );
  }
}
