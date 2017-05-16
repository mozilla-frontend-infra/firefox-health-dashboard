/* global fetch */
import 'babel-polyfill';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
// import moment from 'moment';
import { curveLinear, line, scaleTime, scaleLinear, scalePow, scaleBand, format, timeFormat } from 'd3';
import { stringify } from 'query-string';
import Dashboard from './../dashboard';

const tickCount = 5;

export default class ChannelMetric extends React.Component {
  state = {};

  componentDidMount() {
    this.fetch();
    if (this.target) {
      const rect = this.target.getBoundingClientRect();
      this.width = rect.width;
      this.height = rect.height;
    }
  }

  height = 0;
  width = 0;

  async fetch() {
    const query = this.props.query;
    try {
      const raw = await fetch(`/api/perf/version-evolutions?${stringify(query)}`);
      const evolutions = await raw.json();
      this.setState({ evolutions });
    } catch (e) {
      this.setState({ error: true });
    }
  }

  render() {
    const { query } = this.props;
    const { evolutions, error } = this.state;
    let svg = null;

    if (evolutions) {
      const yRange = [Number.MAX_VALUE, Number.MIN_VALUE];
      const yRanges = {
        p50Avg: [Number.MAX_VALUE, Number.MIN_VALUE],
        p95Avg: [Number.MAX_VALUE, Number.MIN_VALUE],
      };
      const yRangeFields = Object.keys(yRanges);
      evolutions.forEach((version) => {
        version.channels.forEach((channel) => {
          if (!channel) {
            return;
          }
          channel.dates.forEach((date) => {
            yRangeFields.forEach((field) => {
              if (yRanges[field][0] > date[field]) {
                yRanges[field][0] = date[field];
              } else if (yRanges[field][1] < date[field]) {
                yRanges[field][1] = date[field];
              }
              if (yRange[0] > date[field]) {
                yRange[0] = date[field];
              } else if (yRange[1] < date[field]) {
                yRange[1] = date[field];
              }
            });
          });
        });
      });
      const yBandScale = scaleBand()
        .domain(yRangeFields)
        .paddingInner(0.13)
        .range([this.height - 25, 5]);
      const yScales = yRangeFields.reduce((map, field) => {
        const band = yBandScale(field);
        const xScale = scaleLinear()
          // .exponent(0.5)
          .domain(yRanges[field])
          .nice(tickCount)
          .range([band + yBandScale.bandwidth(), band]);
        return map.set(field, xScale);
      }, new Map());
      const alphaScale = scalePow()
        .exponent(0.5)
        .domain([0, 2])
        .range([1, 0.3]);
      const xDomain = [
        // first day of release for oldest version
        new Date(
          evolutions
            .slice()
            .reverse()
            .find(evolution => evolution.channels[0])
            .channels.slice(-3).find(channel => channel).dates[0].date,
          ),
        // last day of current nightly
        new Date(
          evolutions
            .find(evolution => evolution.channels[0])
            .channels[0].dates.slice(-1)[0].date,
        ),
      ];
      console.log(evolutions[0]);
      const xScale = scaleTime()
        .domain(xDomain)
        .range([50, this.width - 5]);
      const $labels = [];
      const $evolutions = evolutions.map((version, versionIdx) => {
        // console.log(moment(xDomain[1]).diff(xDomain[0], 'weeks', true));
        const paths = yRangeFields.reduce((map, field) => {
          return map.set(field, line()
            .x(d => xScale(new Date(d.date)))
            .y(d => yScales.get(field)(d[field]))
            .curve(curveLinear));
        }, new Map());
        const $channels = version.channels.map((channel, channelIdx) => {
          if (!channel) {
            return null;
          }
          const alpha = alphaScale(channelIdx);
          // const latest = (versionIdx === 0);
          return [...paths].map(([field, path], pathIdx) => {
            const color = pathIdx ? '#FF8C8E' : '#B6D806';
            const labelProps = {
              x: xScale(new Date(channel.dates[0].date)),
              y: yScales.get(field)(channel.dates[0][field]),
              fill: color,
              fillOpacity: alpha,
            };
            const key = `${versionIdx}-${channelIdx}-${pathIdx}`;
            if (channel.dates.length > 1) {
              $labels.push((
                <g
                  key={`label-${key}`}
                  className='channel-label'
                >
                  <text {...labelProps}>
                    {`${version.version}`}
                  </text>
                  <circle cx={labelProps.x} cy={labelProps.y} r={3} />
                  <text {...labelProps}>
                    {`${channel.channel}`}
                  </text>
                </g>
              ));
            }
            return (
              <g
                key={`line-${key}`}
                className='channel-line'
              >
                <path
                  stroke={color}
                  strokeWidth={alpha === 1 ? 2 : 1}
                  strokeOpacity={alpha}
                  d={path(channel.dates)}
                />
              </g>
            );
          });
        });
        return (
          <g key={`${versionIdx}`}>
            {$channels}
          </g>
        );
      });
      const $yAxis = [...yScales].map(([field, yScale]) => {
        const formatTick = format(this.props.format);
        return yScale.ticks(tickCount).map((tick, idx) => {
          const y = yScale(tick);
          let label = formatTick(tick);
          if (!idx && this.props.unit) {
            label += this.props.unit;
          }
          return (
            <g className={cx('tick', 'tick-y', { 'tick-axis': idx === 0, 'tick-secondary': idx > 0 })} key={`tick-${tick}`}>
              <line
                x1={50}
                y1={y}
                x2={this.width}
                y2={y}
              />
              <text
                x={0}
                y={y}
              >
                {label}
              </text>
            </g>
          );
        });
      });
      const yFormat = timeFormat('%b');
      const $xAxis = xScale.ticks().map((tick, idx) => {
        const x = xScale(tick);
        const label = yFormat(tick);
        const $lines = yRangeFields.map((field) => {
          const band = yBandScale(field);
          return (
            <line
              key={`x-axis-${field}`}
              x1={x}
              y1={band}
              x2={x}
              y2={band + yBandScale.bandwidth()}
            />
          );
        });
        return (
          <g className={cx('tick', 'tick-x')} key={`tick-${label}`}>
            {$lines}
            <text
              x={x}
              y={this.height}
            >
              {label}
            </text>
          </g>
        );
      });
      const fieldLabels = {
        // p25Avg: '25th Percentile',
        p50Avg: '50th Percentile',
        p95Avg: '95th Percentile',
      };
      const $fields = yRangeFields.map((field) => {
        const label = fieldLabels[field] || field;
        const y = yBandScale(field);
        // transform={`translate(${20}, ${y + 100}) rotate(-90)`}
        return (
          <g className={cx('title')} key={`title-${field}`}>
            <text
              x={75}
              y={y}
            >
              {label}
            </text>
          </g>
        );
      });
      svg = (
        <svg
          height={this.height}
          width={this.width}
        >
          {$yAxis}
          {$xAxis}
          {$fields}
          {$evolutions}
          {$labels}
        </svg>
      );
    } else {
      svg = 'Loading …';
    }

    const cls = cx('graphic-timeline', {
      'state-loading': !evolutions,
    });

    const params = {
      aggregates: 'median!95th-percentile',
      measure: query.metric,
      os: 'Windows_NT',
      product: 'Firefox',
      sanitize: '1',
      e10s: query.e10sEnabled ? 'true' : 'false',
      use_submission_date: '0',
    };
    if (query.child) {
      params.processType = query.child;
    }
    const source = `https://telemetry.mozilla.org/new-pipeline/evo.html#!${stringify(params)}`;

    return (
      <Dashboard
        title={`Quantum Nightly Telemetry: ${this.props.title}`}
        subtitle={this.props.subtitle}
        className='dashboard-metric'
        note='14-day Moving Median'
        source={source}
        sourceTitle={`${query.metric} (t.m.o)`}
        link='https://bit.ly/quantum-dashboards'
      >
        <section
          className={cls}
          ref={target => (this.target = target)}
        >
          {svg}
        </section>
      </Dashboard>
    );
  }
}

ChannelMetric.defaultProps = {
  query: '',
  title: '',
  subtitle: '',
  format: '.1f',
  unit: '',
};
ChannelMetric.propTypes = {
  query: PropTypes.object,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  format: PropTypes.string,
  unit: PropTypes.string,
};
