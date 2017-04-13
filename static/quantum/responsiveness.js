/* global fetch */
import 'babel-polyfill';
import React from 'react';
import cx from 'classnames';
// import moment from 'moment';
import { curveLinear, line, scaleTime, scaleLinear, scalePow } from 'd3';
import Dashboard from './../dashboard';

export default class FirefoxBeta extends React.Component {
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
    const raw = await Promise.all([
      fetch('/api/perf/version-evolutions?metric=INPUT_EVENT_RESPONSE_MS&child=content&os=Windows_NT'),
    ]);
    const [evolutions, builds] = await Promise.all(
      raw.map(buffer => buffer.json()),
    );
    this.setState({ evolutions, builds });
  }

  render() {
    const { builds, evolutions } = this.state;
    let svg = null;

    if (evolutions) {
      const yRanges = {
        'p50-avg': [Number.MAX_VALUE, Number.MIN_VALUE],
        'p95-avg': [Number.MAX_VALUE, Number.MIN_VALUE],
      };
      const yRangeFields = Object.keys(yRanges);
      evolutions.forEach((version) => {
        version.channels.forEach((channel) => {
          channel.dates.forEach((date) => {
            yRangeFields.forEach((field) => {
              if (yRanges[field][0] > date[field]) {
                yRanges[field][0] = date[field];
              } else if (yRanges[field][1] < date[field]) {
                yRanges[field][1] = date[field];
              }
            });
          });
        });
      });
      const alphaScale = scalePow()
        .exponent(0.5)
        .domain([0, evolutions.length - 1])
        .range([1, 0.1]);
      const $evolutions = evolutions.map((version, versionIdx) => {
        const xDomain = [
          new Date(version.start),
          new Date(version.end || version.release || Date.now()),
        ];
        const alpha = alphaScale(versionIdx);
        // console.log(moment(xDomain[1]).diff(xDomain[0], 'weeks', true));
        const xScale = scaleTime()
          .domain(xDomain)
          .range([0, this.width]);
        const paths = yRangeFields.map((field) => {
          const yScale = scaleLinear()
            .domain(yRanges[field])
            .range([this.height - 50, 50]);
          return line()
            .x(d => xScale(new Date(d.date)))
            .y(d => yScale(d[field]))
            .curve(curveLinear);
        });
        const $channels = version.channels.map((channel, channelIdx) => {
          const latest = (versionIdx === 0);
          console.log(latest, version.version);
          return paths.map((path, pathIdx) => {
            const color = pathIdx ? '#B6D806' : '#FF8C8E';
            return (
              <g
                key={`${versionIdx}-${channelIdx}-${pathIdx}`}
                className='channel-line'
              >
                <text
                  x={xScale(new Date(channel.dates[0].date))}
                  y={20 * (versionIdx)}
                  stroke={color}
                >
                  {`${version.version}/${channel.channel}`}
                </text>
                <path
                  stroke={color}
                  strokeWidth={latest ? 2 : 1}
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
      svg = (
        <svg
          height={this.height}
          width={this.width}
        >
          {$evolutions}
        </svg>
      );
    } else {
      svg = 'Loading …';
    }

    const cls = cx('graphic-timeline', {
      'state-loading': !builds,
    });

    return (
      <Dashboard
        title='Quantum Performance: Responsiveness'
        subtitle='Input Latency in Content'
        className='dashboard-metric'
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

FirefoxBeta.defaultProps = {
};
FirefoxBeta.propTypes = {
};
