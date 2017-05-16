/* global fetch */
import 'babel-polyfill';
import React from 'react';
import PropTypes from 'prop-types';
import { maxBy, minBy } from 'lodash/fp';
import cx from 'classnames';
// import moment from 'moment';
import { curveLinear, line, scaleTime, scaleLinear, scalePow, scaleBand, format, timeFormat } from 'd3';
import { stringify } from 'query-string';
import Dashboard from './../dashboard';

const tickCount = 4;

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
    const signatures = this.props.signatures;
    // 'ac46ba40f08bbbf209a6c34b8c054393bf222e67';
    // b68e2b084272409d7def3928a55baf0e00f3888a
    try {
      const raw = await fetch(`api/perf/herder?signature=${signatures}`);
      const evolutions = await raw.json();
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
        .range([10, this.width - 5]);
      const yScale = scaleLinear()
        .domain(yRange)
        .nice(tickCount)
        .range([this.height - 20, 10]);
      const path = line()
        .x(d => xScale(new Date(d.time * 1000)))
        .y(d => yScale(d.avg))
        .curve(curveLinear);
      const $evolutions = evolutions.map((evolution, idx) => {
        const $path = (
          <path
            d={path(evolution)}
            className={`series series-${idx}`}
          />
        );
        const $scatters = evolution.reduce((reduced, entry) => {
          entry.runs.forEach((run) => {
            reduced.push((
              <circle
                cx={xScale(run.time * 1000)}
                cy={yScale(run.value)}
                r={3}
                className={`series series-${idx}`}
              />
            ));
          }, reduced);
          return reduced;
        }, []);
        return [
          $path,
          $scatters,
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
              x={0}
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
        console.log(label);
      // const $lines = yRangeFields.map((field) => {
      //   const band = yBandScale(field);
      //   return (
      //     <line
      //       key={`x-axis-${field}`}
      //       x1={x}
      //       y1={band}
      //       x2={x}
      //       y2={band + yBandScale.bandwidth()}
      //     />
      //   );
      // });
        return (
          <g className={cx('tick', 'tick-x')} key={`tick-${label}`}>
            <text
              x={x}
              y={this.height}
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
          {$evolutions}
        </svg>
      );
    } else {
      svg = 'Loading …';
    }

    const linkArgs = this.props.signatures.split(',').map((signature) => {
      return `series=[mozilla-central,${signature},1,1]`;
    }).concat(['timerange=7776000']).join('&');
    const link = `https://treeherder.mozilla.org/perf.html#/graphs?${linkArgs}`;
    const cls = cx('graphic-timeline graphic-widget', {
      'state-loading': !evolutions,
    });

    return (
      <section
        className={cls}
      >
        <header><span>
          Talos:
          <a
            href={link}
            target='_blank'
            rel='noopener noreferrer'
          >
            {this.props.title}
          </a>
        </span></header>
        <div
          className='widget-content'
          ref={target => (this.target = target)}
        >
          {svg}
        </div>
      </section>
    );
  }
}

ChannelMetric.defaultProps = {
  signatures: '',
};
ChannelMetric.propTypes = {
  // query: PropTypes.object,
  signatures: PropTypes.string,
  title: PropTypes.string,
  // format: PropTypes.string,
  // unit: PropTypes.string,
};
