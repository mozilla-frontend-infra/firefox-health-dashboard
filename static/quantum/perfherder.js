/* global fetch */
import 'babel-polyfill';
import React from 'react';
import PropTypes from 'prop-types';
import { min, maxBy, minBy } from 'lodash/fp';
import cx from 'classnames';
import moment from 'moment';
// import moment from 'moment';
import { curveLinear, line, scaleTime, scaleLinear, format, timeFormat, area } from 'd3';
import { stringify } from 'query-string';
import Widget from './widget';

const tickCount = 4;

export default class PerfherderWidget extends React.Component {
  state = {};

  componentDidMount() {
    this.fetch();
  }

  viewport: [0, 0];

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
      const [width, height] = this.viewport;
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
        .range([25, width]);
      const yScale = scaleLinear()
        .domain(yRange)
        .nice(tickCount)
        .range([height - 20, 2]);
      const path = line()
        .x(d => xScale(new Date(d.time * 1000)))
        .y(d => yScale(d.avg))
        .curve(curveLinear);
      const filledPath = area()
        .x(d => xScale(new Date(d.time * 1000)))
        .y0(d => yScale(d.q1))
        .y1(d => yScale(d.q3))
        .curve(curveLinear);

      const referenceTime = this.props.reference;
      const referenceX = xScale(new Date(referenceTime));
      const referenceYs = [];

      const $evolutions = evolutions.map((evolution, idx) => {
        const ref = evolution
          .find(d => moment(d.time * 1000).format('YYYY-MM-DD') === referenceTime);
        let $reference = null;
        if (ref) {
          const refY = yScale(ref.avg);
          referenceYs.push(refY);
          $reference = (
            <line
              key={`reference-${idx}`}
              className='reference reference-x'
              x1={referenceX}
              y1={refY}
              x2={width}
              y2={refY}
            />
          );
        }
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
          $reference,
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
      const yFormat = timeFormat('%b');
      const $xAxis = xScale.ticks(6).map((tick, idx) => {
        const x = xScale(tick);
        const label = yFormat(tick);
        return (
          <g className={cx('tick', 'tick-x')} key={`tick-${label}`}>
            <text
              x={x}
              y={height - 5}
            >
              {label}
            </text>
          </g>
        );
      });

      const $legend = Object.keys(this.props.signatures).map((label, idx) => {
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

      const $reference = (
        <line
          className='reference reference-y'
          x1={referenceX}
          y1={min(referenceYs)}
          x2={referenceX}
          y2={height - 25}
        />
      );

      svg = (
        <svg
          height={height}
          width={width}
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

    return (
      <Widget
        link={link}
        target='No regressions'
        className='graphic-widget graphic-timeline'
        content={svg}
        loading={!evolutions}
        viewport={size => (this.viewport = size)}
        {...this.props}
      />
    );
  }
}

PerfherderWidget.defaultProps = {
  signatures: '',
  reference: '',

};
PerfherderWidget.propTypes = {
  signatures: PropTypes.object,
  reference: PropTypes.string,
};