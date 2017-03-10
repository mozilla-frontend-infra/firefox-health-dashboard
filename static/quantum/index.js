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
        subtitle='Performance Release Criteria'
        className='quantum-metrics'
      >
        <section
          style={{
            gridColumn: '1 / span 5',
            gridRow: '1',
          }}
        >
          <h3 className='metrics-head'><span>Smoothness</span></h3>
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
              title='Content'
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
              title='Frontend'
              subtitle='TP'
              status={{
                priority: 1,
                telemetry: {
                  status: 'Backlog',
                  bug: 1338347,
                },
              }}
            />
            <Metric
              title='Scroll Quality'
              subtitle='CB'
              format='0,0'
              status={{
                priority: 2,
                telemetry: {
                  format: '0,0',
                  metric: 'CHECKERBOARD_SEVERITY',
                },
                benchmark: {
                  framework: 'Hasal',
                  status: 'Backlog',
                },
              }}
            />
            <Metric
              title='Paint Time'
              subtitle='CB'
              format='0,0'
              status={{
                telemetry: {
                  format: '0.0',
                  metric: 'CONTENT_PAINT_TIME',
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
          <h3 className='metrics-head'><span>Responsiveness</span></h3>
          <div className='metrics-group'>
            <Metric
              title='Input-Handler Latency'
              status={{
                telemetry: {
                  metric: 'INPUT_EVENT_RESPONSE_MS',
                },
              }}
            />
            <Metric
              title='APZ Input Latency'
              status={{
                telemetry: {
                  metric: 'CONTENT_RESPONSE_DURATION',
                },
              }}
            />
            <Metric
              title='Input-Display Latency'
              status={{
                telemetry: {
                  status: 'In Progress',
                  format: '0.0',
                },
                benchmark: {
                  framework: 'Hasal',
                  status: 'At Risk',
                  comment: 'Limited coverage for Q1',
                },
              }}
            />
            <Metric
              title='Content/Frontend Hangs'
              status={{
                telemetry: {
                  status: 'Backlog (Q2)',
                  unit: 'hangs > 100ms / minute',
                },
              }}
            />
            <Metric
              title='Slow Script'
              subtitle='Page Count'
              status={{
                telemetry: {
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
          <h3 className='metrics-head'><span>Page Load</span></h3>
          <div className='metrics-group'>
            <Metric
              title='Non-Blank Paint'
              subtitle='TTFP'
              status={{
                telemetry: {
                  metric: 'TIME_TO_NON_BLANK_PAINT_MS',
                  format: '0,0',
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
              unit='Spinner, ms'
              status={{
                telemetry: {
                  metric: 'FX_PAGE_LOAD_MS',
                  format: '0,0',
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
              unit='ms'
              status={{
                telemetry: {
                  metric: 'TIME_TO_MEANINGFUL_PAINT_MS',
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
          <h3 className='metrics-head'><span>Content Engagement</span></h3>
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
          <h3 className='metrics-head'><span>Frontend</span></h3>
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
      let evolution = null;
      try {
        evolution = await (await fetch(url)).json();
      } catch (e) {
        evolution = 'n/a';
      }
      this.setState({ evolution });
    }
  }

  renderTelemetry({ status, metric, unit = '', format = '0,0.0' }) {
    const evolution = this.state.evolution;
    if (!evolution) {
      return (
        <div className='metric-line status-wip'>
          {status || '…'}
        </div>
      );
    }
    let $content = ['n/a'];
    if (typeof evolution === 'object') {
      $content = [
        <div className='metric-median'>
          <span className='metric-value'>{numeral(evolution.p50).format(format)}</span>
          <em>p50</em>
        </div>,
        <div className='metric-95h'>
          <span className='metric-value'>{numeral(evolution.p95).format(format)}</span>
          <em>p95</em>
        </div>,
      ];
    }
    return (
      <div className='metric-line metric-telemetry' title={metric}>
        {$content}
      </div>
    );
  }

  renderBenchmark({ metric, framework }) {
    return (
      <div className='metric-line metric-telemetry'>
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
        {$status}
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
