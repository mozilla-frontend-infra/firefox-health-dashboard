import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid/Grid';
import DashboardPage from '../components/DashboardPage';
import PerfherderWidget from './perfherder';
import { selectFrom, toPairs } from '../vendor/vectors';
import { fromQueryString, URL } from '../vendor/requests';
import TelemetryContainer from '../telemetry/graph';
import {
  quantum32QueryParams,
  quantum64QueryParams,
  statusLabels,
} from './constants';
import { CONFIG, TP6_COMBOS } from './config';
import PerfherderGraphContainer from '../containers/PerfherderGraphContainer';

export default class QuantumIndex extends React.Component {
  constructor(props) {
    super(props);
    document.body.classList.add('multipage');
  }

  render() {
    // THESE LINES ARE USED TO MERGE THE index-32bit and index-64bit FILES
    const { full } = fromQueryString(this.props.location.search);
    const {
      location,
      match: { params },
    } = this.props;
    const urlParams = fromQueryString(location.search);
    const bits = urlParams.bits || Number.parseInt(params.bits, 10);
    const quantumQueryParams =
      bits === 32 ? quantum32QueryParams : quantum64QueryParams;
    const platform =
      bits === 32
        ? {
            or: [
              {
                eq: {
                  options: 'pgo',
                  platform: 'windows7-32',
                },
              },
              {
                eq: {
                  options: 'opt',
                  platform: 'windows7-32-shippable',
                },
              },
            ],
          }
        : {
            or: [
              {
                eq: {
                  options: 'pgo',
                  platform: 'windows10-64',
                },
              },
              {
                eq: {
                  options: 'opt',
                  platform: 'windows10-64-shippable',
                },
              },
            ],
          };
    const performanceFilter = {
      and: [
        {
          or: [{ missing: 'test' }, { eq: ['test', 'suite'] }],
        },
        platform,
        {
          eq: {
            framework: 1,
            repo: 'mozilla-central',
          },
        },
      ],
    };
    const nightlyPlatform = (() => {
      if (bits === 32) {
        return {
          eq: { platform: ['windows7-32-nightly', 'windows7-32-shippable'] },
        };
      }

      return {
        eq: { platform: ['windows10-64-nightly', 'windows10-64-shippable'] },
      };
    })();
    const regressionConfig =
      bits === 32 ? CONFIG.windows32Regression : CONFIG.windows64Regression;
    const sections = [
      {
        title: 'Benchmarks',
        rows: [
          ...regressionConfig.map(config => (
            <PerfherderWidget {...config} key={config.title} />
          )),
          <PerfherderGraphContainer
            key="speedometer"
            title="Speedometer"
            series={[
              {
                label: 'Firefox',
                seriesConfig: {
                  and: [
                    { missing: 'test' },
                    platform,
                    {
                      eq: {
                        framework: 10,
                        repo: 'mozilla-central',
                        suite: 'raptor-speedometer-firefox',
                      },
                    },
                  ],
                },
              },
              {
                label: 'Chromium',
                seriesConfig: {
                  and: [
                    { missing: 'test' },
                    nightlyPlatform,
                    {
                      eq: {
                        suite: [
                          'raptor-speedometer-chrome',
                          'raptor-speedometer-chromium',
                        ],
                      },
                    },
                    {
                      eq: {
                        framework: 10,
                        repo: 'mozilla-central',
                      },
                    },
                  ],
                },
              },
            ]}
          />,
        ],
      },
      {
        title: 'Page Load tests (TP6)',
        more: URL({
          path: '/quantum/tp6',
          query: {
            bits,
            test: 'warm-loadtime',
          },
        }),
        rows: selectFrom(TP6_COMBOS)
          .where({
            bits,
            test: 'warm-loadtime',
            site: [
              'Tp6: Facebook',
              'Tp6: Amazon',
              'Tp6: YouTube',
              'Tp6: Google',
            ],
          })
          .groupBy('site')
          .map((series, site) => (
            <PerfherderGraphContainer
              // eslint-disable-next-line react/no-array-index-key
              key={`page_${site}_${bits}`}
              title={site}
              series={selectFrom(series)
                .sortBy(['ordering'])
                .map(s => ({
                  label: s.browser,
                  seriesConfig: s.seriesConfig,
                }))}
            />
          ))
          .enumerate(),
      },
      {
        title: 'Performance Tests',
        rows: [
          <PerfherderGraphContainer
            key="page-load-(tp5)"
            title="Page load (tp5)"
            series={[
              {
                label: 'Firefox',
                seriesConfig: {
                  and: [performanceFilter, { eq: { suite: 'tp5o' } }],
                },
              },
            ]}
          />,
          <PerfherderGraphContainer
            key="window-opening-(tpaint-e10s)"
            title="Window Opening (tpaint e10s)"
            series={[
              {
                label: 'Firefox',
                seriesConfig: {
                  and: [performanceFilter, { eq: { suite: 'tpaint' } }],
                },
              },
            ]}
          />,
          <PerfherderGraphContainer
            key="start-up-(sessionrestore)"
            title="Start-up (sessionrestore)"
            series={[
              {
                label: 'Firefox',
                seriesConfig: {
                  and: [performanceFilter, { eq: { suite: 'sessionrestore' } }],
                },
              },
            ]}
          />,
          <PerfherderGraphContainer
            key="start-up-(sessionrestore_no_auto_restore)"
            title="Start-up (sessionrestore_no_auto_restore)"
            series={[
              {
                label: 'Firefox',
                seriesConfig: {
                  and: [
                    performanceFilter,
                    { eq: { suite: 'sessionrestore_no_auto_restore' } },
                  ],
                },
              },
            ]}
          />,
          <PerfherderGraphContainer
            key="start-up-(ts_paint)"
            title="Start-Up (ts_paint)"
            series={[
              {
                label: 'Firefox',
                seriesConfig: {
                  and: [performanceFilter, { eq: { suite: 'ts_paint' } }],
                },
              },
            ]}
          />,
          <PerfherderGraphContainer
            key="tab-opening-(tabpaint)"
            title="Tab Opening (tabpaint)"
            series={[
              {
                label: 'Firefox',
                seriesConfig: {
                  and: [performanceFilter, { eq: { suite: 'tabpaint' } }],
                },
              },
            ]}
          />,
          <PerfherderGraphContainer
            key="tab-animation-(tart)"
            title="Tab Animation (TART)"
            series={[
              {
                label: 'Firefox',
                seriesConfig: {
                  and: [performanceFilter, { eq: { suite: 'tart' } }],
                },
              },
            ]}
          />,
          <PerfherderGraphContainer
            key="tab-switch-(tabswitch)"
            title="Tab Switch (tabswitch)"
            series={[
              {
                label: 'Firefox (tabswitch)',
                seriesConfig: {
                  and: [
                    performanceFilter,
                    { eq: { suite: ['tps', 'tabswitch'] } },
                  ],
                },
              },
            ]}
          />,
          <PerfherderGraphContainer
            key="svg-(tsvg_static)"
            title="SVG (tsvg_static)"
            series={[
              {
                label: 'Firefox',
                seriesConfig: {
                  and: [performanceFilter, { eq: { suite: 'tsvg_static' } }],
                },
              },
            ]}
          />,
          <PerfherderGraphContainer
            key="svg-(tsvgr_opacity)"
            title="SVG (tsvgr_opacity)"
            series={[
              {
                label: 'Firefox',
                seriesConfig: {
                  and: [performanceFilter, { eq: { suite: 'tsvgr_opacity' } }],
                },
              },
            ]}
          />,
          <PerfherderGraphContainer
            key="svg-(tsvgx)"
            title="SVG (tsvgx)"
            series={[
              {
                label: 'Firefox',
                seriesConfig: {
                  and: [performanceFilter, { eq: { suite: 'tsvgx' } }],
                },
              },
            ]}
          />,
        ],
      },
      {
        cssRowExtraClasses: 'generic-metrics-graphics photon-perf',
        title: 'Performance Metrics',
        rows: [
          <TelemetryContainer
            key="winOpen"
            id="winOpen"
            title="Window open"
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key="tabSwitch"
            id="tabSwitch"
            title="Tab switch"
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key="tabClose"
            id="tabClose"
            title="Tab close"
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key="firstPaint"
            id="firstPaint"
            title="First paint"
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key="sessionRestoreWindow"
            id="sessionRestoreWindow"
            title="Session Restore Window ms"
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key="sessionRestoreStartupInit"
            id="sessionRestoreStartupInit"
            title="Session Restore Startup Init ms"
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key="sessionRestoreStartupOnload"
            id="sessionRestoreStartupOnload"
            title="Session Restore Startup Onload ms"
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key="tabSwitchUpdate"
            id="tabSwitchUpdate"
            title="Tab Switch Update ms"
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key="gcAnimation"
            id="gcAnimation"
            title="GC Animation ms"
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key="gpuProcessInit"
            id="gpuProcessInit"
            title="GPU Process Initialization ms"
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key="gpuProcessLaunch"
            id="gpuProcessLaunch"
            title="GPU Process Launch ms"
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key="inputEventCoalesced"
            id="inputEventCoalesced"
            title="Input Event Response Coalesced ms"
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key="networkCacheHit"
            id="networkCacheHit"
            title="Network Cache Hit ms"
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key="networkCacheMiss"
            id="networkCacheMiss"
            title="Network Cache Miss ms"
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key="placesAutocomplete"
            id="placesAutocomplete"
            title="Places Autocomplete 6  First Results ms"
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key="searchServiceInit"
            id="searchServiceInit"
            title="Search Service Init ms"
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key="timeToDomComplete"
            id="timeToDomComplete"
            title="Time to DOM Complete ms"
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key="timeToDomInteractive"
            id="timeToDomInteractive"
            title="Time to DOM Interactive ms"
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key="timeToDomLoading"
            id="timeToDomLoading"
            title="Time to DOM Loading ms"
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key="timeToFirstInteraction"
            id="timeToFirstInteraction"
            title="Time to First Interaction ms"
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key="timeToNonBlankPaint"
            id="timeToNonBlankPaint"
            title="Time to Non Blank Paint ms"
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key="timeToResponseStart"
            id="timeToResponseStart"
            title="Time to Response Start ms"
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key="webextBackgroundPageLoad"
            id="webextBackgroundPageLoad"
            title="Webext Background Page Load ms"
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key="webextContentScriptInjection"
            id="webextContentScriptInjection"
            title="Webext Content Script Injection ms"
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key="webextExtensionStartup"
            id="webextExtensionStartup"
            title="Webext Extension Startup ms"
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key="timeToLoadEventEnd"
            id="timeToLoadEventEnd"
            title="Time to Load Event End ms"
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key="timeToDomContentLoadedEnd"
            id="timeToDomContentLoadedEnd"
            title="Time to DOM Content Loaded End ms"
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key="contentPaintTime"
            id="contentPaintTime"
            title="contentful paint Time ms"
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key="pageLoad"
            id="pageLoad"
            title="FX Page Load ms"
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key="simpleSessionRestored"
            id="simpleSessionRestored"
            title="Simple Measures Session Restored ms"
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key="scalarFirstPaint"
            id="scalarFirstPaint"
            title="Scalars Timestamp - First Paint ms"
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key="timeToFirstScroll"
            id="timeToFirstScroll"
            title="Time to First Scroll ms"
            queryParams={quantumQueryParams}
          />,
        ],
      },
    ];
    const reduced = sections.map(
      ({ title, more, rows, cssRowExtraClasses }) => {
        const statusList = toPairs(statusLabels)
          .map(() => 0)
          .fromPairs();
        const section = (
          <Grid container spacing={24}>
            {rows.map((widget, wi) => {
              // Acumulate the section's status
              if (widget.type.displayName !== 'PerfherderWidget') {
                statusList[widget.props.status] += 1;
              } else if (widget.props.status === 'red') {
                statusList.secondary += 1;
              }

              const id = `${wi}${title}`; // make unique id for key

              return (
                <Grid
                  key={`grid_${id}`}
                  item
                  xs={6}
                  className={
                    cssRowExtraClasses ? ` ${cssRowExtraClasses}` : ''
                  }>
                  {widget}
                </Grid>
              );
            })}
          </Grid>
        );
        const stati = toPairs(statusList)
          .map((count, status) => {
            const desc = statusLabels[status];

            if (desc && count) {
              return (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={`status-${status}`}
                  className={`header-status header-status-${status}`}>
                  <em>{count}</em> {desc}
                </div>
              );
            }

            return null;
          })
          .exists();

        return (
          <div key={title}>
            <h2 className="section-header">
              <span>
                {`${title}`}
                {more && (
                  <span>
                    {' ('}
                    <a href={more} style={{ fontSize: '0.8em' }}>
                      more
                    </a>
                    {')'}
                  </span>
                )}
              </span>
              {stati}
            </h2>
            {section}
          </div>
        );
      }
    );

    document.body.classList[full ? 'add' : 'remove']('summary-fullscreen');

    if (full) {
      return (
        <DashboardPage title="Quantum" subtitle="Release Criteria Report">
          {selectFrom(reduced).limit(2)}
          <h2 key="moreData">
            {'More data on'}
            <strong>https://health.graphics/quantum</strong>
            {'. Ask questions in'}
            <strong>#quantum</strong>
            {' (IRC & Slack)'}
          </h2>
        </DashboardPage>
      );
    }

    return (
      <DashboardPage title="Quantum" subtitle="Release Criteria Report">
        {reduced}
      </DashboardPage>
    );
  }
}

QuantumIndex.propTypes = {
  location: PropTypes.object,
};
