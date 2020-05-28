/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import DashboardPage from '../utils/DashboardPage';
import Section from '../utils/Section';
import BugzillaGraph from '../bugzilla/BugzillaGraph';
import RedashContainer from '../utils/RedashContainer';
import { SHOW_TELEMETRY, COMBOS, PLATFORMS } from './config';
import { TP6mAggregate } from './TP6mAggregate';
import { PerfherderGraphContainer } from '../utils/PerfherderGraphContainer';
import { TimeDomain } from '../vendor/jx/domains';
import { selectFrom } from '../vendor/vectors';
import { LinkIcon } from '../utils/icons';
import { showBugsUrl } from '../bugzilla/query';
import { PowerSummary } from '../power/summary';
import PlaybackSummary from '../playback/summary';
import { BROWSERS } from '../playback/config';
import GithubGraph from '../github/GithubGraph';

class Android extends Component {
  render() {
    const timeDomain = new TimeDomain({ past: '3month', interval: 'day' });
    const mediaPlaybackBrowser = selectFrom(BROWSERS)
      .where({ id: 'fenix' })
      .first();

    return (
      <DashboardPage title="Android" subtitle="Release criteria">
        <div>
          <Grid container spacing={1}>
            <Grid item xs={6} key="bugzilla">
              <Section title="Github">
                <GithubGraph
                  title={(
                    <span>
                      Firefox Preview P1 Performance Bugs
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://github.com/mozilla-mobile/fenix/issues?q=is%3Aopen+is%3Aissue+label%3Aeng%3Aperformance+label%3AP1"
                        title="Firefox Preview P1 performance bugs"
                      >
                        <LinkIcon />
                      </a>
                    </span>
                  )}
                  timeDomain={timeDomain}
                />
              </Section>
            </Grid>

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
          </Grid>
        </div>
        <Section
          title="Raptor (TP6m)"
          more="/android/tp6m?test=cold-loadtime&platform=geckoview-p2-aarch64"
        >
          <TP6mAggregate
            timeDomain={timeDomain}
            browser="fenix"
            platform={['p2-aarch64', 'g5']}
            test="cold-loadtime"
          />
        </Section>
        {SHOW_TELEMETRY && (
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
        <Section title={`Media Playback - ${mediaPlaybackBrowser.label}`}>
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
            {PLATFORMS.map(({ label, filter, id }) => (
              <Grid item xs={6} key={id}>
                <PerfherderGraphContainer
                  timeDomain={timeDomain}
                  title={`Speedometer ${label}`}
                  series={selectFrom(COMBOS)
                    .where({ suite: 'speedometer' })
                    .map(
                      ({ browserLabel, filter: browserSuiteFilter, test }) => ({
                        label: browserLabel,
                        filter: {
                          and: [test, filter, browserSuiteFilter],
                        },
                      }),
                    )
                    .toArray()}
                  missingDataInterval={10}
                />
              </Grid>
            ))}
            <Grid item xs={6}>
              <PowerSummary
                key="power"
                suite="speedometer"
                timeDomain={timeDomain}
                platform="g5"
                title="Speedometer CPU power usage Moto G5 (arm7)"
              />
            </Grid>
            <Grid item xs={6}>
              <PowerSummary
                key="power"
                suite="speedometer"
                timeDomain={timeDomain}
                platform="p2-aarch64"
                title="Speedometer CPU power usage Pixel 2 (aarch64)"
              />
            </Grid>
            {PLATFORMS.map(({ label, filter, id }) => (
              <Grid item xs={6} key={id}>
                <PerfherderGraphContainer
                  timeDomain={timeDomain}
                  title={`Unity WebGl ${label}`}
                  series={selectFrom(COMBOS)
                    .where({ suite: 'unity' })
                    .map(
                      ({ browserLabel, filter: browserSuiteFilter, test }) => ({
                        label: browserLabel,
                        filter: {
                          and: [test, filter, browserSuiteFilter],
                        },
                      }),
                    )
                    .toArray()}
                  missingDataInterval={10}
                />
              </Grid>
            ))}
          </Grid>
        </Section>
      </DashboardPage>
    );
  }
}

export default Android;
