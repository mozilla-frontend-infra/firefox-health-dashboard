/* global fetch */
import 'babel-polyfill';
import React from 'react';
import MG from 'metrics-graphics';
import Graphic from '../graphic';

export default class FirefoxAdiCrashes extends React.Component {
  state = {
    data: null,
    markers: null,
    baselines: null
  };

  async componentDidMount() {
    const crashes = await (await fetch('/api/crashes/adi')).json();
    const data = MG.convert.date(crashes, 'date');
    const releases = await (await fetch('/api/release/history')).json();
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
      { value: 1.08, label: '1.08' },
      { value: 0.75, label: '0.75' }
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
        min_y='0.7'
        max_y='1.5'
        title='Firefox - Crashes per 100 ADI'
      />
    );
  }
};
