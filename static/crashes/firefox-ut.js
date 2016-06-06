/* global fetch */
import 'babel-polyfill';
import React from 'react';
import MG from 'metrics-graphics';
import moment from 'moment';
import Graphic from '../graphic';

export default class FirefoxUtCrashes extends React.Component {
  state = {
    data: null,
    markers: null,
  };

  componentDidMount() {
    this.fetch();
  }

  async fetch() {
    const crashes = await (await fetch('/api/crashes')).json();
    const data = MG.convert.date(crashes, 'date');
    const releases = await (await fetch('/api/release/history?tailVersion=5')).json();
    const markers = releases.map((entry) => {
      return {
        date: new Date(entry.date),
        label: entry.version.full,
      };
    });
    markers.push({
      date: new Date('2016-04-01'),
      label: 'Aggregate Start',
    });
    this.setState({ data, markers });
  }

  render() {
    return (
      <Graphic
        {...this.state}
        x_accessor='date'
        y_accessor='combined_crash_rate'
        min_y='3'
        max_y='4.5'
        min_x={moment().subtract(130, 'days').toDate()}
        max_x={moment().subtract(1, 'days').toDate()}
        title='Firefox - Crashes per 1000 Usage Hours'
      />
    );
  }
}
