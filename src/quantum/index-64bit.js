/* global fetch */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { parse } from 'query-string';
import Dashboard from '../dashboard';
import Perfherder from './perfherder';
import Countdown from './countdown';
import TelemetryContainer from '../telemetry/graph';
import SETTINGS from '../settings';
import { quantum64QueryParams, flowGraphProps, statusLabels } from './constants';
import CONFIG from './config';
import TargetStatus from './target-status';
import GraphContainer from '../components/graph-container';
import wrapSectionComponentsWithErrorBoundaries from '../utils/componentEnhancers';
import PerfherderGraphContainer from '../containers/PerfherderGraphContainer';

export default class QuantumIndex64 extends React.Component {
  constructor(props) {
    super(props);
    document.body.classList.add('multipage');
    this.fetchNotes();
  }

  state = {
    notes: {},
  };

  async fetchNotes() {
    try {
      const notes = await (await fetch(`${SETTINGS.backend}/api/perf/notes`)).json();
      this.setState({ notes });
    } catch (e) {
      console.warn('Failed to fetch notes.');
    }
  }

  render() {
    const { notes } = this.state;
    const { full } = parse(this.props.location.search);

    const sections = wrapSectionComponentsWithErrorBoundaries([
      {
        cssRowExtraClasses: 'generic-metrics-graphics',
        rows: [[
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
            link='/quantum/64/bugs'
          />,
          <Countdown />]],
      },
      {
        cssRowExtraClasses: 'generic-metrics-graphics photon-perf',
        title: '#2 Photon Performance',
        rows: [
          [
            <TelemetryContainer
              key='winOpen'
              id='winOpen'
              title='Window open'
              queryParams={quantum64QueryParams}
            />,
            <TelemetryContainer
              key='tabSwitch'
              id='tabSwitch'
              title='Tab switch'
              queryParams={quantum64QueryParams}
            />,
          ],
          [
            <TelemetryContainer
              key='tabClose'
              id='tabClose'
              title='Tab close'
              queryParams={quantum64QueryParams}
            />,
            <TelemetryContainer
              key='firstPaint'
              id='firstPaint'
              title='First paint'
              queryParams={quantum64QueryParams}
            />,
          ],
          [
            <TelemetryContainer
              key='blankWindowShown'
              id='blankWindowShown'
              title='Blank window shown'
              queryParams={quantum64QueryParams}
            />,
            <div style={{ width: '50%' }} />,
          ],
        ],
      },
      {
        title: '#3 Other benchmarks',
        rows: [
          CONFIG.windows64Regression[0].map(config => (
            <Perfherder
              {...config}
              key={config.title}
            />
          )),
          CONFIG.windows64Regression[1].map(config => (
            <Perfherder
              {...config}
              key={config.title}
            />
          )),
        ],
      },
      {
        title: '#4 Regression',
        rows: [
          [
            <PerfherderGraphContainer
              title='Speedometer'
              series={[
                {
                  label: 'Firefox',
                  frameworkId: 10,
                  platform: 'windows10-64',
                  option: 'pgo',
                  project: 'mozilla-central',
                  suite: 'raptor-speedometer-firefox',
                },
                {
                  label: 'Chrome',
                  frameworkId: 10,
                  platform: 'windows10-64-nightly',
                  option: 'opt',
                  project: 'mozilla-central',
                  suite: 'raptor-speedometer-chrome',
                },
              ]}
            />,
            <PerfherderGraphContainer
              title='Tp6: Amazon'
              series={[
                {
                  label: 'Firefox',
                  frameworkId: 10,
                  platform: 'windows10-64',
                  option: 'pgo',
                  project: 'mozilla-central',
                  suite: 'raptor-tp6-amazon-firefox',
                },
                {
                  label: 'Chrome',
                  frameworkId: 10,
                  platform: 'windows10-64-nightly',
                  option: 'opt',
                  project: 'mozilla-central',
                  suite: 'raptor-tp6-amazon-chrome',
                },
              ]}
            />,
          ],
          [
            <PerfherderGraphContainer
              title='Tp6: Facebook'
              series={[
                {
                  label: 'Firefox',
                  frameworkId: 10,
                  platform: 'windows10-64',
                  option: 'pgo',
                  project: 'mozilla-central',
                  suite: 'raptor-tp6-facebook-firefox',
                },
                {
                  label: 'Chrome',
                  frameworkId: 10,
                  platform: 'windows10-64-nightly',
                  option: 'opt',
                  project: 'mozilla-central',
                  suite: 'raptor-tp6-facebook-chrome',
                },
              ]}
            />,
            <PerfherderGraphContainer
              title='Tp6: Google'
              series={[
                {
                  label: 'Firefox',
                  frameworkId: 10,
                  platform: 'windows10-64',
                  option: 'pgo',
                  project: 'mozilla-central',
                  suite: 'raptor-tp6-google-firefox',
                },
                {
                  label: 'Chrome',
                  frameworkId: 10,
                  platform: 'windows10-64-nightly',
                  option: 'opt',
                  project: 'mozilla-central',
                  suite: 'raptor-tp6-google-chrome',
                },
              ]}
            />,
          ],
          [
            <PerfherderGraphContainer
              title='Tp6: YouTube'
              series={[
                {
                  label: 'Firefox',
                  frameworkId: 10,
                  platform: 'windows10-64',
                  option: 'pgo',
                  project: 'mozilla-central',
                  suite: 'raptor-tp6-youtube-firefox',
                },
                {
                  label: 'Chrome',
                  frameworkId: 10,
                  platform: 'windows10-64-nightly',
                  option: 'opt',
                  project: 'mozilla-central',
                  suite: 'raptor-tp6-youtube-chrome',
                },
              ]}
            />,
            <PerfherderGraphContainer
              title='Page load (tp5)'
              series={[
                {
                  label: 'Firefox',
                  extraOptions: ['e10s', 'stylo'],
                  frameworkId: 1,
                  platform: 'windows10-64',
                  option: 'pgo',
                  project: 'mozilla-central',
                  suite: 'tp5o',
                },
              ]}
            />,
          ],
          [
            <PerfherderGraphContainer
              title='Window Opening (tpaint e10s)'
              series={[
                {
                  label: 'Firefox',
                  extraOptions: ['e10s', 'stylo'],
                  frameworkId: 1,
                  platform: 'windows10-64',
                  option: 'pgo',
                  project: 'mozilla-central',
                  suite: 'tpaint',
                },
              ]}
            />,
            <PerfherderGraphContainer
              title='Start-up (sessionrestore)'
              series={[
                {
                  label: 'Firefox',
                  extraOptions: ['e10s', 'stylo'],
                  frameworkId: 1,
                  platform: 'windows10-64',
                  option: 'pgo',
                  project: 'mozilla-central',
                  suite: 'sessionrestore',
                },
              ]}
            />,
          ],
          [
            <PerfherderGraphContainer
              title='Start-up (sessionrestore_no_auto_restore)'
              series={[
                {
                  label: 'Firefox',
                  extraOptions: ['e10s', 'stylo'],
                  frameworkId: 1,
                  platform: 'windows10-64',
                  option: 'pgo',
                  project: 'mozilla-central',
                  suite: 'sessionrestore_no_auto_restore',
                },
              ]}
            />,
            <PerfherderGraphContainer
              title='Start-Up (ts_paint)'
              series={[
                {
                  label: 'Firefox',
                  extraOptions: ['e10s', 'stylo'],
                  frameworkId: 1,
                  platform: 'windows10-64',
                  option: 'pgo',
                  project: 'mozilla-central',
                  suite: 'ts_paint',
                },
              ]}
            />,
          ],
          [
            <PerfherderGraphContainer
              title='Tab Opening (tabpaint)'
              series={[
                {
                  label: 'Firefox',
                  extraOptions: ['e10s', 'stylo'],
                  frameworkId: 1,
                  platform: 'windows10-64',
                  option: 'pgo',
                  project: 'mozilla-central',
                  suite: 'tabpaint',
                },
              ]}
            />,
            <PerfherderGraphContainer
              title='Tab Animation (TART)'
              series={[
                {
                  label: 'Firefox',
                  extraOptions: ['e10s', 'stylo'],
                  frameworkId: 1,
                  platform: 'windows10-64',
                  option: 'pgo',
                  project: 'mozilla-central',
                  suite: 'tart',
                },
              ]}
            />,
          ],
          [
            <PerfherderGraphContainer
              title='Tab Switch (tps)'
              series={[
                {
                  label: 'Firefox',
                  extraOptions: ['e10s', 'stylo'],
                  frameworkId: 1,
                  platform: 'windows10-64',
                  option: 'pgo',
                  project: 'mozilla-central',
                  suite: 'tps',
                },
              ]}
            />,
            <PerfherderGraphContainer
              title='SVG (tsvg_static)'
              series={[
                {
                  label: 'Firefox',
                  extraOptions: ['e10s', 'stylo'],
                  frameworkId: 1,
                  platform: 'windows10-64',
                  option: 'pgo',
                  project: 'mozilla-central',
                  suite: 'tsvg_static',
                },
              ]}
            />,
          ],
          [
            <PerfherderGraphContainer
              title='SVG (tsvgr_opacity)'
              series={[
                {
                  label: 'Firefox',
                  extraOptions: ['e10s', 'stylo'],
                  frameworkId: 1,
                  platform: 'windows10-64',
                  option: 'pgo',
                  project: 'mozilla-central',
                  suite: 'tsvgr_opacity',
                },
              ]}
            />,
            <PerfherderGraphContainer
              title='SVG (tsvgx)'
              series={[
                {
                  label: 'Firefox',
                  extraOptions: ['e10s', 'stylo'],
                  frameworkId: 1,
                  platform: 'windows10-64',
                  option: 'pgo',
                  project: 'mozilla-central',
                  suite: 'tsvgx',
                },
              ]}
            />,
          ],
        ],
      },
    ]);

    let rowIdx = 0;
    const $content = sections.reduce((reduced, { title, rows, cssRowExtraClasses }, sectionId) => {
      const add = [];
      const statusList = new Map(Array.from(statusLabels.keys()).map(key => [key, 0]));
      for (const widgets of rows) {
        for (const widget of widgets) {
          const secondary = widget.type.displayName === 'PerfherderWidget';
          if (!secondary) {
            statusList.set(widget.props.status, statusList.get(widget.props.status) + 1);
          } else if (widget.props.status === 'red') {
            statusList.set('secondary', statusList.get('secondary') + 1);
          }
        }
        let className = 'row';
        // Add 2nd class if indicated
        className += (cssRowExtraClasses) ? ` ${cssRowExtraClasses}` : '';
        rowIdx += 1;
        if (!full || sectionId < 2) {
          add.push(<div className={className} key={`row-${rowIdx}`}>
            {widgets}
          </div>);
        }
      }
      const $status = [];
      for (const [status, count] of statusList) {
        if (statusLabels.has(status) && count) {
          $status.push(<div key={`status-${status}`} className={`header-status header-status-${status}`}>
            <em>{count}</em>
            {' '}
            {statusLabels.get(status)}
          </div>);
        }
      }
      if ((!full || sectionId < 2) && title) {
        add.unshift(<h2 key={sectionId}>
          <span>
            {title}
          </span>
          {$status}
        </h2>);
      }
      return reduced.concat(add);
    }, []);

    if (full) {
      $content.push(<h2 key='moreData'>
More data on
        <strong>https://health.graphics/quantum</strong>
. Ask questions in
        <strong>#quantum</strong>
        {' '}
(IRC & Slack)
      </h2>);
    }

    document.body.classList[full ? 'add' : 'remove']('summary-fullscreen');

    const $dashboard = (
      <Dashboard
        title='Quantum'
        subtitle='Release Criteria Report'
        className={cx('summary')}
        sourceTitle='Status Spreadsheet'
        source='https://docs.google.com/spreadsheets/d/1UMsy_sZkdgtElr2buwRtABuyA3GY6wNK_pfF01c890A/view'
        link='https://mana.mozilla.org/wiki/display/PM/Quantum+Release+Criteria'
      >
        {$content}
      </Dashboard>
    );

    return $dashboard;
  }
}

QuantumIndex64.propTypes = {
  location: PropTypes.object,
};
