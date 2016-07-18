import 'babel-polyfill';
import React from 'react';
import moment from 'moment';
import { median } from 'simple-statistics';

export default function Score({ data }) {
  if (!data || !data.length) {
    return null;
  }
  const avg = median(data.slice(-7).map(({ rate }) => rate));
  const last = data.slice(-1)[0];
  const ago = moment(last.date).format('ddd, MMM D');
  return (
    <div className='graphic-scores'>
      <div className='score'>
        <span className='score-label'>{ago}</span>
        <span className='score-display'>
          <span className='score-main'>{last.rate.toFixed(2)}</span>
        </span>
      </div>
      <div className='score'>
        <span className='score-label'>Weekly</span>
        <span className='score-display'>
          <span className='score-main'>{avg.toFixed(2)}</span>
        </span>
      </div>
    </div>
  );
}

Score.propTypes = {
  data: React.PropTypes.array,
};
