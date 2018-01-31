/* global fetch */
import React from 'react';
import ChannelMetric from './channel-metric';

export default class QuantumResponsivenessContent extends React.Component {

  render() {
    return (
      <ChannelMetric
        title='Responsiveness'
        subtitle='Content Input Response Latency (ms)'
        unit='ms'
        query={{
          metric: 'INPUT_EVENT_RESPONSE_MS',
          child: 'content',
          os: 'Windows_NT',
          e10sEnabled: true,
        }}
      />
    );
  }
}
