/* global fetch */
import 'babel-polyfill';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { maxBy, minBy } from 'lodash/fp';
import { curveLinear, line, scaleTime, scaleLinear, format, timeFormat, area } from 'd3';
import Widget from './widget';

const tickCount = 5;

export default class BenchmarkWidget extends React.Component {
  state = {};

  componentDidMount() {
    this.fetch();
  }

  viewport: [0, 0];

  async fetch() {
    const id = this.props.id;
    try {
      const evolution = await (await fetch(`api/perf/benchmark/${id}`)).json();
      this.setState({ evolution: evolution });
    } catch (e) {
      this.setState({ error: true });
    }
  }

  render() {
    const { evolution } = this.state;
    let svg = null;

    if (evolution) {
      const [width, height] = this.viewport;

      const xRange = [
        minBy('time', evolution).time,
        maxBy('time', evolution).time,
      ];
      const yRange = [
        Math.min(minBy('0', evolution)[0], minBy('1', evolution)[1]),
        Math.max(maxBy('0', evolution)[0], minBy('1', evolution)[1]),
      ];
      const xScale = scaleTime()
        .domain(xRange)
        .range([25, width]);
      const yScale = scaleLinear()
        .domain(yRange)
        .nice(tickCount)
        .range([height - 20, 2]);
      const path = line()
        .x(d => xScale(new Date(d.time)))
        .y(d => yScale(d.value))
        .curve(curveLinear);
      const filledPath = area()
        .x(d => xScale(new Date(d.time)))
        .y0(d => yScale(d.value))
        .y1(d => yScale(d.value * 1.2))
        .curve(curveLinear);

      const $evolution = [0, 1].map((idx) => {
        const filtered = evolution
          .filter(entry => entry[idx])
          .map((entry) => {
            return {
              time: entry.time,
              value: entry[idx],
            };
          });
        const $path = (
          <path
            d={path(filtered)}
            className={`series series-path series-${idx}`}
          />
        );
        const $area = (idx === 0)
          ? (
            <path
              d={filledPath(filtered)}
              className={'series series-area series-target'}
            />
          )
          : null;
        return [
          $area,
          $path,
        ];
      });

      const formatTick = format('.0d');
      const $yAxis = yScale.ticks(tickCount).map((tick, idx) => {
        const y = yScale(tick);
        const label = formatTick(tick);
        // if (!idx && this.props.unit) {
        //   label += this.props.unit;
        // }
        return (
          <g className={cx('tick', 'tick-y', { 'tick-axis': idx === 0, 'tick-secondary': idx > 0 })} key={`tick-${idx}`}>
            <line
              x1={0}
              y1={y}
              x2={width}
              y2={y}
            />
            <text
              x={2}
              y={y}
            >
              {label}
            </text>
          </g>
        );
      });
      const yFormat = timeFormat('%b %d');
      const $xAxis = xScale.ticks(4).map((tick, idx) => {
        const x = xScale(tick);
        const label = yFormat(tick);
        return (
          <g className={cx('tick', 'tick-x')} key={`tick-${idx}`}>
            <text
              x={x}
              y={height - 5}
            >
              {label}
            </text>
          </g>
        );
      });
      //
      // const $legend = Object.keys(this.props.signatures).map((label, idx) => {
      //   return (
      //     <text
      //       className={`legend series-${idx}`}
      //       x={27 + (50 * idx)}
      //       y={15}
      //       key={`legend-${label}`}
      //     >
      //       {label}
      //     </text>
      //   );
      // });

      svg = (
        <svg
          height={height}
          width={width}
        >
          {$yAxis}
          {$xAxis}
          {$evolution}
          {/* {$legend} */}
        </svg>
      );
    } else {
      svg = 'Loading Perfherder …';
    }

    return (
      <Widget
        target='No regressions'
        className='graphic-widget graphic-timeline'
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
};
BenchmarkWidget.propTypes = {
  id: PropTypes.string,
};
