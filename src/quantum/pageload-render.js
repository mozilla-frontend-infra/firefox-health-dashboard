/* global fetch */
import React from 'react';
import ChannelMetric from './channel-metric';

export default class QuantumPageLoadRender extends React.Component {
  render() {
    return (
      <ChannelMetric
        title="Page Load"
        subtitle="Time to First non-blank Paint (ms)"
        unit=""
        query={{
          metric: 'TIME_TO_NON_BLANK_PAINT_NO_NETOPT_MS',
          child: 'content',
          os: 'Windows_NT',
          e10sEnabled: true,
        }}
        format=".2s"
      />
    );
  }
}
