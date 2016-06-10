/* global fetch */
import 'babel-polyfill';
import React from 'react';
import MG from 'metrics-graphics';
import { median } from 'simple-statistics';
import Graphic from '../graphic';

export default class FirefoxAdiCrashes extends React.Component {
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
    const crashes = await (await fetch('/api/crashes/adi')).json();
    const data = MG.convert.date(crashes, 'date');
    const releases = await (await fetch('/api/release/history?tailVersion=5')).json();
    const markers = releases.map((entry) => {
      return {
        date: new Date(entry.date),
        label: entry.version,
      };
    });
    markers.push({
      date: new Date('2016-01-17'),
      label: 'Baseline',
    });
    const baselines = [0.75, 1.08];
    const avg = median(data.slice(-7).map(({ rate }) => rate));
    this.setState({ data, markers, baselines, avg });
  }

  render() {
    return (
      <div className='row'>
        <header>
          <span>Firefox Crashes / 100 ADI</span>
        </header>
        <Graphic
          {...this.state}
          x_accessor='date'
          y_accessor='rate'
          min_y='0.6'
          max_y='1.4'
          // title='Firefox - Crashes per 100 ADI'
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
