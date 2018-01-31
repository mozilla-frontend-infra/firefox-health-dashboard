/* global fetch */
import 'babel-polyfill';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { maxBy, minBy } from 'lodash/fp';
import { curveLinear, line, scaleTime, scaleLinear, format, timeFormat } from 'd3';
import Widget from './widget';

const tickCount = 5;
const noise = 1000 * 60 * 60 * 12;

export default class BenchmarkWidget extends React.Component {
  state = {};

  componentDidMount() {
    this.fetch();
  }

  viewport: [0, 0];

  async fetch() {
    const id = this.props.id;
    try {
      const evolution = await (await fetch(`/api/perf/benchmark/${id}`)).json();
      this.setState({ evolution: evolution });
    } catch (e) {
      this.setState({ error: true });
    }
  }

  render() {
    const { evolution } = this.state;
    const { metric, targetDiff, type } = this.props;
    const scatter = type === 'scatter';
    let reading = '';
    let svg = null;

    if (evolution) {
      const [width, height] = this.viewport;

      const xRange = [
        minBy('date', evolution).date - (scatter ? noise * 4 : 0),
        maxBy('date', evolution).date + (scatter ? noise * 4 : 0),
      ];
      const yRange = [
        Math.min(minBy(metric, evolution)[metric], 0),
        maxBy(metric, evolution)[metric],
      ];
      const xScale = scaleTime().domain(xRange).range([25, width]);
      const yScale = scaleLinear().domain(yRange).nice(tickCount).range([height - 20, 2]);
      const path = line()
        .x(d => xScale(new Date(d.date)))
        .y(d => yScale(d[metric]))
        .curve(curveLinear);

      const $history = scatter
        ? evolution.map((entry, idx) => {
          return (
            <circle
              cx={xScale(entry.date - noise / 2 + Math.random() * noise)}
              cy={yScale(entry[metric])}
              r={4}
              key={`scatter-${idx}`}
              className={'series series-0'}
            />
          );
        })
        : <path d={path(evolution)} className={'series series-path series-0'} />;

      const topArea = Math.min(yScale.range()[0], yScale(targetDiff));

      const $area = (
        <rect
          x={xScale.range()[0]}
          y={yScale(targetDiff)}
          width={xScale.range()[0] + xScale.range()[1]}
          height={yScale.range()[0] - yScale(targetDiff)}
          className={'series series-area series-target'}
        />
      );
      const $path = (
        <line
          x1={xScale.range()[0]}
          y1={yScale(0)}
          x2={xScale.range()[1]}
          y2={yScale(0)}
          className={'series series-path series-target'}
        />
      );

      if (!scatter) {
        reading = `${evolution[evolution.length - 1][metric].toFixed(2)}%`;
      }

      const formatTick = format('.0d');
      const $yAxis = yScale.ticks(tickCount).map((tick, idx) => {
        const y = yScale(tick);
        const label = `${formatTick(tick)}%`;
        return (
          <g
            className={cx('tick', 'tick-y', { 'tick-axis': idx === 0, 'tick-secondary': idx > 0 })}
            key={`tick-${idx}`}
          >
            <line x1={0} y1={y} x2={width} y2={y} />
            <text x={2} y={y}>
              {label}
            </text>
          </g>
        );
      });
      const yFormat = timeFormat('%b %d');
      const $xAxis = xScale.ticks(10).map((tick, idx) => {
        const x = xScale(tick);
        const label = yFormat(tick);
        return (
          <g className={cx('tick', 'tick-x')} key={`tick-${idx}`}>
            <text x={x} y={height - 5}>
              {label}
            </text>
          </g>
        );
      });
      let label = 'Chrome';
      if (targetDiff) {
        label += ` + ${targetDiff}% band`;
      }
      const $legend = (
        <text
          className={'legend series-target'}
          x={xScale.range()[0] + 5}
          y={Math.min(yScale(0) + 15, topArea + 15)}
          key={'legend-target'}
        >
          {label}
        </text>
      );

      svg = (
        <svg height={height} width={width}>
          {$yAxis}
          {$xAxis}
          {$area}
          {$path}
          {$history}
          {$legend}
        </svg>
      );
    } else {
      svg = 'Loading Benchmark …';
    }

    return (
      <Widget
        target='No regressions'
        reading={reading}
        className='graphic-widget graphic-timeline widget-benchmark'
        content={svg}
        loading={!evolution}
        viewport={size => (this.viewport = size)}
        {...this.props}
      />
    );
  }
}

BenchmarkWidget.defaultProps = {
  id: '',
  metric: 'diff',
  type: 'scatter',
  targetDiff: 0,
};
BenchmarkWidget.propTypes = {
  id: PropTypes.string,
  metric: PropTypes.string,
  type: PropTypes.string,
  targetDiff: PropTypes.number,
};
