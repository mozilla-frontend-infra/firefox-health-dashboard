/* global fetch */

import 'babel-polyfill';
import React from 'react';
import MG from 'metrics-graphics';

export default class XpCrashes extends React.Component {
  async componentDidMount() {
    const crashes = await (await fetch('/api/crashes/xp')).json();
    crashes[0] = MG.convert.date(crashes[0], 'date');
    crashes[1] = MG.convert.date(crashes[1], 'date');
    crashes[2] = MG.convert.date(crashes[2], 'date');
    MG.data_graphic({
      title: 'Usage Hour Crash Rate XP-only vs Non-XP',
      data: crashes,
      chart_type: 'line',
      target: '#graph',
      x_accessor: 'date',
      y_accessor: 'rate',
    });
  }

  render() {
    return (
      <div id='graph'></div>
    );
  }
}
