/* global fetch */
import 'babel-polyfill';
import React from 'react';
import moment from 'moment';
import MG from 'metrics-graphics';
import Graphic from '../graphic';
import Score from '../score';

export default class FennecAdiCrashes extends React.Component {
  state = {
    data: null,
    markers: null,
    baselines: null,
    avg: 0,
  };

  componentDidMount() {
    this.fetch();
  }

  async fetch() {
    const crashes = await (await fetch('/api/crashes/adi?product=fennec')).json();
    const data = MG.convert.date(crashes, 'date');
    const releases = await (
      await fetch('/api/release/history?product=fennec&tailVersion=5')
    ).json();
    const markers = releases.map((entry) => {
      return {
        date: moment(entry.date, 'YYYY MM DD').toDate(),
        label: entry.version,
      };
    });
    const baseline = '2016-01-17'; // [1.26, 1.91];
    this.setState({ data, markers, baseline });
  }

  render() {
    return (
      <div className='row'>
        <header>
          <span>Fennec Crashes / 100 ADI</span>
        </header>
        <Graphic
          {...this.state}
          x_accessor='date'
          y_accessor='rate'
          min_y='1'
          max_y='2'
          cleaned
        />
        <Score data={this.state.data} />
      </div>
    );
  }
}
