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
      browser, suite, timeDomain, title, testId, newWay,
    } = this.props;
    const browserFilter = selectFrom(COMBOS)
      .where({ browser, suite })
      .first().filter;
    const testFilter = selectFrom(TESTS).where({ id: testId }).first().filter;
    if (newWay) {
      return (
        <PerfherderGraphContainer
          timeDomain={timeDomain}
          key={`power_summary_${browser}_${suite}`}
          urls={{
            title: 'show details',
            url: URL({
              path: '/power/details',
              query: { browser, suite },
            }),
            icon: DetailsIcon,
          }}
          title={title}
          series={selectFrom(PLATFORMS)
            .map(({ label, filter: platformFilter }) => ({
              label,
              filter: {
                and: [testFilter, platformFilter, browserFilter],
              },
            }))
            .toArray()}
          missingDataInterval={10}
        />
      );
    }
    return (
      <PerfherderGraphContainer
        timeDomain={timeDomain}
        key={`power_summary_${browser}_${suite}`}
        urls={{
          title: 'show details',
          url: URL({
            path: '/power/details',
            query: { browser, suite },
          }),
          icon: DetailsIcon,
        }}
        title={title}
        series={selectFrom(PLATFORMS)
          .map(({ label, filter: platformFilter }) => ({
            label,
            filter: {
              and: [testFilter, platformFilter, browserFilter],
            },
          }))
          .toArray()}
        missingDataInterval={10}
      />
    );
  }
}

PowerSummary.propTypes = {
  browser: PropTypes.string.isRequired,
  suite: PropTypes.string.isRequired,
  timeDomain: PropTypes.shape({}),
  title: PropTypes.string,
  testId: PropTypes.string,
  newWay: PropTypes.bool,
};

PowerSummary.defaultProps = {
  timeDomain: new TimeDomain({ past: '3month', interval: 'day' }),
  title: 'Speedometer CPU power usage',
  testId: 'cpu',
  newWay: false,
};


// eslint-disable-next-line import/prefer-default-export
export { PowerSummary };
