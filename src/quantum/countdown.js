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
    fetch(SETTINGS.firefoxReleases).then(response => response.json()).then((data) => {
      const releases = Object.entries(data);
      return this.setState({
        date: releases[releases.length - 1][1],
        version: parseInt(releases[releases.length - 1][0], 10),
      });
    });
  }

  render() {
    const { date, version } = this.state;
    let weeks = null;
    let extraDays = null;
    let timespan = null;

    if (date) {
      const weekDays = business.weekDays(moment(date), moment());
      weeks = Math.round(weekDays / 5);
      extraDays = weekDays - weeks * 5;
      const weekText = weeks === 1 ? 'week' : 'weeks';
      const dayText = extraDays === 1 ? 'day' : 'days';

      if (extraDays < 1 && weeks > 0) {
        timespan = `${weeks} work weeks ago`;
      } else if (weeks < 1) {
        const timeTo = moment().to(date);
        timespan = (timeTo === 'a few seconds ago' ? 'today' : timeTo);
      } else {
        timespan = `${weeks} work ${weekText}, ${extraDays} ${dayText} ago`;
      }
    }
    return (
      <Widget
        title="Release Dates"
        link="https://wiki.mozilla.org/RapidRelease/Calendar"
        className="widget-countdown narrow-content"
      >
        {date && timespan &&
          <div className="widget-entry" key="countdown-release">
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
