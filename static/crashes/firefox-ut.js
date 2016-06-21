/* global fetch */
import 'babel-polyfill';
import React from 'react';
import MG from 'metrics-graphics';
import moment from 'moment';
import { median } from 'simple-statistics';
import Graphic from '../graphic';

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
        date: new Date(entry.date),
        label: entry.version,
      };
    });
    markers.push({
      date: new Date('2016-04-01'),
      label: 'Aggregate Start',
    });
    const baselines = [3.41, 4.25];
    const avg = median(data.slice(-5).map(({ rate }) => rate));
    this.setState({ data, markers, baselines, avg });
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
          min_y='3'
          max_y='4.5'
          min_x={moment().subtract(160, 'days').toDate()}
          max_x={moment().subtract(1, 'days').toDate()}
          // title='Firefox - Crashes per 1000 Usage Hours'
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
