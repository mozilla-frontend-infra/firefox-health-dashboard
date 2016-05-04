/* global fetch */

import 'babel-polyfill';
import React from 'react';
import d3 from 'd3';
import _ from 'lodash';

export default class App extends React.Component {
  state = {
    uptime: {},
    crashes: {}
  };

  async componentDidMount() {
    const response = await fetch('/crashes');
    const {uptime, crashes} = await response.json();
    this.setState({uptime, crashes});
  }
  render() {
    const {uptime} = this.state;
    const xDomain = [Infinity, 0];
    const yDomain = [Infinity, 0];
    if (!Object.keys(uptime).length) {
      return (<div>Loading …</div>);
    }
    Object.keys(uptime).forEach((version) => {
      xDomain[0] = Math.min(xDomain[0], _.minBy(uptime[version], (d) => d.date).date);
      xDomain[1] = Math.max(xDomain[1], _.maxBy(uptime[version], (d) => d.date).date);
      yDomain[0] = Math.min(yDomain[0], _.minBy(uptime[version], (d) => d.stats).stats);
      yDomain[1] = Math.max(yDomain[1], _.maxBy(uptime[version], (d) => d.stats).stats);
    });
    console.log(xDomain, yDomain);

    const xScale = d3.scale.linear()
      .domain(xDomain)
      .range([0, window.innerWidth]);
    const yScale = d3.scale.linear()
      .domain(yDomain)
      .range([0, window.innerHeight]);

    const uptimePaths = Object.keys(uptime).map((version) => {
      const path = d3.svg.line()
        .x((d) => xScale(d.date))
        .y((d) => yScale(d.stats))
        .interpolate('linear');
      return (
        <path d={path(uptime[version])} stroke='1' fill='white' />
      );
    });
    return (
      <svg width={window.innerWidth} height={window.innerHeight}>
        {uptimePaths}
      </svg>
    );
  }
}
