import React, { Component } from 'react';

import DashboardPage from '../../components/DashboardPage';
import Section from '../../components/Section';
import BugzillaUrlContainer from '../../containers/BugzillaUrlContainer';
import BugzillaBurndown from '../../containers/BugzillaBurndown';
import NimbledroidSection from '../../containers/NimbledroidSection';
import PerfherderGraphContainer from '../../containers/PerfherderGraphContainer';
import RedashContainer from '../../containers/RedashContainer';
import SETTINGS from '../../settings';

class Android extends Component {
  render() {
    return (
      <DashboardPage title='Android' subtitle='Release criteria'>
        <Section title='Bugzilla'>
          <BugzillaUrlContainer
            includeBugCount
            queries={[
              {
                text: 'Open P1 bugs',
                parameters: {
                  component: 'GeckoView',
                  resolution: '---',
                  priority: ['P1'],
                },
              },
              {
                text: 'Open P2/P3 bugs',
                parameters: {
                  component: 'GeckoView',
                  resolution: '---',
                  priority: ['P2', 'P3'],
                },
              },
            ]}
          />
          <BugzillaBurndown
            queries={[
              {
                label: 'P1 bugs',
                parameters: {
                  component: 'GeckoView',
                  resolution: ['---', 'FIXED'],
                  priority: ['P1'],
                },
              },
              {
                label: 'P2/P3 bugs',
                parameters: {
                  component: 'GeckoView',
                  resolution: ['---', 'FIXED'],
                  priority: ['P2', 'P3'],
                },
              },
            ]}
            startDate='2018-03-01'
            title='GeckoView burndown'
          />
        </Section>
        <Section title='Nimbledroid' subtitle='GeckoView vs Chrome Beta'>
          <NimbledroidSection
            configuration={{
              baseProduct: 'org.mozilla.klar',
              compareProduct: 'com.chrome.beta',
              products: [
                'org.mozilla.klar',
                'org.mozilla.geckoview_example',
                'com.chrome.beta',
              ],
              targetRatio: 1.2,
            }}
          />
        </Section>
        <Section title='Telemetry'>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <RedashContainer
              title='Total content page load time (no 95th)'
              redashDataUrl='https://sql.telemetry.mozilla.org/api/queries/59395/results.json?api_key=2L0YcuUULtECr9bfew9OAEgtC50G4Ri8NCSPLR5F'
              redashQueryUrl='https://sql.telemetry.mozilla.org/queries/59395'
            />
            <RedashContainer
              title='Total content page load time'
              redashDataUrl='https://sql.telemetry.mozilla.org/api/queries/59397/results.json?api_key=u9eculhXgxqgsluxYGxfXaWQ6g7KCXioEvfwjK83'
              redashQueryUrl='https://sql.telemetry.mozilla.org/queries/59397'
            />
          </div>
        </Section>
        <Section title='Perfherder' subtitle='Lower in the graph is better regardless if it is a score or execution time (read the Y label)'>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <PerfherderGraphContainer
              title='Speedometer'
              series={[
                {
                  label: 'Moto G5 (arm7)',
                  frameworkId: 10,
                  platform: 'android-hw-g5-7-0-arm7-api-16',
                  option: 'opt',
                  project: 'mozilla-central',
                  suite: 'raptor-speedometer-geckoview',
                },
                {
                  label: 'Pixel 2 (arm7)',
                  frameworkId: 10,
                  option: 'opt',
                  platform: 'android-hw-p2-8-0-arm7-api-16',
                  project: 'mozilla-central',
                  suite: 'raptor-speedometer-geckoview',
                },
                {
                  label: 'Pixel 2 (ARM64)',
                  frameworkId: 10,
                  option: 'opt',
                  platform: 'android-hw-p2-8-0-android-aarch64',
                  project: 'mozilla-central',
                  suite: 'raptor-speedometer-geckoview',
                },
              ]}
            />
            <PerfherderGraphContainer
              title='Unity WebGl'
              series={[
                {
                  color: SETTINGS.colors[0],
                  label: 'Moto G5 (arm7)',
                  frameworkId: 10,
                  platform: 'android-hw-g5-7-0-arm7-api-16',
                  option: 'opt',
                  project: 'mozilla-central',
                  suite: 'raptor-unity-webgl-geckoview',
                },
                {
                  color: SETTINGS.colors[1],
                  label: 'Pixel 2 (arm7)',
                  frameworkId: 10,
                  platform: 'android-hw-p2-8-0-arm7-api-16',
                  option: 'opt',
                  project: 'mozilla-central',
                  suite: 'raptor-unity-webgl-geckoview',
                },
              ]}
            />
          </div>
        </Section>
      </DashboardPage>
    );
  }
}

export default Android;
