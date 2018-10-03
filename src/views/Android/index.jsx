import React, { Component } from 'react';
import propTypes from 'prop-types';

import DashboardPage from '../../components/DashboardPage';
import Section from '../../components/Section';
import BugzillaUrlContainer from '../../containers/BugzillaUrlContainer';
import NimbledroidProductVersions from '../../containers/NimbledroidProductVersions';
import NimbledroidSitesTable from '../../containers/NimbledroidSummaryTable';
import NimbledroidSiteDrilldown from '../../containers/NimbledroidSiteDrilldown';
import PerfherderGraphContainer from '../../containers/PerfherderGraphContainer';

class Android extends Component {
  static propTypes = {
    site: propTypes.string,
    location: propTypes.shape({
      search: propTypes.string,
    }),
  };

  render() {
    const products = [
      'org.mozilla.klar',
      'org.mozilla.focus',
      'com.chrome.beta',
    ];
    const targetRatio = 1.2;
    const site = this.props.location.search.replace('?site=', '');
    return (
      <DashboardPage title='Android' subtitle='Release criteria'>
        <Section title='Bugzilla'>
          <BugzillaUrlContainer
            includeBugCount
            queries={[
              {
                text: 'GeckoView P1 bugs',
                parameters: {
                  component: 'GeckoView',
                  resolution: '---',
                  priority: ['P1'],
                },
              },
              {
                text: 'GeckoView backlog bugs',
                parameters: {
                  component: 'GeckoView',
                  resolution: '---',
                  priority: ['P2', 'P3'],
                },
              },
            ]}
          />
        </Section>
        <Section title='Nimbledroid' subtitle='GeckoView vs Chrome Beta'>
          <NimbledroidProductVersions products={products} />
          {!site && (
            <NimbledroidSitesTable
              configuration={{
                baseProduct: 'org.mozilla.focus',
                compareProduct: 'com.chrome.beta',
                products: products,
                targetRatio: targetRatio,
              }}
            />
          )}
          {site && (
            <NimbledroidSiteDrilldown
              configuration={{
                baseProduct: 'org.mozilla.focus',
                compareProduct: 'com.chrome.beta',
                products: products,
                site: site,
                targetRatio: targetRatio,
              }}
            />
          )}
        </Section>
        <Section title='Perfherder' subtitle='Lower in the graph is better regardless if it is a score or execution time (read the Y label)'>
          <PerfherderGraphContainer
            title='Speedometer'
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
          <PerfherderGraphContainer
            title='Unity WebGl'
            series={[
              {
                color: '#e55525',
                label: 'Moto G5',
                frameworkId: 10,
                platform: 'android-hw-g5-7-0-arm7-api-16',
                option: 'opt',
                project: 'mozilla-central',
                suite: 'raptor-unity-webgl-geckoview',
              },
              {
                color: '#45a1ff',
                label: 'Pixel 2 (arm7)',
                frameworkId: 10,
                platform: 'android-hw-p2-8-0-arm7-api-16',
                option: 'opt',
                project: 'mozilla-central',
                suite: 'raptor-unity-webgl-geckoview',
              },
            ]}
          />
        </Section>
      </DashboardPage>
    );
  }
}

export default Android;
