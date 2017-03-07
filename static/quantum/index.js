/* global fetch */
import 'babel-polyfill';
import React from 'react';
import numeral from 'numeral';
import Dashboard from './../dashboard';

export default class QuantumIndex extends React.Component {
  state = {};
  //
  // componentDidMount() {
  //   this.fetch();
  // }
  //
  // async fetch() {
  //   this.setState({
  //     tmo: null,
  //   });
  // }

  render() {
    return (
      <Dashboard
        title='Firefox 57 (Quantum)'
        subtitle='Release Criteria'
        className='quantum-metrics'
      >
        <section
          style={{
            gridColumn: '1 / span 4',
            gridRow: '1',
          }}
        >
          <h3 className='metrics-head'>Smoothness</h3>
          <div className='metrics-group'>
            <Metric
              title='Frame Throughput'
              subtitle='TP'
              status={{
                priority: 0,
                telemetry: {
                  status: 'Assigned',
                  bug: 1303313,
                },
                benchmark: {
                  status: 'In Progress',
                  framework: 'Hasal',
                  gh_issue: 'https://github.com/Mozilla-TWQA/Hasal/issues/543',
                },
              }}
            />
            <Metric
              title='Scrolling'
              subtitle='TP'
              status={{
                priority: 1,
                telemetry: {
                  status: 'In Progress',
                  bug: 1338347,
                },
                benchmark: {
                  status: 'In Progress',
                  framework: 'Hasal',
                  gh_issue: 'https://github.com/Mozilla-TWQA/Hasal/issues/543',
                },
              }}
            />
            <Metric
              title='Animation'
              subtitle='TP'
              status={{
                priority: 1,
                telemetry: {
                  status: 'In Progress',
                  bug: 1338347,
                },
              }}
            />
            <Metric
              title='Scroll Quality'
              subtitle='CB'
              status={{
                priority: 2,
                telemetry: {
                  metric: 'CHECKERBOARD_SEVERITY',
                },
                benchmark: {
                  framework: 'Hasal',
                  status: 'In Progress',
                },
              }}
            />
          </div>
        </section>
        <section
          style={{
            gridColumn: '1 / span 5',
            gridRow: '2',
          }}
        >
          <h3 className='metrics-head'>Responsiveness</h3>
          <div className='metrics-group'>
            <Metric
              title='Input-Handler Latency'
              status={{
                telemetry: {
                  metric: 'INPUT_EVENT_RESPONSE_MS',
                  unit: 'ms',
                },
              }}
            />
            <Metric
              title='Input-Display Latency'
              status={{
                telemetry: {
                  status: 'In Progress',
                  unit: 'ms',
                },
                benchmark: {
                  framework: 'Hasal',
                  status: 'In Progress',
                  unit: 'ms',
                },
              }}
            />
            <Metric
              title='Content Hangs'
              status={{
                telemetry: {
                  status: 'In Progress',
                  unit: 'hangs > 100ms / minute',
                },
              }}
            />
            <Metric
              title='Frontend Hangs'
              status={{
                telemetry: {
                  status: 'In Progress',
                  unit: 'hangs > 100ms / minute',
                },
              }}
            />
            <Metric
              title='Slow Script'
              subtitle='Page Count'
              status={{
                telemetry: {
                  status: 'In Progress',
                  metric: 'SLOW_SCRIPT_PAGE_COUNT',
                },
              }}
            />
          </div>
        </section>
        <section
          style={{
            gridColumn: '2 / span 4',
            gridRow: '3',
          }}
        >
          <h3 className='metrics-head'>Page Load</h3>
          <div className='metrics-group'>
            <Metric
              title='Non-Blank Paint'
              subtitle='TTFP'
              status={{
                telemetry: {
                  metric: 'TIME_TO_NON_BLANK_PAINT_MS',
                  unit: 'ms',
                },
                benchmark: {
                  framework: 'WebPageTest',
                  metric: 'Start Render',
                  target: 1.33,
                  baseline: 1.63,
                  tracking: 1.0,
                },
              }}
            />
            <Metric
              title='Page Load'
              status={{
                telemetry: {
                  metric: 'FX_PAGE_LOAD_MS',
                  unit: 'ms',
                },
                benchmark: {
                  framework: 'WebPageTest',
                  metric: 'Visual Complete',
                  status: 'Running',
                  reference: 4.99,
                  baseline: 4.18,
                  tracking: 5.18,
                },
              }}
            />
            <Metric
              title='Meaningful Paint'
              subtitle='TTFMP'
              status={{
                telemetry: {
                  metric: 'TIME_TO_MEANINGFUL_PAINT_MS',
                  unit: 'ms',
                  status: 'In Progress',
                },
                benchmark: {
                  framework: 'WebPageTest',
                  metric: 'Speed Index',
                  status: 'Running',
                },
              }}
            />
            <Metric
              title='Interactive'
              subtitle='TTI'
              status={{
                priority: 1,
                telemetry: {
                  metric: 'TIME_TO_INTERACTIVE_MS',
                  status: 'Backlog',
                },
                benchmark: {
                  framework: 'WebPageTest',
                  metric: 'TTI',
                  status: 'In Progress',
                },
              }}
            />
          </div>
        </section>
        {/*
        <section
          style={{
            gridColumn: '4 / span 3',
            gridRow: '3',
          }}
        >
          <h3 className='metrics-head'>Content Engagement</h3>
          <div className='metrics-group'>
            <Metric
              title='Sum Scrolled'
            />
            <Metric
              title='Time to First Click'
            />
            <Metric
              title='Time to First Scroll'
            />
          </div>
        </section>
        <section
          style={{
            gridColumn: '1 / span 3',
            gridRow: '3',
          }}
        >
          <h3 className='metrics-head'>Frontend</h3>
          <div className='metrics-group'>
            <Metric
              title='Time to Window'
            />
            <Metric
              title='Time to Tabbar'
            />
            <Metric
              title='Time to Interactive'
            />
          </div>
        </section>
        */}
      </Dashboard>
    );
  }
}

