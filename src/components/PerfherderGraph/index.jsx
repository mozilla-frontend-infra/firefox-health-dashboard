import React from 'react';
import PropTypes from 'prop-types';
import ChartJsWrapper from '../ChartJsWrapper';

const PerfherderGraph = ({ data, options }) => (
  <ChartJsWrapper
    type='line'
    data={data}
    options={options}
  />
);

PerfherderGraph.propTypes = {
    data: PropTypes.shape({}).isRequired,
    options: PropTypes.shape({}).isRequired,
};

export default PerfherderGraph;
