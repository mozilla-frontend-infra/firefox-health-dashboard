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
    const baseline = '2016-01-17';
    const min_x = moment(baseline, 'YYYY MM DD').subtract(3, 'days').toDate();
    this.setState({ data, markers, min_x });
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
          max_x={moment().subtract(1, 'days').toDate()}
          // title='Firefox - Crashes per 1000 Usage Hours'
        />
        <Score data={this.state.data} />
      </div>
    );
  }
}
