import React from 'react';
import PropTypes from 'prop-types';
import Widget from './widget';
import { statusLabels } from './constants';

const TargetStatus = ({ notes }) => {
  const allStatus = new Map([['green', 0], ['yellow', 0], ['red', 0]]);

  // eslint-disable-next-line no-restricted-syntax
  for (const note of Object.values(notes)) {
    if (note.status) {
      allStatus.set(note.status, allStatus.get(note.status) + 1);
    }
  }

  return (
    <Widget
      key="RiskTargetStatusSummary"
      title="Risk/Target Status Summary"
      target="Be *on track* to be *within target*"
      className="widget-status-all narrow-content"
      loading={Object.keys(notes).length === 0}
    >
      {Object.keys(notes).length > 0 && (
        <div className="widget-entry" key="confidence">
          {Array.from(allStatus.entries()).map(([color, count]) => {
            if (!count) {
              return undefined;
            }

            return (
              <div
                className={`widget-entry-row status-${color}`}
                key={`status-${color}`}
              >
                <span>
                  <em>{count}</em>
                  criteria
                  {statusLabels.get(color)}
                </span>
                <br />
              </div>
            );
          })}
        </div>
      )}
    </Widget>
  );
};

TargetStatus.propTypes = {
  notes: PropTypes.shape({}),
};

export default TargetStatus;
