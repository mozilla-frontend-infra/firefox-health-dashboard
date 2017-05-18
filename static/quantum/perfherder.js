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

export default class PerfherderWidget extends React.Component {
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
    const signatures = this.props.signatures;
    const query = stringify({
      signatures: Object.values(signatures),
    });
    try {
      const evolutions = await (await fetch(`api/perf/herder?${query}`)).json();
      this.setState({ evolutions: evolutions });
    } catch (e) {
      this.setState({ error: true });
    }
  }

  render() {
    const { evolutions } = this.state;
    let svg = null;

    if (evolutions) {
      const full = evolutions.reduce((reduced, evolution) => {
        return reduced.concat(evolution);
      }, []);
      const xRange = [
        minBy('time', full).time * 1000,
        maxBy('time', full).time * 1000,
      ];
      const yRange = [
        minBy('value', full).value,
        maxBy('value', full).value,
      ];
      const xScale = scaleTime()
        .domain(xRange)
        .range([25, this.width]);
      const yScale = scaleLinear()
        .domain(yRange)
        .nice(tickCount)
        .range([this.height - 20, 2]);
      const path = line()
        .x(d => xScale(new Date(d.time * 1000)))
        .y(d => yScale(d.avg))
        .curve(curveLinear);
      const filledPath = area()
        .x(d => xScale(new Date(d.time * 1000)))
        .y0(d => yScale(d.q1))
        .y1(d => yScale(d.q3))
        .curve(curveLinear);
      const $evolutions = evolutions.map((evolution, idx) => {
        const $path = (
          <path
            d={path(evolution)}
            className={`series series-path series-${idx}`}
          />
        );
        const $scatters = evolution.reduce((reduced, entry) => {
          entry.runs.forEach((run) => {
            reduced.push((
              <circle
                cx={xScale(run.time * 1000)}
                cy={yScale(run.value)}
                r={1.5}
                className={`series series-${idx}`}
              />
            ));
          }, reduced);
          return reduced;
        }, []);
        const $area = (
          <path
            d={filledPath(evolution)}
            className={`series series-area series-${idx}`}
          />
        );
        return [
          $scatters,
          $path,
          $area,
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
      const yFormat = timeFormat('%b');
      const $xAxis = xScale.ticks(6).map((tick, idx) => {
        const x = xScale(tick);
        const label = yFormat(tick);
        return (
          <g className={cx('tick', 'tick-x')} key={`tick-${label}`}>
            <text
              x={x}
              y={this.height - 5}
            >
              {label}
            </text>
          </g>
        );
      });

      const $legend = Object.keys(this.props.signatures).map((label, idx) => {
        const signature = this.props.signatures[label];
        return (
          <text
            className={`legend series-${idx}`}
            x={27 + (50 * idx)}
            y={15}
            key={`legend-${label}`}
          >
            {label}
          </text>
        );
      });

      const referenceX = xScale(new Date(this.props.reference));
      // console.log(referenceX);
      const $reference = (
        <line
          className='reference'
          x1={referenceX}
          y1={20}
          x2={referenceX}
          y2={this.height - 25}
        />
      );

      svg = (
        <svg
          height={this.height}
          width={this.width}
        >
          {$yAxis}
          {$xAxis}
          {$evolutions}
          {$reference}
          {$legend}
        </svg>
      );
    } else {
      svg = 'Loading Perfherder …';
    }

    const linkArgs = stringify({
      timerange: 7776000,
      series: Object.values(this.props.signatures).map((signature) => {
        return `[mozilla-central,${signature},1,1]`;
      }),
    });
    const link = `https://treeherder.mozilla.org/perf.html#/graphs?${linkArgs}`;
    const cls = cx('widget-content', {
      'state-loading': !evolutions,
    });

    return (
      <section
        className={`graphic-timeline graphic-widget status-${this.props.status}`}
      >
        <header>
          <h3><a
            href={link}
            target='_blank'
            rel='noopener noreferrer'
          >
            {this.props.title}
          </a></h3>
          <aside>Target: <em>No regressions</em></aside>
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

PerfherderWidget.defaultProps = {
  signatures: '',
  reference: '',
  status: 'red',
};
PerfherderWidget.propTypes = {
  // query: PropTypes.object,
  signatures: PropTypes.object,
  title: PropTypes.string,
  status: PropTypes.string,
  reference: PropTypes.string,
  // unit: PropTypes.string,
};
