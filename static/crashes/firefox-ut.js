/* global fetch */
import 'babel-polyfill';
import React from 'react';
import MG from 'metrics-graphics';
import moment from 'moment';
import Graphic from '../graphic';
import Score from '../score';

export default class FirefoxUtCrashes extends React.Component {
  state = {
    data: null,
    markers: null,
    avg: 0,
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
        date: moment(entry.date, 'YYYY MM DD').toDate(),
        label: entry.version,
      };
    });
    markers.push({
      date: moment('2016-04-01', 'YYYY MM DD').toDate(),
      label: 'Aggregate Start',
    });
    const baselines = [3.41, 4.25];
    this.setState({ data, markers, baselines });
  }

  render() {
    return (
      <div className='row'>
        <header>
          <span>Firefox Crashes / 1000 hrs</span>
        </header>
        <Graphic
          {...this.state}
          x_accessor='date'
          y_accessor='rate'
          min_y='0'
          max_y='7'
          min_x={moment().subtract(160, 'days').toDate()}
          max_x={moment().subtract(1, 'days').toDate()}
          // title='Firefox - Crashes per 1000 Usage Hours'
        />
        <Score data={this.state.data} />
      </div>
    );
  }
}
