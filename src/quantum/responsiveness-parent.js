/* global fetch */
import React from 'react';
import PropTypes from 'prop-types';
import ChannelMetric from './channel-metric';
import { architecture } from './constants';

const QuantumResponsivenessParent = ({ match }) => (
  <ChannelMetric
    title='Parent Process Responsiveness'
    subtitle='Input Response Latency'
    unit='ms'
    query={{
      metric: 'INPUT_EVENT_RESPONSE_MS',
      child: 'parent',
      os: 'Windows_NT',
      e10sEnabled: true,
      architecture: architecture[match.params.architecture],
    }}
  />
);

QuantumResponsivenessParent.propTypes = {
  match: PropTypes.object.isRequired,
};

export default QuantumResponsivenessParent;
