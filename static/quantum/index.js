/* global fetch */
import 'babel-polyfill';
import React from 'react';
import { Link } from 'react-router';
import { stringify } from 'query-string';
import Dashboard from './../dashboard';
import Perfherder from './perfherder';

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
  state = {
    apzStatus: [],
  };

  componentDidMount() {
    this.fetchApzStatus();
  }

  async fetchApzStatus() {
    const bugQuery = stringify({ ids: Object.keys(apzBugs) });
    const apzStatus = await (await fetch(`/api/bz/status?${bugQuery}`)).json();
    this.setState({ apzStatus });
  }

  render() {
    const apzStatus = this.state.apzStatus;

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

    return (
      <Dashboard
        title='Quantum'
        subtitle='Release Criteria Report'
        className='summary'
      >
        <h2>Page Load Time</h2>
        <div className='row'>
          <div className='criteria-widget status-yellow'>
            <header>
              <h3>Benchmark: Time to First Paint</h3>
              <aside>Target: ≥ Chrome</aside>
            </header>
            <div className='widget-content'>
              <div className='widget-entry'>TBD</div>
            </div>
          </div>
          <div className='criteria-widget status-yellow'>
            <header>
              <h3>Benchmark: Time to Hero Element</h3>
              <aside>Target: ≥ Chrome</aside>
            </header>
            <div className='widget-content'>
              <div className='widget-entry'>TBD</div>
            </div>
          </div>
          <Perfherder
            title='Page Load (tp5)'
            signatures={{
              'Win8/64': 'b68e2b084272409d7def3928a55baf0e00f3888a',
              'Win7/32': 'ac46ba40f08bbbf209a6c34b8c054393bf222e67',
            }}
          />
        </div>
        <h2>Responsiveness: Browser chrome</h2>
        <div className='row'>
          <div className='criteria-widget status-yellow'>
            <header>
              <h3>Input Latency</h3>
              <aside>
                Target: 2.5s {altMtbf} ≥ <em>16 hours</em>,
                2.5s ≤ <em>2% of users</em> (weekly),
                250ms {altMtbf} ≥ <em>2 hours</em>
              </aside>
            </header>
            <div className='widget-content'>
              <div className='widget-entry'>2.5s {altMtbf} = <em>25.29 hours</em> (good!)</div>
              <div className='widget-entry'>2.5s population = <em>32% of users</em></div>
              <div className='widget-entry'>250ms {altMtbf} = <em>36 min</em></div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='criteria-widget status-yellow'>
            <header>
              <h3>CC/GC pauses longer than 150 ms</h3>
              <aside>Target: <em>≤ 2% of users</em></aside>
            </header>
            <div className='widget-content'>
              <div className='widget-entry'>
                <em>57% of users</em> reported long chrome pauses.
              </div>
            </div>
          </div>
          <div className='criteria-widget status-yellow'>
            <header>
              <h3>Ghost windows</h3>
              <aside>Target: <em>0% of sessions</em></aside>
            </header>
            <div className='widget-content'>
              <div className='widget-entry'>
                <em>10% of sessions</em> reported ghost windows.
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <Perfherder
            title='Start-up (sessionrestore)'
            status='red'
            signatures={{
              'Win8/64': '555ac79a588637a3ec5752d5b9b3ee769a55d7f6',
              'Win7/32': '196b82960327035de720500e1a5f9f0154cf97ad',
            }}
          />
          <Perfherder
            title='Start-up (sessionrestore_no_auto_restore)'
            status='red'
            signatures={{
              'Win8/64': 'c3f0064e247fc3825e3a4b5367a4d898f86cfc1f',
              'Win7/32': 'ba16f34b35fb3492dc22f3774aff2d010e5f10ba',
            }}
          />
        </div>
        <div className='row'>
          <Perfherder
            title='Start-Up (ts_paint)'
            status='green'
            signatures={{
              'Win8/64': 'f04c0fb17ff70e2b5a99829a64d51411bd187d0a',
              'Win7/32': 'e394aab72917d169024558cbab33eb4e7e9504e1',
            }}
          />
          <Perfherder
            title='Window Opening (tpaint)'
            status='green'
            signatures={{
              'Win8/64': 'c6caad67b3eb993652e0e986c372d016af4d6c8b',
              'Win7/32': 'd0a85e9de2bec8153d2040f2958d979876542012',
            }}
          />
        </div>
        <div className='row'>
          <Perfherder
            title='Tab Opening (tabpaint)'
            status='green'
            signatures={{
              'Win8/64': '26721ba0e181e2844da3ddc2284a331ba54eefe0',
              'Win7/32': '0bec96d78bc54370bd027af09bdd0edc8df7afd7',
            }}
          />
          <Perfherder
            title='Tab Animation (TART)'
            status='green'
            signatures={{
              'Win8/64': '11f6fa713ccb401ad32d744398978b421758ab9d',
              'Win7/32': '710f43a8c2041fe3e67124305649c12a9d708858',
            }}
          />
          <Perfherder
            title='Tab Switch (tps)'
            status='red'
            signatures={{
              'Win8/64': 'cfc195cb8dcd3d23be28f59f57a9bb68b8d7dfe2',
              'Win7/32': 'a86a2a069ed634663dbdef7193f2dee69b50dbc9',
            }}
          />
        </div>
        <div className='row'>
          <Perfherder
            title='SVG (tsvg_static)'
            status='red'
            signatures={{
              'Win8/64': '397a484349ec684142dc3b3dab8f882a5d54bc8b',
              'Win7/32': '18cf40355e5b20164ab9307f83dd6d6eb6184aa8',
            }}
          />
          <Perfherder
            title='SVG (tsvgr_opacity)'
            status='green'
            signatures={{
              'Win8/64': '3bfe93820de5fd84b3a3d997670b1689a9a70839',
              'Win7/32': 'f22a87e9898beb0c7dc5fefec8267c3a9ad89a8b',
            }}
          />
          <Perfherder
            title='SVG (tsvgx)'
            status='green'
            signatures={{
              'Win8/64': '801468cb00bf0ca29ad9135a05a3bcfcdba8d480',
              'Win7/32': 'c547c2f07fba319e59da1f6ffaf604a47ccfeaf0',
            }}
          />
        </div>
        <h2>Responsiveness: Content</h2>
        <div className='row'>
          <div className='criteria-widget status-yellow'>
            <header>
              <h3>Benchmark: Input Latency Benchmark</h3>
              <aside>
                TBD
              </aside>
            </header>
            <div className='widget-content'>
              <div className='widget-entry'>TBD</div>
            </div>
          </div>
          <div className='criteria-widget status-yellow'>
            <header>
              <h3>Speedometer</h3>
              <aside>
                Target: <em>≤ 2370 ms</em> (Chrome + 20%)
              </aside>
            </header>
            <div className='widget-content'>
              <div className='widget-entry'>
                <em>3962 ms</em>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='criteria-widget status-yellow'>
            <header>
              <h3>Input Latency</h3>
              <aside>
                Target: 2.5s {altMtbf} ≥ <em>4 hours</em>,
                2.5s ≤ <em>45% of users</em> (weekly),
                250ms {altMtbf} ≥ <em>30 min</em>
              </aside>
            </header>
            <div className='widget-content status-red'>
              <div className='widget-entry'>2.5s {altMtbf} = <em>0.4 hours</em></div>
              <div className='widget-entry'>2.5s population = <em>45% of users</em></div>
              <div className='widget-entry'>250ms {altMtbf} = <em>13 min</em></div>
            </div>
          </div>
          <div className='criteria-widget status-yellow'>
            <header>
              <h3>CC/GC pauses longer than 2500 ms</h3>
              <aside>Target: <em>≤ 2%</em> of users</aside>
            </header>
            <div className='widget-content'>
              <div className='widget-entry'>
                <em>23% of users</em> reported long chrome pauses.
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='criteria-widget status-yellow'>
            <header>
              <h3>Start-up: Time to First Paint</h3>
              <aside>Target: ≤ <em>390 ms</em> (Chrome + 20%)</aside>
            </header>
            <div className='widget-content'>
              <div className='widget-entry'>
                <em>1600 ms</em>
              </div>
            </div>
          </div>
          <div className='criteria-widget status-yellow'>
            <header>
              <h3>Start-up: Time to Hero Element</h3>
              <aside>Target: ≤ <em>1270 ms</em> (Chrome + 20%)</aside>
            </header>
            <div className='widget-content'>
              <div className='widget-entry'>
                <em>1183 ms</em>
              </div>
            </div>
          </div>
        </div>
        <h2>Smoothness: Content</h2>
        <div className='row'>
          {$apz}
        </div>
      </Dashboard>
    );
  }
}
