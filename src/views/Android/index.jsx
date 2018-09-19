import { Component } from 'react';
import cx from 'classnames';
import propTypes from 'prop-types';

import Dashboard from '../../dashboard';
import Section from '../../components/Section';
import NimbledroidSitesTable from '../../containers/NimbledroidSummaryTable';
import NimbledroidSiteDrilldown from '../../containers/NimbledroidSiteDrilldown';
import PerfherderGraphContainer from '../../containers/PerfherderGraphContainer';

class Android extends Component {
  static propTypes = {
    site: propTypes.string,
    location: propTypes.shape({
      search: propTypes.string,
    }),
  }

  render() {
    const targetRatio = 1.2;
    const site = this.props.location.search.replace('?site=', '');
    return (
      <Dashboard
        title="Android"
        subtitle="GeckoView vs Chrome Beta Page load (time in seconds, lower is better)"
        className={cx('summary')}
      >
        {!site && (
          <Section title='Nimbledroid'>
            <NimbledroidSitesTable
              products={[
                'org.mozilla.klar',
                'org.mozilla.focus',
                'com.chrome.beta',
              ]}
              targetRatio={targetRatio}
            />
          </Section>
        )}
        {site && (
          <Section title='Nimbledroid'>
            <NimbledroidSiteDrilldown
              products={[
                'org.mozilla.klar',
                'org.mozilla.focus',
                'com.chrome.beta',
              ]}
              targetRatio={targetRatio}
              site={site}
            />
          </Section>
        )}
        <Section title='Speedometer'>
          <PerfherderGraphContainer
            series={[
              {
                color: '#e55525',
                label: 'Moto G5',
                frameworkId: 10,
                platform: 'android-hw-g5-7-0-arm7-api-16',
                option: 'opt',
                project: 'mozilla-central',
                suite: 'raptor-speedometer-geckoview',
              },
              {
                color: '#ffcd02',
                label: 'Pixel 2 (x64)',
                frameworkId: 10,
                option: 'opt',
                platform: 'android-hw-p2-8-0-android-aarch64',
                project: 'mozilla-central',
                suite: 'raptor-speedometer-geckoview',
              },
              {
                color: '#45a1ff',
                label: 'Pixel 2 (arm7)',
                frameworkId: 10,
                option: 'opt',
                platform: 'android-hw-p2-8-0-arm7-api-16',
                project: 'mozilla-central',
                suite: 'raptor-speedometer-geckoview',
              },
            ]}
          />
        </Section>
      </Dashboard>
    );
  }
}

export default Android;
