/* global fetch */
import React from 'react';
import MetricsGraphics from 'react-metrics-graphics';
import moment from 'moment';
import PropTypes from 'prop-types';

import { stringify, parse } from 'query-string';
import { curveLinear } from 'd3';
import Widget from '../quantum/widget';
import SETTINGS from '../settings';
import { transformGraphData, determineStatusColor } from '../utils/helpers';

export default class GraphContainer extends React.Component {
  constructor(props) {
    super(props);
    this.legendTarget = null;
    this.state = {
      data: null,
      status: null,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const { query, api } = this.props;
    let url = `${SETTINGS.backend}/api/${api}`;

    if (query) {
      url += `/?${stringify(query)}`;
    }
    fetch(url).then(response => response.json()).then(data => this.parseData(data));
  }

  parseData(data) {
    const { checkStatus, keys, targetValue, targetLine } = this.props;
    const stateObj = { data: transformGraphData(keys, data) };
    if (checkStatus) {
      stateObj.status = determineStatusColor(data, targetLine, targetValue);
    }
    this.setState(stateObj);
  }

  render() {
    const { data, status } = this.state;
    const { title, link, legend, baselines, target, width, height, customClass } = this.props;
    let viewport = [0, 0];
    return (
      <Widget
        className={`graphic-timeline graphic-widget ${customClass}`}
        link={link}
        target={target}
        title={title}
        loading={!data}
        viewport={size => (viewport = size)}
        status={status}
      >
        <div>
          <div className='legend' ref={ele => this.legendTarget = ele} />
          {(data && !legend || data && this.legendTarget && legend) &&
          <MetricsGraphics
            width={width}
            height={height}
            data={data}
            x_accessor='date'
            y_accessor='value'
            interpolate={curveLinear}
            legend={legend}
            legend_target={this.legendTarget}
            baselines={baselines}
          />}
        </div>
      </Widget>
    );
  }
}

GraphContainer.propTypes = {
  link: PropTypes.string,
  title: PropTypes.string,
  target: PropTypes.string,
  baselines: PropTypes.array,
  specialClass: PropTypes.string,
  query: PropTypes.shape({}),
  keys: PropTypes.array,
  legend: PropTypes.array,
  api: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  checkStatus: PropTypes.bool,
  targetLine: PropTypes.string,
  targetValue: PropTypes.number,
  customClass: PropTypes.string,
};
