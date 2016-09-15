import 'babel-polyfill';
import React from 'react';
import moment from 'moment';

export default function Score({ data, baselines }) {
  if (!data || !data.length) {
    return null;
  }
  // const avg = median(data.slice(-7).map(({ rate }) => rate));
  const last = data.slice(-1)[0];
  const ago = moment(last.date).format('ddd, MMM D');
  let baselining = (entry) => entry.rate.toFixed(2);
  if (baselines) {
    if (baselines[1].oldRate) {
      baselining = (entry) => entry.rate.toFixed(2);
    } else {
      const low = baselines[1].rate;
      const high = baselines[0].rate;
      baselining = (entry) => `${
        Math.round(((1 - ((high - entry.rate) / (high - low))) * 100))
      }%`;
    }
  }
  return (
    <div className='graphic-scores'>
      <div className='score'>
        <span className='score-label'>{ago}</span>
        <span className='score-display'>
          <span className='score-main'>{baselining(last)}</span>
        </span>
      </div>
    </div>
  );
}

Score.propTypes = {
  data: React.PropTypes.array,
  baselines: React.PropTypes.array,
};
