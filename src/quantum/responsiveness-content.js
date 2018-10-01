/* global fetch */
import React from 'react';
import PropTypes from 'prop-types';
import ChannelMetric from './channel-metric';
import { architecture } from './constants';

const QuantumResponsivenessContent = ({ match }) => (
  <ChannelMetric
    title='Responsiveness'
    subtitle='Content Input Response Latency (ms)'
    unit='ms'
    query={{
      metric: 'INPUT_EVENT_RESPONSE_MS',
      child: 'content',
      os: 'Windows_NT',
      e10sEnabled: true,
      architecture: architecture[match.params.architecture],
    }}
  />
);

QuantumResponsivenessContent.propTypes = {
  match: PropTypes.object.isRequired,
};

export default QuantumResponsivenessContent;
