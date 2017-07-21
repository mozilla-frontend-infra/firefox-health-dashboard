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
import MissionControl from './mission-control';
import Countdown from './countdown';
import Flow from './flow';

const apzBugs = {
  1376525: 'Keyboard Scrolling',
  1349750: 'Scrollbar Dragging',
  1367765: 'Touch Scrollbar Dragging',
  1105109: 'Autoscrolling',
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
                {apzBugs[id]}
                <small>
                  <a href={`https://bugzilla.mozilla.org/show_bug.cgi?id=${id}`} target='_new'>
                    Bug {id}
                  </a>
                </small>
              </h4>
              <span>
                {label}
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
        title='Risk/Target Status Summary'
        target='Be *on track* to be *within target*'
        className='widget-status-all'
        loading={Object.keys(notes).length === 0}
        content={
          Object.keys(notes).length
            ? [
              <div className='widget-entry' key='confidence'>
                {Array.from(allStatus.entries()).map(([color, count]) => {
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
      {
        rows: [[<Flow key='flow' />, <Countdown key='countdown' />, statusWidget]],
      },
      {
        title: '#1 Speedometer v2',
        rows: [
          [
            <Benchmark
              title='Benchmark: Speedometer v2'
              id='speedometer'
              link='https://arewefastyet.com/#machine=36&view=breakdown&suite=speedometer-misc'
              targetDiff={20}
              type='line'
              {...notes.speedometer}
            />,
          ],
        ],
      },
      {
        title: '#2 Responsiveness in Browser Chrome & Content',
        rows: [
          [
            <MissionControl
              title='Browser: Input Lag ≥ 2.5s/MTBF'
              metric='nightly.mtbf_chrome_input_latency_gt_2500'
              reference={16}
              referenceArea='above'
              formatting='hrs'
              {...notes.chrome_il_mtbf_high}
            />,
            <MissionControl
              title='Browser: Input Lag ≥ 2.5s/Population'
              metric='weekly.chrome_input_latency_gt_2500'
              formatting='%'
              reference={0.02}
              {...notes.chrome_il_sessions_high}
            />,
            <MissionControl
              title='Browser: Input Lag ≥ 250ms/MTBF'
              metric='nightly.mtbf_chrome_input_latency_gt_250'
              reference={2}
              referenceArea='above'
              formatting='min'
              {...notes.chrome_il_mtbf_low}
            />,
          ],
          [
            <MissionControl
              title='Content: Input Lag ≥ 2.5s/MTBF'
              metric='nightly.mtbf_content_input_latency_gt_2500'
              reference={4}
              referenceArea='above'
              formatting='hrs'
              {...notes.content_il_mtbf_high}
            />,
            <MissionControl
              title='Content: Input Lag ≥ 2.5s/Population'
              metric='weekly.content_input_latency_gt_2500'
              formatting='%'
              reference={0.05}
              {...notes.content_il_sessions_high}
            />,
            <MissionControl
              title='Content: Input Lag ≥ 250ms/MTBF'
              metric='nightly.mtbf_content_input_latency_gt_250'
              reference={0.5}
              referenceArea='above'
              formatting='min'
              {...notes.content_il_mtbf_low}
            />,
          ],
          [
            <MissionControl
              title='Browser: Ghost Windows'
              formatting='%'
              reference={0}
              metric='nightly.ghost_windows_rate'
              {...notes.chrome_ghost_windows}
            />,
            <Benchmark
              title='Benchmark: Input Lag (Hasal)'
              id='hasal'
              link='https://github.com/Mozilla-TWQA/Hasal/'
              targetDiff={0}
              {...notes.hasal}
            />,
            // <Perfherder
            //   title='Hasal (Perfherder)'
            //   target='Not set'
            //   framework={9}
            //   signatures={{
            //     firefox:
            //       'b1e9032dd4ffe6b477712c782a0ca4cac9ac1c2d,
            //       6765a760486fb1fc1cf64df05b8a0b84d4fdac53,
            //       e9fd56ad103296dfc346952385c284ef5f3e0dac,
            //       563257d55ec4b07aa1650c25faac30e927053749,
            //       7b287bc993dcd5a2a9e8d2d369740dd1c88fef25,
            //       ac1fb385ad5752c63f5e9738637a4ed4607f755a,
            //       711e0433e3e5f6d770f6062d7586c9131ee75aea,
            //       7f49f98c7977658b265f7faa2a34b1164408f048,
            //       d4af2fc60941e121cee03abe408902a47ff417dc,
            //       fe07b55428ec7e40c7b1ec90e145df64c92ec002',
            //     chrome: 'eab3f5a88c8e948b1d5c38f72a64ae11b6e15e69,
            //     7ce812004afb2a2a5ab17b99e569d0f2588d6ab2,
            //     2a2405c17da7a1b2bcb2443fd2b10ccc57f03052,
            //     edd6249592205f06a19b46572e9b4d6f207dd08f,
            //     85b7300002195cbb74be4117ddb4fdb5434749d5,
            //     544ca251a3b363188f21d44f960b8537c7201861,
            //     87eb7165f1a63facc4e26593bddc4cb2e6070bf9,
            //     39af63dbc39efdd7b2eb9a0ec623626139f8b993,
            //     1889707238a94395535e5d3c3360a541219a9376,
            //     e3d6c348928907692aa5d01974a7c6d8237b5245',
            //   }}
            //   {...notes.talos_hasal}
            // />,
          ],
        ],
      },
      {
        title: '#3 Page Load Times',
        rows: [
          [
            <Benchmark
              title='Benchmark: First Paint'
              id='pageload'
              metric='firstPaint'
              link='https://mana.mozilla.org/wiki/display/PM/Quantum+Release+Criteria#QuantumReleaseCriteria-PageLoadTime'
              {...notes.pageload_render}
            />,
            <Benchmark
              title='Benchmark: Hero Element'
              id='pageload'
              metric='heroElement'
              link='https://mana.mozilla.org/wiki/display/PM/Quantum+Release+Criteria#QuantumReleaseCriteria-PageLoadTime'
              {...notes.pageload_hero}
            />,
            <Perfherder
              title='Talos TP6: Loaded'
              target='Not set'
              signatures={{
                'win10-64':
                  'fd75e33f207c37d5b2af9f8bbe6ce2e2a8d626ee,b8d73ce351c36fb3f136064b85a051b2c393decd,177e98528def00a9399250b7fb71f2a3bdb6440e,47a93f1c5ceec5ef83f764c2cea3e24bfb50beeb',
                'win7-32':
                  '7f1ea9f8f87c915b288fa99e69f19803799ec480,9ebf63ac2c9ab57a36bd523bc91bba78b22cd5ac,c2eb952711af078f8419af4f7b6fdad0e3a5028f,1a165eb0262c84b0e04e830d88844cf18c0fb8f8',
              }}
              {...notes.talos_tp6_loaded}
            />,
          ],
        ],
      },
      {
        title: '#4 Browser Startup',
        rows: [
          [
            <Benchmark
              title='Start-up: First Paint'
              id='startup'
              metric='firstPaint'
              targetDiff={20}
              link='https://mana.mozilla.org/wiki/display/PM/Quantum+Release+Criteria#QuantumReleaseCriteria-Responsiveness:Content'
              {...notes.startup_render}
            />,
            <Benchmark
              title='Start-up: Hero Element'
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
        title: '#5 Smooth Scrolling',
        rows: [[$apz]],
      },
      {
        title: '#6 Regression',
        rows: [
          [
            <Perfherder
              title='Page Load (tp5)'
              reference='2017-04-20'
              signatures={{
                'win10-32': 'c00763b23b39207671b795a12ba29d38ddc17f06',
                'win7-32': 'ac46ba40f08bbbf209a6c34b8c054393bf222e67',
                'win8-64': 'b68e2b084272409d7def3928a55baf0e00f3888a',
              }}
              {...notes.talos_tp5}
            />,
            <Perfherder
              title='Window Opening (tpaint)'
              reference='2017-05-07'
              signatures={{
                'win10-64': '1372d76b5e35afa687de06f8159d5e8c437be91d',
                'win7-32': 'd0a85e9de2bec8153d2040f2958d979876542012',
                'win8-64': 'c6caad67b3eb993652e0e986c372d016af4d6c8b',
              }}
              {...notes.talos_tpaint}
            />,
          ],
          [
            <Perfherder
              title='Start-up (sessionrestore)'
              reference='2017-04-13'
              signatures={{
                'win10-64': '577f4c3e31bc186dbfebdef9e40571569764d613',
                'win7-32': '196b82960327035de720500e1a5f9f0154cf97ad',
                'win8-64': '555ac79a588637a3ec5752d5b9b3ee769a55d7f6',
              }}
              {...notes.talos_sessionrestore}
            />,
            <Perfherder
              title='Start-up (sessionrestore_no_auto_restore)'
              reference='2017-05-11'
              signatures={{
                'win10-64': 'aea56740bf668dd859d84f71e384023cc11e53e1',
                'win7-32': 'ba16f34b35fb3492dc22f3774aff2d010e5f10ba',
                'win8-64': 'c3f0064e247fc3825e3a4b5367a4d898f86cfc1f',
              }}
              {...notes.talos_sessionrestore_no_auto_restore}
            />,
            <Perfherder
              title='Start-Up (ts_paint)'
              reference='2017-05-07'
              signatures={{
                'win10-64': '78fd32fcd82cb8bfa53b8c4a19f3f51b4e03ee1d',
                'win7-32': 'e394aab72917d169024558cbab33eb4e7e9504e1',
                'win8-64': 'f04c0fb17ff70e2b5a99829a64d51411bd187d0a',
              }}
              {...notes.talos_ts_paint}
            />,
          ],
          [
            <Perfherder
              {...notes.talos_tabpaint}
              title='Tab Opening (tabpaint)'
              reference='2017-06-15'
              signatures={{
                'win10-64': 'a9cd333dff68ce0812dc85e0657af4edfc51ebe3',
                'win7-32': '0bec96d78bc54370bd027af09bdd0edc8df7afd7',
              }}
            />,
            <Perfherder
              title='Tab Animation (TART)'
              reference='2017-05-07'
              signatures={{
                'win10-64': '7207561755a8cb6b27c68eafeef64d019c29045e',
                'win7-32': '710f43a8c2041fe3e67124305649c12a9d708858',
                'win8-64': '11f6fa713ccb401ad32d744398978b421758ab9d',
              }}
              {...notes.talos_tart}
            />,
            <Perfherder
              title='Tab Switch (tps)'
              reference='2017-05-07'
              signatures={{
                'win10-64': '7bdaad0fa21778103f4cd0d6bbe81fe3dc49040c',
                'win7-32': 'a86a2a069ed634663dbdef7193f2dee69b50dbc9',
                'win8-64': 'cfc195cb8dcd3d23be28f59f57a9bb68b8d7dfe2',
              }}
              {...notes.talos_tps}
            />,
          ],
          [
            <Perfherder
              {...notes.talos_tsvg_static}
              title='SVG (tsvg_static)'
              reference='2017-04-08'
              signatures={{
                'win10-64': 'e4e0081ff90530932c463fc917d113936690baa3',
                'win7-32': '18cf40355e5b20164ab9307f83dd6d6eb6184aa8',
                'win8-64': '397a484349ec684142dc3b3dab8f882a5d54bc8b',
              }}
            />,
            <Perfherder
              title='SVG (tsvgr_opacity)'
              reference='2016-10-26'
              signatures={{
                'win10-64': '18983f13f41e96fd1802d7e2cfc4bc07d200ec04',
                'win7-32': 'f22a87e9898beb0c7dc5fefec8267c3a9ad89a8b',
                'win8-64': '3bfe93820de5fd84b3a3d997670b1689a9a70839',
              }}
              {...notes.talos_tsvgr_opacity}
            />,
            <Perfherder
              title='SVG (tsvgx)'
              reference='2017-05-07'
              signatures={{
                'win10-64': '190ff873a76e95b50748042f1d6cb21c7ce77575',
                'win7-32': 'c547c2f07fba319e59da1f6ffaf604a47ccfeaf0',
                'win8-64': '801468cb00bf0ca29ad9135a05a3bcfcdba8d480',
              }}
              {...notes.talos_tsvgx}
            />,
          ],
        ],
      },
    ];

    let rowIdx = 0;
    const $content = sections.reduce((reduced, { title, rows }) => {
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
        rowIdx += 1;
        add.push(
          <div className='row' key={`row-${rowIdx}`}>
            {widgets}
          </div>,
        );
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
      if (title) {
        add.unshift(
          <h2>
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
        <h2>More data on <strong>https://health.graphics/quantum</strong>. Ask questions in <strong>#quantum</strong> (IRC & Slack)</h2>,
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
