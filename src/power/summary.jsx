import React from 'react';
import PropTypes from 'prop-types';
import PerfherderGraphContainer from '../utils/PerfherderGraphContainer';
import { URL } from '../vendor/requests';
import { COMBOS, PLATFORMS, TESTS } from './config';
import { selectFrom } from '../vendor/vectors';
import { DetailsIcon } from '../utils/icons';
import { TimeDomain } from '../vendor/jx/domains';

class PowerSummary extends React.Component {
  render() {
    const {
      browser, suite, timeDomain, title, testId, platform,
    } = this.props;
    const combos = selectFrom(COMBOS).where({ suite });
    const testFilter = selectFrom(TESTS).where({ id: testId }).first().filter;
    const platfomFilter = selectFrom(PLATFORMS).where({ id: platform }).first().filter;

    return (
      <PerfherderGraphContainer
        timeDomain={timeDomain}
        key={`power_summary_${platform}_${suite}`}
        urls={{
          title: 'show details',
          url: URL({
            path: '/power/details',
            query: { browser, suite },
          }),
          icon: DetailsIcon,
        }}
        title={title}
        series={selectFrom(combos)
          .map(({ browserLabel, filter: browserSuiteFilter }) => ({
            label: browserLabel,
            filter: {
              and: [testFilter, browserSuiteFilter, platfomFilter],
            },
          }))
          .toArray()}
        missingDataInterval={10}
      />
    );
  }
}

PowerSummary.propTypes = {
  suite: PropTypes.string.isRequired,
  timeDomain: PropTypes.shape({}),
  title: PropTypes.string,
  testId: PropTypes.string,
};

PowerSummary.defaultProps = {
  timeDomain: new TimeDomain({ past: '3month', interval: 'day' }),
  title: 'Speedometer CPU power usage',
  testId: 'cpu',
};


// eslint-disable-next-line import/prefer-default-export
export { PowerSummary };
