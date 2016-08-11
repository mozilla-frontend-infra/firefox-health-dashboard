import 'babel-polyfill';
import React from 'react';
import moment from 'moment';
import { median } from 'simple-statistics';

export default function Score({ data, baselines }) {
  if (!data || !data.length) {
    return null;
  }
  const avg = median(data.slice(-7).map(({ rate }) => rate));
  const last = data.slice(-1)[0];
  const ago = moment(last.date).format('ddd, MMM D');
  let baselining = (rate) => rate.toFixed(2);
  if (baselines) {
    const low = baselines[1].rate;
    const high = baselines[0].rate;
    baselining = (rate) => `${Math.round(((1 - (high - rate) / (high - low)) * 100))}%`;
  }
  return (
    <div className='graphic-scores'>
      <div className='score'>
        <span className='score-label'>{ago}</span>
        <span className='score-display'>
          <span className='score-main'>{baselining(last.rate)}</span>
        </span>
      </div>
    </div>
  );
  /*
  <div className='score'>
    <span className='score-label'>Weekly</span>
    <span className='score-display'>
      <span className='score-main'>{baselining(avg)}</span>
    </span>
  </div>
   */
}

Score.propTypes = {
  data: React.PropTypes.array,
  baselines: React.PropTypes.array,
};
