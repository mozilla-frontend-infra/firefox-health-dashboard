/* global fetch */
import 'babel-polyfill';
import React from 'react';
import { stringify } from 'query-string';
import Dashboard from './../dashboard';
import Widget from './widget';
import Perfherder from './perfherder';
import Benchmark from './benchmark';
import MissonControl from './mission-control';
import Flow from './flow';

const apzBugs = {
  1351783: 'Keyboard scrolling',
  1349750: 'Scrollbar dragging',
  1105109: 'Autoscrolling',
};

const altMtbf = (
  <abbr
    title='Mean time between failures (MTBF) is the predicted elapsed time between inherent failures of a system during operation'
  >
    MTBF
  </abbr>
);

export default class QuantumIndex extends React.Component {

  constructor(props) {
    super(props);
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

    const $apz = (
      <div className='criteria-widget status-red'>
        <header><h3>APZ Everywhere</h3><aside>All content scrolling should use APZ</aside></header>
        <div className='widget-content'>
          {Object.keys(apzBugs).map((id) => {
            const bug = apzStatus.find(needle => String(needle.id) === String(id));
            let label = 'Loading …';
            if (bug) {
              label = bug.version
                ? `Landed in ${bug.version}`
                : (bug.contact
                  ? `Waiting for ${bug.contact}`
                  : 'Unassigned'
                );
            }
            return (
              <div className='widget-entry'>
                <h4>{apzBugs[id]}<small>Bug {id}</small></h4>
                <span>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    );

    let rowId = 0;

    const $dashboard = (
      <Dashboard
        title='Quantum'
        subtitle='Release Criteria Report'
        className='summary'
        sourceTitle='Status Spreadsheet'
        source='https://docs.google.com/spreadsheets/d/1UMsy_sZkdgtElr2buwRtABuyA3GY6wNK_pfF01c890A/view'
      >
        <h2>Quantum Flow</h2>
        <div className='row' key={`row-${rowId += 1}`}>
          <Flow />
        </div>
        <h2>Page Load Time</h2>
        <div className='row' key={`row-${rowId += 1}`}>
          <MissonControl
            title='Benchmark: Time to First Paint'
            {...notes.tp6_render}
          />
          <MissonControl
            title='Benchmark: Time to Hero Element'
            {...notes.tp6_hero}
          />
          <Perfherder
            title='Page Load (tp5)'
            reference='2017-04-20'
            signatures={{
              'win8-64': 'b68e2b084272409d7def3928a55baf0e00f3888a',
              'win7-32': 'ac46ba40f08bbbf209a6c34b8c054393bf222e67',
            }}
            {...notes.talos_tp5}
          />
        </div>
        <h2>Responsiveness: Browser chrome</h2>
        <div className='row' key={`row-${rowId += 1}`}>
          <MissonControl
            title='Input Latency'
            content={[
              '2.5s MTBF = *25.29 hours*',
              '2.5s population = *32% of users*',
              '250ms MTBF = *36 min*',
            ]}
            {...notes.chrome_input_latency}
          />
        </div>
        <div className='row' key={`row-${rowId += 1}`}>
          <MissonControl
            title='CC/GC Pauses longer than 150 ms'
            {...notes.chrome_gc_pauses}
          />
          <MissonControl
            title='Ghost Windows'
            {...notes.chrome_ghost_windows}
          />
        </div>
        <div className='row' key={`row-${rowId += 1}`}>
          <Perfherder
            title='Start-up (sessionrestore)'
            reference='2017-04-13'
            signatures={{
              'win8-64': '555ac79a588637a3ec5752d5b9b3ee769a55d7f6',
              'win7-32': '196b82960327035de720500e1a5f9f0154cf97ad',
            }}
            {...notes.talos_sessionrestore}
          />
          <Perfherder
            title='Start-up (sessionrestore_no_auto_restore)'
            reference='2017-05-11'
            signatures={{
              'win8-64': 'c3f0064e247fc3825e3a4b5367a4d898f86cfc1f',
              'win7-32': 'ba16f34b35fb3492dc22f3774aff2d010e5f10ba',
            }}
            {...notes.talos_sessionrestore_no_auto_restore}
          />
        </div>
        <div className='row' key={`row-${rowId += 1}`}>
          <Perfherder
            title='Start-Up (ts_paint)'
            reference='2017-05-07'
            signatures={{
              'win8-64': 'f04c0fb17ff70e2b5a99829a64d51411bd187d0a',
              'win7-32': 'e394aab72917d169024558cbab33eb4e7e9504e1',
            }}
            {...notes.talos_ts_paint}
          />
          <Perfherder
            title='Window Opening (tpaint)'
            reference='2017-05-07'
            signatures={{
              'win8-64': 'c6caad67b3eb993652e0e986c372d016af4d6c8b',
              'win7-32': 'd0a85e9de2bec8153d2040f2958d979876542012',
            }}
            {...notes.talos_tpaint}
          />
        </div>
        <div className='row' key={`row-${rowId += 1}`}>
          <Perfherder
            {...notes.talos_tabpaint}
            title='Tab Opening (tabpaint)'
            reference='2017-04-24'
            signatures={{
              'win8-64': '26721ba0e181e2844da3ddc2284a331ba54eefe0',
              'win7-32': '0bec96d78bc54370bd027af09bdd0edc8df7afd7',
            }}
          />
          <Perfherder
            title='Tab Animation (TART)'
            reference='2017-05-07'
            signatures={{
              'win8-64': '11f6fa713ccb401ad32d744398978b421758ab9d',
              'win7-32': '710f43a8c2041fe3e67124305649c12a9d708858',
            }}
            {...notes.talos_tart}
          />
          <Perfherder
            title='Tab Switch (tps)'
            reference='2017-05-07'
            signatures={{
              'win8-64': 'cfc195cb8dcd3d23be28f59f57a9bb68b8d7dfe2',
              'win7-32': 'a86a2a069ed634663dbdef7193f2dee69b50dbc9',
            }}
            {...notes.talos_tps}
          />
        </div>
        <div className='row' key={`row-${rowId += 1}`}>
          <Perfherder
            {...notes.talos_tsvg_static}
            title='SVG (tsvg_static)'
            reference='2017-04-08'
            signatures={{
              'win8-64': '397a484349ec684142dc3b3dab8f882a5d54bc8b',
              'win7-32': '18cf40355e5b20164ab9307f83dd6d6eb6184aa8',
            }}
          />
          <Perfherder
            title='SVG (tsvgr_opacity)'
            reference='2016-10-26'
            signatures={{
              'win8-64': '3bfe93820de5fd84b3a3d997670b1689a9a70839',
              'win7-32': 'f22a87e9898beb0c7dc5fefec8267c3a9ad89a8b',
            }}
            {...notes.talos_tsvgr_opacity}
          />
          <Perfherder
            title='SVG (tsvgx)'
            reference='2017-05-07'
            signatures={{
              'win8-64': '801468cb00bf0ca29ad9135a05a3bcfcdba8d480',
              'win7-32': 'c547c2f07fba319e59da1f6ffaf604a47ccfeaf0',
            }}
            {...notes.talos_tsvgx}
          />
        </div>
        <h2>Responsiveness: Content</h2>
        <div className='row' key={`row-${rowId += 1}`}>
          <MissonControl
            title='Input Latency Benchmark'
            {...notes.hasal}
          />
          <Benchmark
            title='Speedometer v2'
            id='speedometer'
            link='https://arewefastyet.com/#machine=17&view=breakdown&suite=speedometer-misc'
            {...notes.speedometer}
          />
        </div>
        <div className='row' key={`row-${rowId += 1}`}>
          <MissonControl
            title='Input Latency'
            {...notes.chrome_input_latency}
          />
          <MissonControl
            title='CC/GC pauses longer than 2500 ms'
            {...notes.content_gc_pauses}
          />
        </div>
        <div className='row' key={`row-${rowId += 1}`}>
          <MissonControl
            title='Start-up: Time to First Paint'
            {...notes.startup_render}
          />
          <MissonControl
            title='Start-up: Time to Hero Element'
            {...notes.startup_hero}
          />
        </div>
        <h2>Smoothness: Content</h2>
        <div className='row' key={`row-${rowId += 1}`}>
          {$apz}
        </div>
      </Dashboard>
    );

    return $dashboard;
  }
}
