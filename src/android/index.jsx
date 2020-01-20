/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import DashboardPage from '../utils/DashboardPage';
import Section from '../utils/Section';
import BugzillaGraph from '../bugzilla/BugzillaGraph';
import NimbledroidSection from '../nimbledroid/NimbledroidSection';
import { PerfherderGraphContainer } from '../utils/PerfherderGraphContainer';
import RedashContainer from '../utils/RedashContainer';
import { SHOW_TELEMETRY } from './config';
import { CONFIG } from '../nimbledroid/config';
import { TP6mAggregate } from './TP6mAggregate';
import { TimeDomain } from '../vendor/jx/domains';
import { selectFrom } from '../vendor/vectors';
import { LinkIcon } from '../utils/icons';
import { showBugsUrl } from '../bugzilla/query';
import { PowerSummary } from '../power/summary';
import PlaybackSummary from '../playback/summary';
import { BROWSERS } from '../playback/config';

class Android extends Component {
  render() {
    const nimbledroidSubTitle = `${
      CONFIG.packageIdLabels[CONFIG.baseProduct]
    } vs ${CONFIG.packageIdLabels[CONFIG.compareProduct]}`;
    const timeDomain = new TimeDomain({ past: '3month', interval: 'day' });
    const mediaPlaybackBrowser = selectFrom(BROWSERS)
      .where({ id: 'fenix' })
      .first();

    return (
      <DashboardPage title="Android" subtitle="Release criteria">
        <div>
          <Grid container spacing={1}>
            <Grid item xs={6} key="bugzilla">
              <Section title="Bugzilla">
                <BugzillaGraph
                  title={(
                    <span>
                      Firefox Preview Bugs
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={showBugsUrl({
                          filter: {
                            and: [
                              {
                                or: [
                                  { eq: { product: 'Geckoview' } },
                                  {
                                    prefix: {
                                      'status_whiteboard.tokenized':
                                        'geckoview:',
                                    },
                                  },
                                ],
                              },
                              {
                                or: [
                                  { eq: { priority: ['P1', '--'] } },
                                  { missing: 'priority' },
                                ],
                              },
                              {
                                or: [
                                  { eq: { resolution: '---' } },
                                  { missing: 'resolution' },
                                ],
                              },
                            ],
                          },
                        })}
                        title="All Geckoview P1 and Triage bugs"
                      >
                        <LinkIcon />
                      </a>
                    </span>
)}
                  timeDomain={timeDomain}
                  queries={[
                    {
                      label: 'GV P1 Bugs',
                      filter: {
                        and: [
                          {
                            or: [
                              { eq: { product: 'Geckoview' } },
                              {
                                prefix: {
                                  'status_whiteboard.tokenized': 'geckoview:',
                                },
                              },
                            ],
                          },
                          {
                            or: [
                              { eq: { priority: ['P1', '--'] } },
                              { missing: 'priority' },
                            ],
                          },
                          {
                            or: [
                              { eq: { resolution: ['---', 'FIXED'] } },
                              { missing: 'resolution' },
                            ],
                          },
                        ],
                      },
                    },
                    {
                      label: 'GV P2 Bugs',
                      filter: {
                        and: [
                          {
                            or: [
                              { eq: { product: 'Geckoview' } },
                              {
                                prefix: {
                                  'status_whiteboard.tokenized': 'geckoview:',
                                },
                              },
                            ],
                          },
                          { eq: { priority: 'P2' } },
                          {
                            or: [
                              { eq: { resolution: ['---', 'FIXED'] } },
                              { missing: 'resolution' },
                            ],
                          },
                        ],
                      },
                    },
                    {
                      label: 'GV P3 Bugs',
                      filter: {
                        and: [
                          {
                            or: [
                              { eq: { product: 'Geckoview' } },
                              {
                                prefix: {
                                  'status_whiteboard.tokenized': 'geckoview:',
                                },
                              },
                            ],
                          },
                          { eq: { priority: 'P3' } },
                          {
                            or: [
                              { eq: { resolution: ['---', 'FIXED'] } },
                              { missing: 'resolution' },
                            ],
                          },
                        ],
                      },
                    },
                  ]}
                />
              </Section>
            </Grid>

            <Grid item xs={6} key="nimbledroid">
              <Section title="Nimbledroid" subtitle={nimbledroidSubTitle}>
                <NimbledroidSection configuration={{ ...CONFIG }} />
              </Section>
            </Grid>
          </Grid>
        </div>
        <Section
          title="Raptor (TP6m)"
          more="/android/tp6m?test=cold-loadtime&platform=geckoview-p2-aarch64"
        >
          <TP6mAggregate timeDomain={timeDomain} browser="fenix" platform={['p2-aarch64', 'g5']} test="cold-loadtime" />
        </Section>
        { SHOW_TELEMETRY
            && (
            <Section title="Telemetry">
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <RedashContainer
                    title="Total content page load time (no 95th)"
                    redashDataUrl="https://sql.telemetry.mozilla.org/api/queries/59395/results.json?api_key=2L0YcuUULtECr9bfew9OAEgtC50G4Ri8NCSPLR5F"
                    redashQueryUrl="https://sql.telemetry.mozilla.org/queries/59395"
                    timeDomain={timeDomain}
                  />
                </Grid>
                <Grid item xs={6}>
                  <RedashContainer
                    title="Total content page load time"
                    redashDataUrl="https://sql.telemetry.mozilla.org/api/queries/59397/results.json?api_key=u9eculhXgxqgsluxYGxfXaWQ6g7KCXioEvfwjK83"
                    redashQueryUrl="https://sql.telemetry.mozilla.org/queries/59397"
                    timeDomain={timeDomain}
                  />
                </Grid>
              </Grid>
            </Section>
            )}
        <Section
          title={`Media Playback - ${mediaPlaybackBrowser.label}`}
        >
          <Grid container spacing={1}>
            <Grid item xs={6} key="1">
              <PlaybackSummary
                key="VP9"
                bits={64}
                encoding="VP9"
                browserId={mediaPlaybackBrowser.id}
              />
            </Grid>
            <Grid item xs={6} key="2">
              <PlaybackSummary
                key="H264"
                bits={64}
                encoding="H264"
                browserId={mediaPlaybackBrowser.id}
              />
            </Grid>
          </Grid>
        </Section>
        <Section
          title="Perfherder"
          subtitle="Lower in the graph is better regardless if it is a score or execution time (read the Y label)"
        >
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <PerfherderGraphContainer
                timeDomain={timeDomain}
                title="Speedometer"
                series={[
                  {
                    label: 'Moto G5 (arm7)',
                    filter: {
                      and: [
                        { missing: 'test' },
                        {
                          prefix: { platform: 'android-hw-g5-7-0-arm7-api-16' },
                        },
                        {
                          eq: {
                            framework: 10,
                            repo: 'mozilla-central',
                            suite: 'raptor-speedometer-geckoview',
                          },
                        },
                      ],
                    },
                  },
                  {
                    label: 'Pixel 2 (ARM64)',
                    filter: {
                      and: [
                        { missing: 'test' },
                        {
                          eq: {
                            framework: 10,
                            options: 'opt',
                            platform: 'android-hw-p2-8-0-android-aarch64',
                            repo: 'mozilla-central',
                            suite: 'raptor-speedometer-geckoview',
                          },
                        },
                      ],
                    },
                  },
                ]}
                missingDataInterval={10}
              />
            </Grid>
            <Grid item xs={6}>
              <PowerSummary
                key="power"
                browser="geckoview"
                suite="speedometer"
                timeDomain={timeDomain}
              />
            </Grid>
            <Grid item xs={6}>
              <PerfherderGraphContainer
                timeDomain={timeDomain}
                title="Unity WebGl"
                series={[
                  {
                    label: 'Moto G5 (arm7)',
                    filter: {
                      and: [
                        { missing: 'test' },
                        {
                          eq: {
                            framework: 10,
                            repo: 'mozilla-central',
                            suite: 'raptor-unity-webgl-geckoview',
                          },
                        },
                        {
                          prefix: { platform: 'android-hw-g5-7-0-arm7-api-16' },
                        },
                      ],
                    },
                  },
                  {
                    label: 'Pixel 2 (ARM64)',
                    filter: {
                      and: [
                        { missing: 'test' },
                        {
                          eq: {
                            framework: 10,
                            options: 'opt',
                            platform: 'android-hw-p2-8-0-android-aarch64',
                            repo: 'mozilla-central',
                            suite: 'raptor-unity-webgl-geckoview',
                          },
                        },
                      ],
                    },
                  },
                ]}
                missingDataInterval={10}
              />
            </Grid>
          </Grid>
        </Section>
      </DashboardPage>
    );
  }
}

export default Android;
