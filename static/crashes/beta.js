/* global fetch */
import 'babel-polyfill';
import React from 'react';
import d3 from 'd3';
import moment from 'moment';
import filter from 'lodash/filter';
import matches from 'lodash/matches';


export default class FirefoxBeta extends React.Component {
  state = {};

  componentDidMount() {
    this.fetch();
    this.height = document.getElementById(this.target).offsetHeight;
    this.width = document.getElementById(this.target).offsetWidth;
  }

  rateRange = [2, 8];
  colorScale = d3.scale.category20();
  center = 0.62;
  full = 0.38;
  split = 0.62 / 3;
  target = `graphic-${((Math.random() * 10000) | 0)}`;

  async fetch() {
    function fixDate(list, field = 'date') {
      list.forEach((entry) => {
        if (entry[field]) {
          entry[field] = new Date(entry[field]);
        }
      });
    }
    const crashes = await (await fetch('/api/crashes/beta/builds')).json();
    fixDate(crashes);
    fixDate(crashes, 'release');
    fixDate(crashes, 'startDate');
    crashes.forEach(({ dates }) => {
      fixDate(dates);
    });
    const history = await (await fetch('/api/release/history?tailVersion=6')).json();
    fixDate(history);
    history.reverse();
    const calendar = await (await fetch('/api/release/calendar')).json();
    fixDate(calendar);
    const planned = calendar[0];
    this.setState({
      crashes,
      history,
      planned,
    });
  }

  renderRelease({ release, start, yScale, idx, crashes }) {
    const { center } = this;
    let { split, width } = this;
    let x = width * (center - split * idx);
    if (idx === -1) {
      width -= 2;
      split = this.full;
      x = width - 2;
    }
    const dateRange = [start, release.date];
    const xScale = d3.time.scale()
      .domain(dateRange)
      .range([-split * width, 0])
      .clamp(true);
    const path = d3.svg.line()
			.x((d) => xScale(d.date))
			.y((d) => yScale(d.rate))
      .interpolate('monotone');
    const area = d3.svg.area()
			.x((d) => xScale(d.date))
			.y0((d) => yScale(d.rate - d.variance))
      .y1((d) => yScale(d.rate + d.variance))
      .interpolate('monotone');
    const candidates = crashes.map((candidate, cidx) => {
      return this.renderCandidate({
        release: candidate,
        idx: cidx,
        xScale,
        yScale,
        path,
      });
    });
    if (idx === -1) {
      candidates.push(
        <g
          key='release-today'
          className='release-today'
          style={{
            transform: `translateX(${xScale(new Date())}px)`,
          }}
        >
          <line
            x1={0}
            y1={100}
            x2={0}
            y2={this.height - 30}
          />
        </g>
      );
    }
    const avgs = crashes
      .map((entry) => {
        return {
          rate: entry.rate,
          variance: entry.variance,
          date: entry.release || entry.date,
        };
      })
      .filter(({ rate }) => rate > 0);
    const version = +(release.version.major || release.version);
    const color = this.colorScale(version - 43);
    return (
      <g
        key={`release-${idx}`}
        className='release'
        style={{
          transform: `translateX(${x}px)`,
        }}
      >
        <line
          className='release-tick'
          x1={0}
          y1={0}
          x2={0}
          y2={this.height}
        />
        <text
          className='release-label'
          textAnchor='middle'
          x={-split * width / 2}
          y={50}
        >
          {version}
        </text>
        <text
          className='release-date'
          textAnchor='end'
          y={this.height - 5}
          x={-5}
        >
          {moment(release.date).format('MMM Do')}
        </text>
        {candidates}
        <path
          className='release-line'
          stroke={color}
          d={path(avgs)}
        />
        <path
          className='release-area'
          fill={color}
          d={area(avgs)}
        />
      </g>
    );
  }

  renderCandidate({ release, xScale, yScale, path, idx }) {
    const color = this.colorScale(idx);
    const start = release.release || release.date;
    const rate = yScale(release.rate);
    return (
      <g
        key={`candidate-${release.build}`}
        className='candidate'
      >
        <g
          style={{
            transform: `translateX(${xScale(start)}px)`,
          }}
        >
          <circle
            className='candidate-marker'
            cx={0}
            cy={rate || 100}
            r={3}
            fill={color}
          />
          <line
            className='candidate-tick'
            x1={0}
            y1={105}
            x2={0}
            y2={95}
            stroke={color}
          />
          <line
            className='candidate-tick'
            x1={0}
            y1={this.height - 40}
            x2={0}
            y2={this.height - 30}
            stroke={color}
          />
          <text
            className='candidate-label'
            textAnchor='middle'
            y={90}
            stroke={color}
          >
            {release.candidate || '?'}
          </text>
        </g>
        <path
          className='candidate-rate'
          stroke={color}
          d={path(release.dates)}
        />
      </g>
    );
  }

  render() {
    const { crashes, history, planned } = this.state;
    if (!crashes) {
      return (
        <div
          className='dashboard crashes-beta'
        >
          <div
            id={this.target}
            className='graphic state-loading'
          >
            <strong>Loading …</strong>
          </div>
        </div>
      );
    }

    const yScale = d3.scale.linear()
      .domain(this.rateRange)
      .range([this.height - 30, 100])
      .clamp(true);

    const axis = [];
    for (let i = this.rateRange[0] + 1; i < this.rateRange[1]; i++) {
      const y = yScale(i);
      axis.push(
        <g
          className='axis-rate'
          style={{
            transform: `translateY(${y}px)`,
          }}
        >
          <line
            x0={0}
            y0={0}
            x1={this.width}
            y1={0}
          />
          <text
            x={5}
            y={5}
            textAnchor='start'
          >
            {i}
          </text>
        </g>
      );
    }

    const releases = history.slice(0, 3).map((release, idx) => {
      return this.renderRelease({
        release,
        idx,
        crashes: filter(
          crashes,
          matches({ version: release.version.full })
        ),
        start: history[idx + 1].date,
        yScale,
      });
    });
    releases.push(
      this.renderRelease({
        release: planned,
        idx: -1,
        crashes: filter(
          crashes,
          matches({ version: planned.version })
        ),
        start: history[0].date,
        yScale,
      })
    );
    return (
      <div
        className='dashboard crashes-beta'
      >
        <div
          id={this.target}
          className='graphic state-loaded'
        >
          <svg
            height={this.height}
            width={this.width}
          >
            {axis}
            {releases}
          </svg>
        </div>
      </div>
    );
  }
}

FirefoxBeta.defaultProps = {
};
FirefoxBeta.propTypes = {
};
