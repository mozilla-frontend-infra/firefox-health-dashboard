/* global fetch */
import 'babel-polyfill';
import React from 'react';
import MG from 'metrics-graphics';
import { mean } from 'simple-statistics';
import Graphic from '../graphic';

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
        date: new Date(entry.date),
        label: entry.version,
      };
    });
    const baseline = '2016-01-17'; // [1.26, 1.91];
    const avg = mean(data.slice(-5).map(({ rate }) => rate));
    this.setState({ data, markers, baseline, avg });
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
        />
        <div className='graphic-scores'>
          <div className='score'>
            <span className='score-label'>5 Day Avg</span>
            <span className='score-display'>
              <span className='score-main'>{this.state.avg.toFixed(2)}</span>
            </span>
          </div>
        </div>
      </div>
    );
  }
}
