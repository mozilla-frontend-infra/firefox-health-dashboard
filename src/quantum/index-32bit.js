import React from 'react';
import PropTypes from 'prop-types';
import { parse } from 'query-string';
import Grid from '@material-ui/core/Grid/Grid';
import DashboardPage from '../components/DashboardPage';
import Perfherder from './perfherder';
import Countdown from './countdown';
import { toPairs } from '../utils/queryOps';
import TelemetryContainer from '../telemetry/graph';
import { quantum32QueryParams, quantum64QueryParams, flowGraphProps, statusLabels } from './constants';
import GraphContainer from '../components/graph-container';
import { CONFIG } from './config';
import wrapSectionComponentsWithErrorBoundaries from '../utils/componentEnhancers';
import PerfherderGraphContainer from '../containers/PerfherderGraphContainer';

export default class QuantumIndex extends React.Component {
  constructor(props) {
    super(props);
    document.body.classList.add('multipage');
  }

  render() {
    // THESE LINES ARE USED TO MERGE THE index-32bit and index-64bit FILES
    const defaultBits = '32';
    const { full } = parse(this.props.location.search);
    const { location } = this.props;
    const params = new URLSearchParams(location.search);
    const bits = params.get('bits') || defaultBits;
    const quantumQueryParams = bits === '32' ? quantum32QueryParams : quantum64QueryParams;
    const platform = bits === '32' ? 'windows7-32' : 'windows10-64';
    const nightlyPlatform = bits === '32' ? 'windows7-32-nightly' : 'windows10-64-nightly';
    const regressionConfig = bits === '32' ? CONFIG.windows32Regression : CONFIG.windows64Regression;


    const sections = ([
      {
        title: 'Overview',
        cssRowExtraClasses: 'generic-metrics-graphics',
        rows: [
          <GraphContainer
            query={flowGraphProps.query}
            customClass={flowGraphProps.customClass}
            title={flowGraphProps.title}
            legend={flowGraphProps.legend}
            target={flowGraphProps.target}
            api={flowGraphProps.api}
            keys={flowGraphProps.keys}
            width={flowGraphProps.width}
            height={flowGraphProps.height}
            link={`/quantum/${bits}/bugs`}
          />,
          <Countdown />,
        ],
      },
      {
        title: 'Benchmarks',
        rows: [
          ...regressionConfig.map(config => (
            <Perfherder
              {...config}
              key={config.title}
            />
          )),
          <PerfherderGraphContainer
            title='Speedometer'
            series={[
              {
                label: 'Firefox',
                seriesConfig: {
                  frameworkId: 10,
                  platform: platform,
                  option: 'pgo',
                  project: 'mozilla-central',
                  suite: 'raptor-speedometer-firefox',
                },
              },
              {
                label: 'Chrome',
                seriesConfig: {
                  frameworkId: 10,
                  platform: nightlyPlatform,
                  option: 'opt',
                  project: 'mozilla-central',
                  suite: 'raptor-speedometer-chrome',
                },
              },
            ]}
          />,
        ],
      },
      {
        title: 'Performance Tests',
        rows: [
          <PerfherderGraphContainer
            title='Page load (tp5)'
            series={[
                {
                  label: 'Firefox',
                  seriesConfig: {
                    extraOptions: ['e10s', 'stylo'],
                    frameworkId: 1,
                    platform: platform,
                    option: 'pgo',
                    project: 'mozilla-central',
                    suite: 'tp5o',
                  },
                },
              ]}
          />,
          <PerfherderGraphContainer
            title='Window Opening (tpaint e10s)'
            series={[
                {
                  label: 'Firefox',
                  seriesConfig: {
                    extraOptions: ['e10s', 'stylo'],
                    frameworkId: 1,
                    platform: platform,
                    option: 'pgo',
                    project: 'mozilla-central',
                    suite: 'tpaint',
                  },
                },
              ]}
          />,
          <PerfherderGraphContainer
            title='Start-up (sessionrestore)'
            series={[
                {
                  label: 'Firefox',
                  seriesConfig: {
                    extraOptions: ['e10s', 'stylo'],
                    frameworkId: 1,
                    platform: platform,
                    option: 'pgo',
                    project: 'mozilla-central',
                    suite: 'sessionrestore',
                  },
                },
              ]}
          />,
          <PerfherderGraphContainer
            title='Start-up (sessionrestore_no_auto_restore)'
            series={[
                {
                  label: 'Firefox',
                  seriesConfig: {
                    extraOptions: ['e10s', 'stylo'],
                    frameworkId: 1,
                    platform: platform,
                    option: 'pgo',
                    project: 'mozilla-central',
                    suite: 'sessionrestore_no_auto_restore',
                  },
                },
              ]}
          />,
          <PerfherderGraphContainer
            title='Start-Up (ts_paint)'
            series={[
                {
                  label: 'Firefox',
                  seriesConfig: {
                    extraOptions: ['e10s', 'stylo'],
                    frameworkId: 1,
                    platform: platform,
                    option: 'pgo',
                    project: 'mozilla-central',
                    suite: 'ts_paint',
                  },
                },
              ]}
          />,
          <PerfherderGraphContainer
            title='Tab Opening (tabpaint)'
            series={[
                {
                  label: 'Firefox',
                  seriesConfig: {
                    extraOptions: ['e10s', 'stylo'],
                    frameworkId: 1,
                    platform: platform,
                    option: 'pgo',
                    project: 'mozilla-central',
                    suite: 'tabpaint',
                  },
                },
              ]}
          />,
          <PerfherderGraphContainer
            title='Tab Animation (TART)'
            series={[
                {
                  label: 'Firefox',
                  seriesConfig: {
                    extraOptions: ['e10s', 'stylo'],
                    frameworkId: 1,
                    platform: platform,
                    option: 'pgo',
                    project: 'mozilla-central',
                    suite: 'tart',
                  },
                },
              ]}
          />,
          <PerfherderGraphContainer
            title='Tab Switch (tps)'
            series={[
                {
                  label: 'Firefox',
                  seriesConfig: {
                    extraOptions: ['e10s', 'stylo'],
                    frameworkId: 1,
                    platform: platform,
                    option: 'pgo',
                    project: 'mozilla-central',
                    suite: 'tps',
                  },
                },
              ]}
          />,
          <PerfherderGraphContainer
            title='SVG (tsvg_static)'
            series={[
                {
                  label: 'Firefox',
                  seriesConfig: {
                    extraOptions: ['e10s', 'stylo'],
                    frameworkId: 1,
                    platform: platform,
                    option: 'pgo',
                    project: 'mozilla-central',
                    suite: 'tsvg_static',
                  },
                },
              ]}
          />,
          <PerfherderGraphContainer
            title='SVG (tsvgr_opacity)'
            series={[
                {
                  label: 'Firefox',
                  seriesConfig: {
                    extraOptions: ['e10s', 'stylo'],
                    frameworkId: 1,
                    platform: platform,
                    option: 'pgo',
                    project: 'mozilla-central',
                    suite: 'tsvgr_opacity',
                  },
                },
              ]}
          />,
          <PerfherderGraphContainer
            title='SVG (tsvgx)'
            series={[
                {
                  label: 'Firefox',
                  seriesConfig: {
                    extraOptions: ['e10s', 'stylo'],
                    frameworkId: 1,
                    platform: platform,
                    option: 'pgo',
                    project: 'mozilla-central',
                    suite: 'tsvgx',
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
            key='winOpen'
            id='winOpen'
            title='Window open'
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key='tabSwitch'
            id='tabSwitch'
            title='Tab switch'
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key='tabClose'
            id='tabClose'
            title='Tab close'
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key='firstPaint'
            id='firstPaint'
            title='First paint'
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key='sessionRestoreWindow'
            id='sessionRestoreWindow'
            title='Session Restore Window ms'
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key='sessionRestoreStartupInit'
            id='sessionRestoreStartupInit'
            title='Session Restore Startup Init ms'
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key='sessionRestoreStartupOnload'
            id='sessionRestoreStartupOnload'
            title='Session Restore Startup Onload ms'
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key='tabSwitchUpdate'
            id='tabSwitchUpdate'
            title='Tab Switch Update ms'
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key='gcAnimation'
            id='gcAnimation'
            title='GC Animation ms'
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key='gpuProcessInit'
            id='gpuProcessInit'
            title='GPU Process Initialization ms'
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key='gpuProcessLaunch'
            id='gpuProcessLaunch'
            title='GPU Process Launch ms'
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key='inputEventCoalesced'
            id='inputEventCoalesced'
            title='Input Event Response Coalesced ms'
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key='networkCacheHit'
            id='networkCacheHit'
            title='Network Cache Hit ms'
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key='networkCacheMiss'
            id='networkCacheMiss'
            title='Network Cache Miss ms'
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key='placesAutocomplete'
            id='placesAutocomplete'
            title='Places Autocomplete 6  First Results ms'
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key='searchServiceInit'
            id='searchServiceInit'
            title='Search Service Init ms'
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key='timeToDomComplete'
            id='timeToDomComplete'
            title='Time to DOM Complete ms'
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key='timeToDomInteractive'
            id='timeToDomInteractive'
            title='Time to DOM Interactive ms'
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key='timeToDomLoading'
            id='timeToDomLoading'
            title='Time to DOM Loading ms'
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key='timeToFirstInteraction'
            id='timeToFirstInteraction'
            title='Time to First Interaction ms'
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key='timeToNonBlankPaint'
            id='timeToNonBlankPaint'
            title='Time to Non Blank Paint ms'
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key='timeToResponseStart'
            id='timeToResponseStart'
            title='Time to Response Start ms'
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key='webextBackgroundPageLoad'
            id='webextBackgroundPageLoad'
            title='Webext Background Page Load ms'
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key='webextContentScriptInjection'
            id='webextContentScriptInjection'
            title='Webext Content Script Injection ms'
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key='webextExtensionStartup'
            id='webextExtensionStartup'
            title='Webext Extension Startup ms'
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key='timeToLoadEventEnd'
            id='timeToLoadEventEnd'
            title='Time to Load Event End ms'
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key='timeToDomContentLoadedEnd'
            id='timeToDomContentLoadedEnd'
            title='Time to DOM Content Loaded End ms'
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key='contentPaintTime'
            id='contentPaintTime'
            title='Content Paint Time ms'
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key='pageLoad'
            id='pageLoad'
            title='FX Page Load ms'
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key='simpleSessionRestored'
            id='simpleSessionRestored'
            title='Simple Measures Session Restored ms'
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key='scalarFirstPaint'
            id='scalarFirstPaint'
            title='Scalars Timestamp - First Paint ms'
            queryParams={quantumQueryParams}
          />,
          <TelemetryContainer
            key='timeToFirstScroll'
            id='timeToFirstScroll'
            title='Time to First Scroll ms'
            queryParams={quantumQueryParams}
          />,
          ],
      },
    ]);


    let reduced = sections.map(({ title, rows, cssRowExtraClasses }, sectionId) => {
      const statusList = toPairs(statusLabels).map(([key]) => [key, 0]).fromPairs();

      const section = (
        <Grid container spacing={24}>
          {
            rows.map((widget, wi) => {
              if (widget.type.displayName !== 'PerfherderWidget') {
                statusList[widget.props.status] += 1;
              } else if (widget.props.status === 'red') {
                statusList.secondary += 1;
              }

              return (
                <Grid
                  item
                  xs={6}
                  key={`page_${sectionId}_${wi}`}
                  className={(cssRowExtraClasses) ? ` ${cssRowExtraClasses}` : ''}
                >
                  {widget}
                </Grid>
              );
            })
          }
        </Grid>
      );

      const stati = toPairs(statusList)
        .map(([status, count]) => {
          const desc = statusLabels[status];
          if (desc && count) {
            return (
              <div key={`status-${status}`} className={`header-status header-status-${status}`}>
                <em>{count}</em>
                {' '}
                {desc}
              </div>
            );
          }
          return null;

        })
        .toArray();

      if ((!full || sectionId < 2) && title) {
        return (
          <div>
            <h2 className='section-header' key={sectionId}>
              <span>
                {' '}
                {title}
                {' '}
              </span>
              {' '}
              {stati}
            </h2>
            {section}
          </div>
      );
      }
        return null;


    });

    if (full) {
      reduced += (
        <h2 key='moreData'>
More data on
          <strong>https://health.graphics/quantum</strong>
. Ask questions in
          <strong>#quantum</strong>
          {' '}
(IRC & Slack)
        </h2>
);
    }

    document.body.classList[full ? 'add' : 'remove']('summary-fullscreen');

    return (
      <DashboardPage
        title='Quantum'
        subtitle='Release Criteria Report'
      >
        {reduced}
      </DashboardPage>
);
  }
}

QuantumIndex.propTypes = {
  location: PropTypes.object,
};
