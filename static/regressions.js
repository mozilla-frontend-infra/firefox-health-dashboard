/* global fetch */

import 'babel-polyfill';
import React from 'react';
import MG from 'metrics-graphics';

export default class Regressions extends React.Component {
  async componentDidMount() {
    const regressions = await (await fetch('/api/bz/regressions/missed')).json();
    const legend = regressions.map((entry) => entry.count);
    console.log(legend);
    MG.data_graphic({
      title: 'Number of Unevaluated Regressions Shipped',
      data: regressions,
      legend: legend,
      chart_type: 'bar',
      width: 500,
      height: 300,
      target: '#graph',
      x_accessor: 'count',
      y_accessor: 'version'
    });
  }

  render() {
    return (
      <div id='graph'></div>
    );
  }
}
