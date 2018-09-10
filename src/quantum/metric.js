/* global fetch */
import React from 'react';
import PropTypes from 'prop-types';
import { parse } from 'query-string';
import ChannelMetric from './channel-metric';
import { architecture } from './constants';

const QuantumTracking = ({ match, location }) => {
  const { metric, child } = parse(location.search);
  const params = {
    architecture: architecture[match.params.architecture],
    metric,
    os: 'Windows_NT',
    e10sEnabled: true,
  };
  const subtitle = [];
  if (child) {
    params.child = child;
    subtitle.push('For', child);
  }
  return (
    !metric ?
      <div>
        <p className="align-center">A metric query string is required</p>
      </div> :
      <ChannelMetric
        title={metric}
        subtitle={subtitle.join(' ')}
        query={params}
      />
  );
};

QuantumTracking.propTypes = {
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default QuantumTracking;
