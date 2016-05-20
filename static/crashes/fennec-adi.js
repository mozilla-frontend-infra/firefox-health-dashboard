/* global fetch */
import 'babel-polyfill';
import React from 'react';
import MG from 'metrics-graphics';
import Graphic from '../graphic';

export default class FennecAdiCrashes extends React.Component {
  state = {
    data: null,
    markers: null,
    baselines: null
  };

  async componentDidMount() {
    const crashes = await (await fetch('/api/crashes/adi?product=fennec')).json();
    const data = MG.convert.date(crashes, 'date');
    const releases = await (await fetch('/api/release/history?product=fennec')).json();
    const markers = releases.map((entry) => {
      return {
        date: new Date(entry.date),
        label: entry.version
      };
    });
    markers.push({
      date: new Date('2016-01-17'),
      label: 'Baseline'
    });
    const baselines = [
      { value: 1.91, label: '1.91' },
      { value: 1.26, label: '1.26' }
    ];
    this.setState({
      data, markers, baselines
    });
  }

  render() {
    return (
      <Graphic
        {...this.state}
        x_accessor='date'
        y_accessor='combined_crash_rate'
        min_y='1'
        max_y='2'
        title='Fennec - Crashes per 100 ADI'
      />
    );
  }
};
