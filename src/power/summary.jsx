import React from 'react';
import PerfherderGraphContainer from '../utils/PerfherderGraphContainer';
import { URL } from '../vendor/requests';
import { COMBOS, PLATFORMS } from './config';
import { selectFrom } from '../vendor/vectors';
import { DetailsIcon } from '../utils/icons';

class PowerSummary extends React.Component {
  render() {
    const { browser, suite, timeDomain } = this.props;
    const browserFilter = selectFrom(COMBOS)
      .where({ browser, suite })
      .first().filter;

    return (
      <PerfherderGraphContainer
        timeDomain={timeDomain}
        key="power usage"
        title={(
          <span>
            Speedometer CPU power usage
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={URL({
                path: '/power',
                query: { browser, suite },
              })}
              title="Show details"
            >
              <DetailsIcon />
            </a>
          </span>
)}
        series={selectFrom(PLATFORMS)
          .map(({ label, filter: platformFilter }) => ({
            label,
            filter: {
              and: [{ eq: { test: 'cpu' } }, platformFilter, browserFilter],
            },
          }))
          .toArray()}
        missingDataInterval={10}
      />
    );
  }
}

// eslint-disable-next-line import/prefer-default-export
export { PowerSummary };
