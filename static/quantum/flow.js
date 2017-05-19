/* global fetch */
import 'babel-polyfill';
import React from 'react';
import PropTypes from 'prop-types';
import { maxBy, minBy } from 'lodash/fp';
import cx from 'classnames';
// import moment from 'moment';
import { curveLinear, line, scaleTime, scaleLinear, scalePow, scaleBand, format, timeFormat, area } from 'd3';
import { stringify } from 'query-string';
import Dashboard from './../dashboard';

const tickCount = 4;

export default class FlowWidget extends React.Component {
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
    const burnup = await (await fetch('/api/bz/burnup')).json();
    this.setState({ burnup });
  }

  render() {
    const { burnup } = this.state;
    let svg = null;

    if (burnup) {
      const xRange = [
        minBy('date', burnup).date,
        maxBy('date', burnup).date,
      ];
      const yRange = [
        0,
        maxBy('opened', burnup).opened,
      ];
      const xScale = scaleTime()
        .domain(xRange)
        .range([25, this.width]);
      const yScale = scaleLinear()
        .domain(yRange)
        .nice(tickCount)
        .range([this.height - 20, 2]);
      const pathOpened = line()
        .x(d => xScale(new Date(d.date)))
        .y(d => yScale(d.opened - d.closed))
        .curve(curveLinear);
      const pathClosed = line()
        .x(d => xScale(new Date(d.date)))
        .y(d => yScale(d.opened))
        .curve(curveLinear);

      const areaOpen = area()
        .x(d => xScale(new Date(d.date)))
        .y0(d => yScale(0))
        .y1(d => yScale(d.opened - d.closed))
        .curve(curveLinear);
      const areaClosed = area()
        .x(d => xScale(new Date(d.date)))
        .y0(d => yScale(d.opened - d.closed))
        .y1(d => yScale(d.opened))
        .curve(curveLinear);
      const $pathOpened = (
        <path
          d={pathOpened(burnup)}
          key='path-opened'
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
      const $areaOpen = (
        <path
          d={areaOpen(burnup)}
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
              x2={this.width}
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
      const $xAxis = xScale.ticks(6).map((tick, idx) => {
        const x = xScale(tick);
        const label = yFormat(tick);
        return (
          <g className={cx('tick', 'tick-x')} key={`tick-${tick}`}>
            <text
              x={x}
              y={this.height - 5}
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
          Closed
        </text>,
        <text
          className={'legend series-open'}
          x={70}
          y={15}
          key={'legend-open'}
        >
          Open
        </text>,
      ];

      svg = (
        <svg
          height={this.height}
          width={this.width}
        >
          {$yAxis}
          {$xAxis}
          {$areaOpen}
          {$areaClosed}
          {$pathOpened}
          {$pathClosed}
          {$legends}
        </svg>
      );
    } else {
      svg = 'Loading Bugzilla …';
    }

    const cls = cx('widget-content', {
      'state-loading': !burnup,
    });

    return (
      <section
        className={'graphic-timeline graphic-widget'}
      >
        <header>
          <h3><a
            href='https://wiki.mozilla.org/Quantum/Flow#Query:_P1_Bugs'
            target='_blank'
            rel='noopener noreferrer'
          >
            P1 Bugs (Opened/Closed)
          </a></h3>
          <aside>Target: <em>Fix P1s</em></aside>
        </header>
        <div
          className={cls}
          ref={target => (this.target = target)}
        >
          {svg}
        </div>
      </section>
    );
  }
}

FlowWidget.defaultProps = {
};
FlowWidget.propTypes = {
};
