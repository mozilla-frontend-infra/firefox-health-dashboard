/* global fetch */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { parse } from 'query-string';
import _ from 'lodash';
import Dashboard from '../dashboard';
import Perfherder from './perfherder';
import Countdown from './countdown';
import TelemetryContainer from '../telemetry/graph';
import SETTINGS from '../settings';
import { quantum32QueryParams, flowGraphProps, statusLabels } from './constants';
import GraphContainer from '../components/graph-container';
import { CONFIG, PAGES } from './config';
import wrapSectionComponentsWithErrorBoundaries from '../utils/componentEnhancers';
import PerfherderGraphContainer from '../containers/PerfherderGraphContainer';


export default class QuantumIndex32 extends React.Component {
  constructor(props) {
    super(props);
    document.body.classList.add('multipage');
    this.fetchNotes();
  }

  state = {
    apzStatus: [],
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
            link='/quantum/32/bugs'
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
              queryParams={quantum32QueryParams}
            />,
            <TelemetryContainer
              key='tabSwitch'
              id='tabSwitch'
              title='Tab switch'
              queryParams={quantum32QueryParams}
            />,
          ],
          [
            <TelemetryContainer
              key='tabClose'
              id='tabClose'
              title='Tab close'
              queryParams={quantum32QueryParams}
            />,
            <TelemetryContainer
              key='firstPaint'
              id='firstPaint'
              title='First paint'
              queryParams={quantum32QueryParams}
            />,
          ],
        ],
      },
      {
        title: '#3 Other benchmarks',
        rows: [
          CONFIG.windows32Regression[0].map(config => (
            <Perfherder
              {...config}
              key={config.title}
            />
          )),
          CONFIG.windows32Regression[1].map(config => (
            <Perfherder
              {...config}
              key={config.title}
            />
          )),
        ],
      },
      {
        title: '#3 Pages',
        rows:
          _
          .chain(PAGES)
          // ZIP HEADER WITH ROWS TO GET OBJECTS
          .map(row => _.zipObject(PAGES.header, row))
          // GROUP BY title
          .groupBy(row => row.title)
          // CONVERT TO ROWS [{key=row.title, values=[series ....]}
          .toPairs()
          .map((row) => {
            return (
              <PerfherderGraphContainer
                title={row.key}
                series={[
                _
                .chain(row.value)
                  .map((s) => {
                    return {
                      label: s.label,
                      seriesConfig: s,
                    };
                  })
                  .value(),
              ]}
              />
            );
          })
          // GROUP IN PAIRS
          .chunk(2)
          // ADD BLANK IF REQUIRED
          .value(),
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

QuantumIndex32.propTypes = {
  location: PropTypes.object,
};
