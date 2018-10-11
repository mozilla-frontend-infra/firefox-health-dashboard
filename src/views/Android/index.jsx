import React, { Component } from 'react';

import DashboardPage from '../../components/DashboardPage';
import Section from '../../components/Section';
import BugzillaUrlContainer from '../../containers/BugzillaUrlContainer';
import NimbledroidProductVersions from '../../containers/NimbledroidProductVersions';
import NimbledroidSitesTable from '../../containers/NimbledroidSummaryTable';
import PerfherderGraphContainer from '../../containers/PerfherderGraphContainer';
import RedashContainer from '../../containers/RedashContainer';
import { COLORS } from '../../settings';

class Android extends Component {
  render() {
    const products = [
      'org.mozilla.klar',
      'org.mozilla.focus',
      'com.chrome.beta',
    ];
    const targetRatio = 1.2;
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
          <NimbledroidSitesTable
            configuration={{
              baseProduct: 'org.mozilla.focus',
              compareProduct: 'com.chrome.beta',
              products: products,
              targetRatio: targetRatio,
            }}
          />
        </Section>
        <Section title='Telemetry'>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <RedashContainer
              chartOptions={{
                title: 'TOTAL_CONTENT_PAGE_LOAD_TIME (no 95th)',
              }}
              redashDataUrl='https://sql.telemetry.mozilla.org/api/queries/59395/results.json?api_key=2L0YcuUULtECr9bfew9OAEgtC50G4Ri8NCSPLR5F'
              redashQueryUrl='https://sql.telemetry.mozilla.org/queries/59395'
            />
            <RedashContainer
              chartOptions={{
                title: 'TOTAL_CONTENT_PAGE_LOAD_TIME',
              }}
              redashDataUrl='https://sql.telemetry.mozilla.org/api/queries/59397/results.json?api_key=u9eculhXgxqgsluxYGxfXaWQ6g7KCXioEvfwjK83'
              redashQueryUrl='https://sql.telemetry.mozilla.org/queries/59397'
            />
          </div>
        </Section>
        <Section title='Perfherder' subtitle='Lower in the graph is better regardless if it is a score or execution time (read the Y label)'>
          <PerfherderGraphContainer
            title='Speedometer'
            series={[
              {
                color: COLORS[0],
                label: 'Moto G5',
                frameworkId: 10,
                platform: 'android-hw-g5-7-0-arm7-api-16',
                option: 'opt',
                project: 'mozilla-central',
                suite: 'raptor-speedometer-geckoview',
              },
              {
                color: COLORS[1],
                label: 'Pixel 2 (x64)',
                frameworkId: 10,
                option: 'opt',
                platform: 'android-hw-p2-8-0-android-aarch64',
                project: 'mozilla-central',
                suite: 'raptor-speedometer-geckoview',
              },
              {
                color: COLORS[2],
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
                color: COLORS[0],
                label: 'Moto G5',
                frameworkId: 10,
                platform: 'android-hw-g5-7-0-arm7-api-16',
                option: 'opt',
                project: 'mozilla-central',
                suite: 'raptor-unity-webgl-geckoview',
              },
              {
                color: COLORS[1],
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
