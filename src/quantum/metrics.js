/* global fetch */
import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import cx from 'classnames';
import Dashboard from '../dashboard';

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
        title='Year End Release (Quantum)'
        subtitle='Perceived Performance Release Criteria'
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
            <div className='metric metric-info'>
              <p>
This dashboard is a work in progress.
              Keep an eye out for more metrics and targets to come online.
              </p>
              <p>
                <em>
                Telemetry data are a 7-day window from Beta.
                Lower numbers are better.
                </em>
              </p>
            </div>
            <Metric
              title='Content Animations'
              subtitle='Frame Throughp.'
              unit='fps'
              status={{
                priority: 0,
                telemetry: {
                  metric: 'COMPOSITOR_ANIMATION_THROUGHPUT_CONTENT',
                  bug: 1338347,
                },
                benchmark: {
                  status: 'Backlog',
                  framework: 'Hasal',
                  gh_issue: 'https://github.com/Mozilla-TWQA/Hasal/issues/543',
                },
              }}
            />
            <Metric
              title='Frontend Animations'
              subtitle='Frame Throughp.'
              unit='fps'
              status={{
                priority: 1,
                telemetry: {
                  metric: 'COMPOSITOR_ANIMATION_THROUGHPUT_CHROME',
                  bug: 1338347,
                },
              }}
            />
            <Metric
              title='Scrolling'
              subtitle='Frame Throughput'
              unit='fps'
              status={{
                priority: 0,
                telemetry: {
                  metric: 'COMPOSITOR_ANIMATION_THROUGHPUT_APZ',
                  bug: 1338347,
                },
                benchmark: {
                  status: 'Backlog',
                  framework: 'Hasal',
                  gh_issue: 'https://github.com/Mozilla-TWQA/Hasal/issues/543',
                },
              }}
            />
            <Metric
              title='Scroll Quality'
              subtitle='Checkerboarding'
              format='0,0'
              unit='severity'
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
            {/* <Metric
              title='Paint Time'
              subtitle='CB'
              format='0,0'
              status={{
                telemetry: {
                  format: '0.0',
                  metric: 'CONTENT_PAINT_TIME',
                },
              }}
            /> */}
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
              title='Input Latency'
              unit='ms'
              status={{
                telemetry: [
                  {
                    metric: 'INPUT_EVENT_RESPONSE_MS',
                    label: 'Input Handler Latency',
                  },
                  {
                    metric: 'KEYBOARD_EVENT_RECEIVED_MS',
                    label: 'Keyboard Queue Latency',
                  },
                  {
                    metric: 'MOUSE_CLICK_EVENT_RECEIVED_MS',
                    label: 'Click Queue Time',
                  },
                ],
                benchmark: {
                  framework: 'Hasal',
                  status: 'Backlog',
                  comment: 'Limited coverage for Q1',
                },
              }}
            />
            <Metric
              title='Scroll Latency'
              unit='ms'
              status={{
                telemetry: [
                  {
                    metric: 'CONTENT_RESPONSE_DURATION',
                    label: 'Scroll Latency',
                  },
                ],
              }}
            />
            <Metric
              title='Content Hangs'
              unit='Hangs > 100ms / Minute'
              status={{
                telemetry: {
                  status: 'Backlog',
                },
              }}
            />
            <Metric
              title='Frontend Hangs'
              unit='Hangs > 100ms / Minute'
              status={{
                telemetry: {
                  status: 'Backlog',
                },
              }}
            />
            <Metric
              title='Slow Script'
              subtitle='Page Count'
              unit='count'
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
            gridColumn: '1 / span 5',
            gridRow: '3',
          }}
        >
          <h3 className='metrics-head'><span>Page Load</span></h3>
          <div className='metrics-group'>
            <Metric
              title='Non-Blank Paint'
              subtitle='TTFP'
              unit='ms'
              status={{
                telemetry: {
                  metric: 'TIME_TO_NON_BLANK_PAINT_NO_NETOPT_MS',
                  format: '0,0',
                },
                benchmark: {
                  framework: 'WebPageTest',
                  metric: 'Start Render',
                  status: 'In Data Review',
                  target: 1.33,
                  baseline: 1.63,
                  tracking: 1.0,
                },
              }}
            />
            <Metric
              title='Meaningful Paint'
              subtitle='TTFMP'
              unit='ms'
              status={{
                telemetry: {
                  status: 'In Progress',
                },
                benchmark: {
                  framework: 'WebPageTest',
                  metric: 'Speed Index',
                  status: 'In Data Review',
                },
              }}
            />
            <Metric
              title='Fully Loaded'
              subtitle='Tab Throbber'
              unit='ms'
              status={{
                telemetry: {
                  metric: 'FX_PAGE_LOAD_MS',
                  format: '0,0',
                },
                benchmark: {
                  framework: 'WebPageTest',
                  metric: 'Visual Complete',
                  status: 'In Data Review',
                  reference: 4.99,
                  baseline: 4.18,
                  tracking: 5.18,
                },
              }}
            />
            <Metric
              title='Interactive'
              subtitle='TTI'
              unit='ms'
              status={{
                telemetry: {
                  status: 'Backlog',
                },
                benchmark: {
                  framework: 'WebPageTest',
                  status: 'Backlog',
                },
              }}
            />
            <div className='metric metric-info'>
              <p>Feedback, questions or reports of bad performance?</p>
              <p>
                <h4><a href='https://groups.google.com/a/mozilla.com/forum/#!forum/quantum-team'>quantum-team@mozilla.com</a></h4>
                <br />
                <h4>#quantum</h4>
                {' '}
