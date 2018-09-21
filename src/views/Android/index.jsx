import { Component } from 'react';
import propTypes from 'prop-types';

import DashboardPage from '../../components/DashboardPage';
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
      <DashboardPage title="Android" subtitle="Release criteria">
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
      </DashboardPage>
    );
  }
}

export default Android;
