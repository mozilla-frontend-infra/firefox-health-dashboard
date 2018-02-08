/* global fetch */
import React from 'react';
import moment from 'moment';
import business from 'moment-business';
import Widget from './widget';

const dates = [
  {
    idx: 'release',
    label: [<strong key='release'>Release</strong>, ' ', 57],
    date: moment('2017-11-14 14:00:00+0000'),
  },
];

export default class CountdownWidget extends React.Component {
  render() {
    const $counters = dates.map((entry) => {
      const weekDays = business.weekDays(moment(), entry.date);
      const weeks = Math.floor(weekDays / 5);
      const extraDays = weekDays - weeks * 5;
      return (
        <div className='widget-entry' key={`countdown-${entry.idx}`}>
          <h4>
            {entry.label}
            <small>
              {entry.date.format('ddd, MMM D')}
            </small>
          </h4>
          {extraDays < 1 && weeks > 0
            ? <div key='weeks'>
              <em>{weeks}</em> work weeks
            </div>
            : (weeks < 1
                ? <div key='weeks'>
                  <em>{moment().to(entry.date)}</em>
                </div>
                : [
                  <div key='weeks'>
                    <em>{weeks}</em> weeks
                  </div>,
                  <div key='days'>
                    <em>{extraDays}</em> days
                  </div>,
                ]
              )
            }
        </div>
      );
    });
    return (
      <Widget
        title='Branch Dates'
        link='https://wiki.mozilla.org/RapidRelease/Calendar'
        className='widget-countdown'
        content={$counters}
      />
    );
  }
}

CountdownWidget.defaultProps = {};
CountdownWidget.propTypes = {};
