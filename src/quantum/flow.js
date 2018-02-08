/* global fetch */
import React from 'react';
import { maxBy, minBy } from 'lodash/fp';
import cx from 'classnames';
// import moment from 'moment';
import { curveLinear, line, scaleTime, scaleLinear, format, timeFormat, area } from 'd3';
import Widget from './widget';
import SETTINGS from '../settings';

const tickCount = 4;

export default class FlowWidget extends React.Component {
  state = {};

  componentDidMount() {
    this.fetch();
  }

  viewport: [0, 0];

  async fetch() {
    const burnup = await (await fetch(`${SETTINGS.backend}/api/bz/burnup`)).json();
    this.setState({ burnup });
  }

  render() {
    const { burnup } = this.state;
    let svg = null;

    if (burnup) {
      const [width, height] = this.viewport;
      const xRange = [
        minBy('date', burnup).date,
        maxBy('date', burnup).date,
      ];
      const yRange = [
        0,
        maxBy('total', burnup).total,
      ];
      const xScale = scaleTime()
        .domain(xRange)
        .range([25, width]);
      const yScale = scaleLinear()
        .domain(yRange)
        .nice(tickCount)
        .range([height - 20, 2]);
      const pathClosed = line()
        .x(d => xScale(new Date(d.date)))
        .y(d => yScale(d.closed))
        .curve(curveLinear);
      const pathTotal = line()
        .x(d => xScale(new Date(d.date)))
        .y(d => yScale(d.total))
        .curve(curveLinear);

      const areaClosed = area()
        .x(d => xScale(new Date(d.date)))
        .y0(() => yScale(0))
        .y1(d => yScale(d.closed))
        .curve(curveLinear);
      const areaTotal = area()
        .x(d => xScale(new Date(d.date)))
        .y0(d => yScale(d.total))
        .y1(d => yScale(d.closed))
        .curve(curveLinear);
      const $pathTotal = (
        <path
          d={pathTotal(burnup)}
          key='path-total'
          className={'series series-path series-open'}
        />
      );
      const $pathClosed = (
        <path
          d={pathClosed(burnup)}
          key='path-closed'
          className={'series series-path series-closed'}
        />
      );
      const $areaTotal = (
        <path
          d={areaTotal(burnup)}
          key='area-open'
          className={'series series-area series-open'}
        />
      );
      const $areaClosed = (
        <path
          d={areaClosed(burnup)}
          key='area-closed'
          className={'series series-area series-closed'}
        />
      );

      const formatTick = format('.0d');
      const $yAxis = yScale.ticks(tickCount).map((tick, idx) => {
        const y = yScale(tick);
        const label = formatTick(tick);
        // if (!idx && this.props.unit) {
        //   label += this.props.unit;
        // }
        return (
          <g className={cx('tick', 'tick-y', { 'tick-axis': idx === 0, 'tick-secondary': idx > 0 })} key={`tick-${tick}`}>
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
      const $xAxis = xScale.ticks(6).map((tick) => {
        const x = xScale(tick);
        const label = yFormat(tick);
        return (
          <g className={cx('tick', 'tick-x')} key={`tick-${tick}`}>
            <text
              x={x}
              y={height - 5}
            >
              {label}
            </text>
          </g>
        );
      });

      const $legends = [
        <text
          className={'legend series-closed'}
          x={27}
          y={15}
          key={'legend-closed'}
        >
          Completed
        </text>,
        <text
          className={'legend series-open'}
          x={92}
          y={15}
          key={'legend-open'}
        >
          Nominated
        </text>,
      ];

      svg = (
        <svg
          height={height}
          width={width}
        >
          {$yAxis}
          {$xAxis}
          {$areaTotal}
          {$areaClosed}
          {$pathTotal}
          {$pathClosed}
          {$legends}
        </svg>
      );
    } else {
      svg = 'Loading Bugzilla …';
    }

    return (
      <Widget
        title='Quantum Flow P1 Bugs Burnup'
        className='graphic-timeline graphic-widget'
        link='https://wiki.mozilla.org/Quantum/Flow#Query:_P1_Bugs'
        target='*Fix P1 Bugs*'
        loading={!burnup}
        viewport={size => (this.viewport = size)}
        content={svg}
      />
    );
  }
}

FlowWidget.defaultProps = {
};
FlowWidget.propTypes = {
};