QuantumIndex.defaultProps = {
};
QuantumIndex.propTypes = {
};

class Metric extends React.Component {

  state = {};

  componentDidMount() {
    this.fetch();
  }

  async fetch() {
    const { telemetry } = this.props.status;
    if (telemetry && telemetry.metric && !telemetry.status) {
      const args = 'channel=nightly';
      const url = `/api/perf/tracking?metric=${telemetry.metric}&${args}`;
      const evolution = await (await fetch(url)).json();
      this.setState({ evolution });
    }
  }

  renderTelemetry({ status, metric, unit = '' }) {
    const evolution = this.state.evolution;
    if (!evolution) {
      return (
        <div className='metric-telemetry status-wip'>
          Telemetry {status || '…'}
        </div>
      );
    }
    const format = (unit === 'ms') ? '0,0' : '0,0.0';
    return (
      <div className='metric-telemetry' title={metric}>
        <div className='metric-median'>
          <span className='metric-value'>{numeral(evolution.p50).format(format)}</span>
          <em>p50</em>
        </div>
        <div className='metric-95h'>
          <span className='metric-value'>{numeral(evolution.p95).format(format)}</span>
          <em>p95</em>
        </div>
      </div>
    );
  }

  renderBenchmark({ metric, framework }) {
    return (
      <div className='metric-telemetry'>
        {framework} ({metric})
      </div>
    );
  }

  render() {
    const { title, subtitle, status = {} } = this.props;
    const { benchmark, telemetry, priority = 0 } = status;
    const $status = [];
    const unit = telemetry && telemetry.unit;
    if (telemetry) {
      $status.push(this.renderTelemetry(telemetry));
    }
    if (benchmark) {
      $status.push(this.renderBenchmark(benchmark));
    }
    return (
      <div className='metric'>
        <h4 className='metric-head'>{title} {
          subtitle
            ? <small className='metric-head-sub'>{subtitle || unit}</small>
            : ''
        }</h4>
        <div className='metric-data'>{$status}</div>
      </div>
    );
  }
}

Metric.defaultProps = {
  subtitle: '',
  status: {},
};
Metric.propTypes = {
  title: React.PropTypes.string,
  subtitle: React.PropTypes.string,
  status: React.PropTypes.object,
};
