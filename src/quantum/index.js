/* global fetch */
import 'babel-polyfill';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { stringify } from 'query-string';
import Dashboard from './../dashboard';
import Widget from './widget';
import Perfherder from './perfherder';
import Benchmark from './benchmark';
import Countdown from './countdown';
import Flow from './flow';
import TelemetryContainer from '../telemetry/graph';

const apzBugs = {
  1376525: {
    title: 'Keyboard Scrolling',
    update: 'Landed in 56 behind a preference. Enabled by default in 57.',
  },
  1211610: {
    title: 'Scrollbar Dragging',
    update: 'Landed in 55 and enabled by default.',
  },
  1367765: {
    title: 'Touch Scrollbar Dragging',
    update: 'Landed in 57 and enabled by default.',
  },
  1385463: {
    title: 'Autoscrolling',
    update: 'Landed in 56 behind a preference. Enabled by default in 57.',
  },
};

const statusLabels = new Map([
  ['red', 'at risk and not within target'],
  ['yellow', 'on track but not within target'],
  ['green', 'within target'],
  ['blue', 'signed off'],
  ['secondary', 'regression criteria at risk'],
]);

export default class QuantumIndex extends React.Component {
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
    const notes = await (await fetch('/api/perf/notes')).json();
    this.setState({ notes });
    this.fetchApzStatus();
  }

  async fetchApzStatus() {
    const bugQuery = stringify({ ids: Object.keys(apzBugs) });
    const apzStatus = await (await fetch(`/api/bz/status?${bugQuery}`)).json();
    this.setState({ apzStatus });
  }

  render() {
    const { apzStatus, notes } = this.state;
    const full = !!this.props.location.query.full;

    const $apz = (
      <Widget
        key='ApzScrolling'
        title='APZ Scrolling'
        content={Object.keys(apzBugs).map((id) => {
          const bug = apzStatus.find(needle => String(needle.id) === String(id));
          let label = 'Loading …';
          if (bug) {
            label = bug.version
              ? `Landed in ${bug.version}`
              : bug.contact ? `Waiting for ${bug.contact}` : 'Unassigned';
          }
          return (
            <div className={'widget-entry'} key={`apz-${id}`}>
              <h4>
                {apzBugs[id].title}
                <small>
                  <a href={`https://bugzilla.mozilla.org/show_bug.cgi?id=${id}`} target='_new'>
                    Bug {id}
                  </a>
                </small>
              </h4>
              <span>
                {apzBugs[id].update || label}
              </span>
            </div>
          );
        })}
        {...notes.apz}
      />
    );

    const allStatus = new Map([['green', 0], ['yellow', 0], ['red', 0]]);
    for (const note of Object.values(notes)) {
      if (note.status) {
        allStatus.set(note.status, allStatus.get(note.status) + 1);
      }
    }

    const statusWidget = (
      <Widget
        key='RiskTargetStatusSummary'
        title='Risk/Target Status Summary'
        target='Be *on track* to be *within target*'
        className='widget-status-all'
        loading={Object.keys(notes).length === 0}
        content={
          Object.keys(notes).length
            ? [
              <div className='widget-entry' key='confidence'>
                {Array.from(allStatus.entries()).map(([color, count]) => {
                  if (!count) {
                    return null;
                  }
                  return (
                    <div className={`widget-entry-row status-${color}`} key={`status-${color}`}>
                      <span>
                        <em>{count}</em> criteria {statusLabels.get(color)}
                      </span>
                    </div>
                  );
                })}
              </div>,
            ]
            : 'Loading status …'
        }
      />
    );

    const sections = [
      // {
      //   rows: [[<Flow key='flow' />, <Countdown key='countdown' />, statusWidget]],
      // },
      {
        title: '#1 Speedometer v2',
        rows: [
          [
            <Perfherder
              title='Talos: Speedometer mozilla-central'
              key='talos-speedometer'
              reference='2017-10-12'
              signatures={{
                'win10-64': '797a2bfbbac2c632f4f354aff7677a3df3c749a3',
                'win7-32': '78730407dee56521f26d3621fa8156914b83025a',
              }}
              {...notes.talos_speedometer}
            />,
          ],
          [
            <Benchmark
              title='Benchmark: 32-bit Nightly vs Chrome Canary'
              key='speedometer32'
              id='speedometer32'
              link='https://arewefastyet.com/#machine=37&view=breakdown&suite=speedometer-misc'
              targetDiff={20}
              type='line'
              {...notes.speedometer32}
            />,
            <Benchmark
              title='Benchmark: 64-bit Nightly vs Chrome Canary'
              key='speedometer'
              id='speedometer'
              link='https://arewefastyet.com/#machine=36&view=breakdown&suite=speedometer-misc'
              targetDiff={20}
              type='line'
              {...notes.speedometer}
            />,
          ],
          [
            <Benchmark
              title='Benchmark: 32-Bit Beta vs Chrome Canary'
              key='speedometerBeta32'
              id='speedometerBeta32'
              link='https://arewefastyet.com/#machine=37&view=breakdown&suite=speedometer-misc'
              targetDiff={20}
              type='line'
              {...notes.speedometerBeta32}
            />,
            <Benchmark
              title='Benchmark: 64-Bit Beta vs Chrome Canary'
              key='speedometerBeta'
              id='speedometerBeta'
              link='https://arewefastyet.com/#machine=36&view=breakdown&suite=speedometer-misc'
              targetDiff={20}
              type='line'
              {...notes.speedometerBeta}
            />,
          ],
        ],
      },
      {
        title: '#2 Responsiveness in Browser Chrome & Content',
        rows: [
          [
            <Benchmark
              title='Benchmark: Input Lag (Hasal)'
              key='hasal'
              id='hasal'
              link='https://github.com/Mozilla-TWQA/Hasal/'
              targetDiff={0}
              {...notes.hasal}
            />,
            <Perfherder
              key='hasal_perfherder'
              title='Hasal (Perfherder)'
              target='Not set'
              framework={9}
              signatures={{
                firefox:
                  `b1e9032dd4ffe6b477712c782a0ca4cac9ac1c2d,
                  6765a760486fb1fc1cf64df05b8a0b84d4fdac53,
                  e9fd56ad103296dfc346952385c284ef5f3e0dac,
                  563257d55ec4b07aa1650c25faac30e927053749,
                  7b287bc993dcd5a2a9e8d2d369740dd1c88fef25,
                  ac1fb385ad5752c63f5e9738637a4ed4607f755a,
                  711e0433e3e5f6d770f6062d7586c9131ee75aea,
                  7f49f98c7977658b265f7faa2a34b1164408f048,
                  d4af2fc60941e121cee03abe408902a47ff417dc,
                  fe07b55428ec7e40c7b1ec90e145df64c92ec002`,
                chrome: `eab3f5a88c8e948b1d5c38f72a64ae11b6e15e69,
                7ce812004afb2a2a5ab17b99e569d0f2588d6ab2,
                2a2405c17da7a1b2bcb2443fd2b10ccc57f03052,
                edd6249592205f06a19b46572e9b4d6f207dd08f,
                85b7300002195cbb74be4117ddb4fdb5434749d5,
                544ca251a3b363188f21d44f960b8537c7201861,
                87eb7165f1a63facc4e26593bddc4cb2e6070bf9,
                39af63dbc39efdd7b2eb9a0ec623626139f8b993,
                1889707238a94395535e5d3c3360a541219a9376,
                e3d6c348928907692aa5d01974a7c6d8237b5245`,
              }}
              {...notes.talos_hasal}
            />,
          ],
        ],
      },
      {
        cssRowSecondClass: 'telemetry-generic-graph',
        title: '#3 Photon Performance',
        rows: [
          [
            <TelemetryContainer
              key={'winOpen'}
              id={'winOpen'}
              title='Window open'
            />,
            <TelemetryContainer
              key={'tabSwitch'}
              id={'tabSwitch'}
              title='Tab switch'
            />,
          ],
          [
            <TelemetryContainer
              key={'tabClose'}
              id={'tabClose'}
              title='Tab close'
            />,
            <TelemetryContainer
              key={'firstPaint'}
              id={'firstPaint'}
              title='First paint'
            />,
          ],
        ],
      },
      {
        title: '#4 Page Load Times',
        rows: [
          [
            <Benchmark
              title='Benchmark: First Paint'
              key='pageload_first_paint'
              id='pageload'
              metric='firstPaint'
              link='https://mana.mozilla.org/wiki/display/PM/Quantum+Release+Criteria#QuantumReleaseCriteria-PageLoadTime'
              {...notes.pageload_render}
            />,
            <Benchmark
              title='Benchmark: Hero Element'
              key='pageload_hero'
              id='pageload'
              metric='heroElement'
              link='https://mana.mozilla.org/wiki/display/PM/Quantum+Release+Criteria#QuantumReleaseCriteria-PageLoadTime'
              {...notes.pageload_hero}
            />,
            <Perfherder
              key='tp6_loaded'
              title='Talos TP6: Loaded'
              reference='2017-07-29'
              target='Not set'
              // first 4 are quantum_pageload, second 4 are tp6 (label changed in perfherder)
              signatures={{
                'win10-64':
                  'fd75e33f207c37d5b2af9f8bbe6ce2e2a8d626ee,b8d73ce351c36fb3f136064b85a051b2c393decd,177e98528def00a9399250b7fb71f2a3bdb6440e,47a93f1c5ceec5ef83f764c2cea3e24bfb50beeb,d554681a57d858f77a7a3d8b58f5af9e82adae5c,9ef4e3fa8d78e5f459f804f2ddf0ee5e10e1c6a5,38fae8e31635a7dd92c7bde1b297f25cd5f6cdd0,a920958825b36891e19495c0669eccc21c751c03',
                'win7-32':
                  '7f1ea9f8f87c915b288fa99e69f19803799ec480,9ebf63ac2c9ab57a36bd523bc91bba78b22cd5ac,c2eb952711af078f8419af4f7b6fdad0e3a5028f,1a165eb0262c84b0e04e830d88844cf18c0fb8f8,b218982f76037c94aa0bc2e6f3102a3745fb0ef8,40762f6820e6cfd4531505caebccf27d46b0f037,a4884e6435dff7ffe3dda82b383552c7fa267e55,af835391eb98960df2aaa74c2d76200064e73c65',
              }}
              {...notes.talos_tp6_loaded}
            />,
          ],
        ],
      },
      {
        title: '#5 Browser Startup',
        rows: [
          [
            <Benchmark
              title='Start-up: First Paint'
              key='startup_first_paint'
              id='startup'
              metric='firstPaint'
              targetDiff={20}
              link='https://mana.mozilla.org/wiki/display/PM/Quantum+Release+Criteria#QuantumReleaseCriteria-Responsiveness:Content'
              {...notes.startup_render}
            />,
            <Benchmark
              title='Start-up: Hero Element'
              key='startup_hero'
              id='startup'
              metric='heroElement'
              targetDiff={20}
              link='https://mana.mozilla.org/wiki/display/PM/Quantum+Release+Criteria#QuantumReleaseCriteria-Responsiveness:Content'
              {...notes.startup_hero}
            />,
          ],
        ],
      },
      {
        title: '#6 Smooth Scrolling',
        rows: [[$apz]],
      },
      {
        title: '#7 Regression',
        rows: [
          [
            <Perfherder
              key='pageload_tp5'
              title='Page Load (tp5)'
              reference='2017-04-20'
              signatures={{
                'win10-64': 'c00763b23b39207671b795a12ba29d38ddc17f06',
                'win7-32': 'ac46ba40f08bbbf209a6c34b8c054393bf222e67',
              }}
              {...notes.talos_tp5}
            />,
            <Perfherder
              key='tpaint'
              title='Window Opening (tpaint e10s)'
              reference='2017-07-06'
              signatures={{
                'win10-64': '9525bb9b68bda10ed26b7c1999ba40830827c792',
                'win7-32': '729285324ec4b164b8d3ecec42c2fdb344f7e581',
              }}
              {...notes.talos_tpaint}
            />,
          ],
          [
            <Perfherder
              key='startup_session_restore'
              title='Start-up (sessionrestore)'
              reference='2017-04-13'
              signatures={{
                'win10-64': '577f4c3e31bc186dbfebdef9e40571569764d613',
                'win7-32': '196b82960327035de720500e1a5f9f0154cf97ad',
              }}
              {...notes.talos_sessionrestore}
            />,
            <Perfherder
              key='startup_session_restore_no_auto_restore'
              title='Start-up (sessionrestore_no_auto_restore)'
              reference='2017-05-11'
              signatures={{
                'win10-64': 'aea56740bf668dd859d84f71e384023cc11e53e1',
                'win7-32': 'ba16f34b35fb3492dc22f3774aff2d010e5f10ba',
              }}
              {...notes.talos_sessionrestore_no_auto_restore}
            />,
            <Perfherder
              key='startup_ts_paint'
              title='Start-Up (ts_paint)'
              reference='2017-05-07'
              signatures={{
                'win10-64': '78fd32fcd82cb8bfa53b8c4a19f3f51b4e03ee1d',
                'win7-32': 'e394aab72917d169024558cbab33eb4e7e9504e1',
              }}
              {...notes.talos_ts_paint}
            />,
          ],
          [
            <Perfherder
              {...notes.talos_tabpaint}
              key='tabpaint'
              title='Tab Opening (tabpaint)'
              reference='2017-06-15'
              signatures={{
                'win10-64': 'a9cd333dff68ce0812dc85e0657af4edfc51ebe3',
                'win7-32': '0bec96d78bc54370bd027af09bdd0edc8df7afd7',
              }}
            />,
            <Perfherder
              title='Tab Animation (TART)'
              key='tart'
              reference='2017-05-07'
              signatures={{
                'win10-64': '7207561755a8cb6b27c68eafeef64d019c29045e',
                'win7-32': '710f43a8c2041fe3e67124305649c12a9d708858',
              }}
              {...notes.talos_tart}
            />,
            <Perfherder
              key='tps'
              title='Tab Switch (tps)'
              reference='2017-05-07'
              signatures={{
                'win10-64': '7bdaad0fa21778103f4cd0d6bbe81fe3dc49040c',
                'win7-32': 'a86a2a069ed634663dbdef7193f2dee69b50dbc9',
              }}
              {...notes.talos_tps}
            />,
          ],
          [
            <Perfherder
              {...notes.talos_tsvg_static}
              key='tsvg_static'
              title='SVG (tsvg_static)'
              reference='2017-04-08'
              signatures={{
                'win10-64': 'e4e0081ff90530932c463fc917d113936690baa3',
                'win7-32': '18cf40355e5b20164ab9307f83dd6d6eb6184aa8',
              }}
            />,
            <Perfherder
              key='tsvgr_opacity'
              title='SVG (tsvgr_opacity)'
              reference='2016-10-26'
              signatures={{
                'win10-64': '18983f13f41e96fd1802d7e2cfc4bc07d200ec04',
                'win7-32': 'f22a87e9898beb0c7dc5fefec8267c3a9ad89a8b',
              }}
              {...notes.talos_tsvgr_opacity}
            />,
            <Perfherder
              key='tsvgx'
              title='SVG (tsvgx)'
              reference='2017-05-07'
              signatures={{
                'win10-64': '190ff873a76e95b50748042f1d6cb21c7ce77575',
                'win7-32': 'c547c2f07fba319e59da1f6ffaf604a47ccfeaf0',
              }}
              {...notes.talos_tsvgx}
            />,
          ],
        ],
      },
    ];

    let rowIdx = 0;
    const $content = sections.reduce((reduced, { title, rows, cssRowSecondClass }, sectionId) => {
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
        className += (cssRowSecondClass) ? ` ${cssRowSecondClass}` : '';
        rowIdx += 1;
        if (!full || sectionId < 2) {
          add.push(
            <div className={className} key={`row-${rowIdx}`}>
              {widgets}
            </div>,
          );
        }
      }
      const $status = [];
      for (const [status, count] of statusList) {
        if (statusLabels.has(status) && count) {
          $status.push(
            <div key={`status-${status}`} className={`header-status header-status-${status}`}>
              <em>{count}</em> {statusLabels.get(status)}
            </div>,
          );
        }
      }
      if ((!full || sectionId < 2) && title) {
        add.unshift(
          <h2 key={sectionId}>
            <span>
              {title}
            </span>
            {$status}
          </h2>,
        );
      }
      return reduced.concat(add);
    }, []);

    if (full) {
      $content.push(
        <h2 key='moreData'>More data on <strong>https://health.graphics/quantum</strong>. Ask questions in <strong>#quantum</strong> (IRC & Slack)</h2>,
      );
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

QuantumIndex.propTypes = {
  location: PropTypes.object,
};
