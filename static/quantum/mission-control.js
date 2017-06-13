/* global fetch */
import 'babel-polyfill';
import React from 'react';
import PropTypes from 'prop-types';
import { min, maxBy, minBy } from 'lodash/fp';
import { curveLinear, line, scaleTime, scaleLinear, format, timeFormat, area } from 'd3';
import cx from 'classnames';
import moment from 'moment';
import { stringify } from 'query-string';
import Widget from './widget';

const simpleMarkdown = (text) => {
  return (
    text &&
    text
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(
        /\[([^\]]+)\]\(([^)]+)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</em>',
      )
  );
};
const tickCount = 4;

export default class MissionControlWidget extends React.Component {
  state = {};
  componentDidMount() {
    this.fetch();
  }

  viewport: [0, 0];

  async fetch() {
    const { metric } = this.props;
    if (!metric) {
      return;
    }
    const query = stringify({
      metric,
    });
    try {
      const evolution = await (await fetch(`/api/perf/mission-control?${query}`)).json();
      this.setState({ evolution: evolution });
    } catch (e) {
      this.setState({ error: true });
    }
  }

  render() {
    const { evolution } = this.state;
    const { metric, formatting } = this.props;
    // if (!metric) {
    console.log(this.props);
    // }
    const measurements = this.props.measurements || this.props.content;
    let svg = null;

    if (evolution) {
      const [width, height] = this.viewport;
      const xRange = [minBy('time', evolution).time, maxBy('time', evolution).time];
      const yRange = [0, maxBy('value', evolution).value];
      const xScale = scaleTime().domain(xRange).range([25, width]);
      const yScale = scaleLinear().domain(yRange).nice(tickCount).range([height - 20, 2]);
      const path = line()
        .x(d => xScale(new Date(d.time)))
        .y(d => yScale(d.value))
        .curve(curveLinear);

      const $evolution = <path d={path(evolution)} className={'series series-path'} />;

      const formatTick = format(formatting === '%' ? '.1%' : '.3f');
      const $yAxis = yScale.ticks(tickCount).map((tick, idx) => {
        const y = yScale(tick);
        const label = formatTick(tick);
        return (
          <g
            className={cx('tick', 'tick-y', { 'tick-axis': idx === 0, 'tick-secondary': idx > 0 })}
            key={`tick-${tick}`}
          >
            <line x1={0} y1={y} x2={width} y2={y} />
            <text x={2} y={y}>
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
          <g className={cx('tick', 'tick-x')} key={`tick-${idx}`}>
            <text x={x} y={height - 5}>
              {label}
            </text>
          </g>
        );
      });

      svg = (
        <svg height={height} width={width}>
          {$yAxis}
          {$xAxis}
          {$evolution}
        </svg>
      );
    } else if (!metric && measurements) {
      const contents = Array.isArray(measurements) ? measurements : measurements.split(/\s*;\s+/);
      console.log(contents);
      svg = contents.map((content, idx) => {
        return (
          <div
            className='widget-entry'
            key={`entry-${idx}`}
            // eslint-disable-next-line
            dangerouslySetInnerHTML={{ __html: simpleMarkdown(content) }}
          />
        );
      });
    } else {
      svg = 'Loading Mission Control …';
    }

    return (
      <Widget
        {...this.props}
        className='graphic-widget graphic-timeline'
        content={svg}
        loading={!evolution}
        viewport={size => (this.viewport = size)}
      />
    );
  }

  // render() {
  //   const measurements = this.props.measurements || this.props.content;
  //   const contents = Array.isArray(measurements)
  //     ? measurements
  //     : measurements.split(/\s*;\s+/);
  //   const $content = contents.map((content, idx) => {
  //     return (
  //       <div
  //         className='widget-entry'
  //         key={`entry-${idx}`}
  //         // eslint-disable-next-line
  //         dangerouslySetInnerHTML={{ __html: simpleMarkdown(content) }}
  //       />
  //     );
  //   });
  //
  //   return (
  //     <Widget
  //       {...this.props}
  //       link='https://mana.mozilla.org/wiki/display/PI/Mission+Control'
  //       loading={$content.length === 0}
  //       content={$content.length ? $content : 'Loading Mission Control …'}
  //     />
  //   );
  // }
}

MissionControlWidget.propTypes = {
  content: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  measurements: PropTypes.string,
  metric: PropTypes.string,
  formatting: PropTypes.string,
};