(Slack/IRC)
              </p>
              <p><em>https://health.graphics/quantum</em></p>
            </div>
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
    if (!telemetry) {
      return;
    }
    (Array.isArray(telemetry) ? telemetry : [telemetry]).forEach(async ({ metric }) => {
      if (!metric) {
        return;
      }
      const args = 'channel=beta&application=Firefox&e10sEnabled=true';
      const url = `/api/perf/tracking?metric=${metric}&${args}`;
      let evolution = null;
      try {
        evolution = await (await fetch(url)).json();
      } catch (e) {
        evolution = 'n/a';
      }
      this.setState({ [metric]: evolution });
    }, this);
  }

  renderTelemetry({
    status, metric, label, unit, format = '0,0.0',
  }) {
    const evolution = this.state[metric];
    const cls = ['metric-line', 'metric-telemetry'];
    const $content = [];
    const $title = (
      <em>
Telemetry (
        {unit || this.props.unit}
)
      </em>
);
    if (label) {
      $content.push(<div className='metric-source'>
        {$title}
        {' '}
        {label}
      </div>);
    } else {
      $content.push(<div className='metric-source'>{$title}</div>);
    }
    if (evolution) {
      if (typeof evolution === 'object') {
        $content.push(<div className='metric-summary'>
          <div className='metric-median'>
            <span className='metric-value'>{numeral(evolution.p50).format(format)}</span>
            <em>p50</em>
          </div>
          <div className='metric-95h'>
            <span className='metric-value'>{numeral(evolution.p95).format(format)}</span>
            <em>p95</em>
          </div>
        </div>);
      }
    } else {
      cls.push('status-wip');
      $content.push(<span className='metric-status'>{status || '…'}</span>);
    }
    return (
      <div className={cx(cls)} title={metric} key={metric}>
        {$content}
      </div>
    );
  }

  renderBenchmark({ framework, status }) {
    const $content = [
      <div className='metric-source'>
        <em>Benchmark:</em>
        {framework}
      </div>,
    ];
    const cls = ['metric-line', 'metric-benchmark'];
    if (status) {
      cls.push('status-wip');
      $content.push(<span className='metric-status'>{status}</span>);
    }
    return (
      <div className={cx(cls)}>
        {$content}
      </div>
    );
  }

  render() {
    const { title, subtitle, status = {} } = this.props;
    const { benchmark, telemetry } = status;
    const $status = [];
    if (telemetry) {
      const list = Array.isArray(telemetry) ? telemetry : [telemetry];
      list.forEach(entry => $status.push(this.renderTelemetry(entry)));
    }
    if (benchmark) {
      $status.push(this.renderBenchmark(benchmark));
    }
    return (
      <div className='metric'>
        <h4 className='metric-head'>
          {title}
          {' '}
          {
          subtitle
            ? <small className='metric-head-sub'>{subtitle}</small>
            : ''
        }
        </h4>
        {$status}
      </div>
    );
  }
}

Metric.defaultProps = {
  subtitle: '',
  unit: 'count',
  status: {},
};
Metric.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  unit: PropTypes.string,
  status: PropTypes.object,
};
