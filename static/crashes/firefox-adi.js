/* global fetch */
import 'babel-polyfill';
import React from 'react';
import moment from 'moment';
import MG from 'metrics-graphics';
import Graphic from '../graphic';
import Score from '../score';

export default class FirefoxAdiCrashes extends React.Component {
  state = {
    data: null,
    markers: null,
    baselines: null,
    avg: 0,
    full: false,
  };

  componentDidMount() {
    this.fetch();
  }

  async fetch() {
    const full = this.props.full;
    const { rates, baselines } = await (await fetch(`/api/crashes/adi?full=${full}`)).json();
    const data = MG.convert.date(rates, 'date');
    const releases = await (await fetch('/api/release/history?tailVersion=20')).json();
    const markers = releases.map((entry) => {
      const version = entry.version;
      // if (!/\.0$/.test(version)) {
      //   version = version.slice(-2);
      // }
      return {
        date: moment(entry.date, 'YYYY MM DD').toDate(),
        label: version,
      };
    });
    // const baseline = '2016-01-17'; // [0.75, 1.08];
    this.setState({ data, markers, baselines, full });
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
          max_y='1.25'
          cleaned
        />
        <Score
          data={this.state.data}
          baselines={this.state.baselines}
        />
      </div>
    );
  }
}

FirefoxAdiCrashes.propTypes = {
  full: React.PropTypes.number,
};
