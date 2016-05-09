/* global fetch */

import 'babel-polyfill';
import React from 'react';
import MG from 'metrics-graphics';

export default class Regressions extends React.Component {
  async componentDidMount() {
    const regressions = await (await fetch('/api/bz/regressions')).json();
    MG.data_graphic({
      title: 'Regressions Fixed per Release',
      data: regressions,
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
