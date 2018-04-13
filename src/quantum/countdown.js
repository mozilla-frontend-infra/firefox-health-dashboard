/* global fetch */
import React from 'react';
import moment from 'moment';
import business from 'moment-business';
import Widget from './widget';
import SETTINGS from '../settings';

export default class Countdown extends React.Component {
  state = {
    date: null,
    version: null,
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    fetch(`${SETTINGS.backend}/api/release/history`).then(response => response.json()).then(data =>
    this.setState({ date: data[data.length - 1].date, version: data[data.length - 1].version }));
  }

  render() {
    const { date, version } = this.state;
    let weeks = null;
    let extraDays = null;
    let timespan = null;

    if (date) {
      const weekDays = business.weekDays(moment(), moment(date));
      weeks = Math.floor(weekDays / 5);
      extraDays = weekDays - weeks * 5;

      if (extraDays < 1 && weeks > 0) {
        timespan = `${weeks} work weeks`;
      } else if (weeks < 1) {
        const timeTo = moment().to(date);
        timespan = (timeTo === 'a few seconds ago' ? 'today' : timeTo);
      } else {
        timespan = `${weeks} weeks, ${extraDays} days`;
      }
    }
    return (
      <Widget
        title='Release Dates'
        link='https://wiki.mozilla.org/RapidRelease/Calendar'
        className='widget-countdown narrow-content'
      >
        {date && timespan &&
          <div className='widget-entry' key='countdown-release'>
            <span>
              <em>{`${version} `}</em>is the current release
              <br />
              {`Launched ${moment(date).format('ddd, MMM D')} - ${timespan}`}
            </span>
          </div>}
      </Widget>
    );
  }
}

Countdown.defaultProps = {};
Countdown.propTypes = {};
