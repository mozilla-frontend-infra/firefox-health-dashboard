/* global fetch */
import 'babel-polyfill';
import React from 'react';
import PropTypes from 'prop-types';
import { curveMonotoneX, line, scaleTime, scaleLinear, scaleOrdinal, schemeCategory10 } from 'd3';
import moment from 'moment';
import cx from 'classnames';
import find from 'lodash/fp/find';
import sumBy from 'lodash/fp/sumBy';
import Dashboard from './../dashboard';
import SETTINGS from '../settings';

const rateRange = [0, 5.5];
const colorScale = scaleOrdinal(schemeCategory10);
const center = 0.62;
const full = 0.38;
const split = 0.62 / 4;

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
    function fixDate(list, field = 'date') {
      list.forEach((entry) => {
        if (entry[field]) {
          entry[field] = moment(entry[field], 'YYYY MM DD').toDate();
        }
      });
    }
    // parallel
    const raw = await Promise.all([
      fetch(`${SETTINGS.backend}/api/crashes/beta/builds`),
      fetch(`${SETTINGS.backend}/api/release/history?tailVersion=6&major=1`),
      fetch(`${SETTINGS.backend}/api/release/calendar`),
    ]);
    const [crashes, history, calendar] = await Promise.all(raw.map(buffer => buffer.json()));
    crashes.forEach(({ builds }) => {
      fixDate(builds, 'release');
      fixDate(builds, 'date');
      fixDate(builds, 'startDate');
      builds.forEach(({ dates }) => fixDate(dates));
    });
    fixDate(history);
    history.reverse();
    fixDate(calendar);
    const planned = calendar[0];
    this.setState({
      crashes,
      history,
      planned,
    });
  }
  renderRelease({ release, start, yScale, idx, crashes }) {
    const { gridY, gridX } = this.props;
    const builds = crashes ? crashes.builds : [];
    if (!builds.length) {
      console.log('Skipped', release.version);
      return null;
    }
    let wide = this.width;
    let ratio = split;
    let x = wide * (center - ratio * idx);
    const current = idx === -1;
    if (current) {
      wide -= 2;
      ratio = full;
      x = wide - 2;
    }
    const hoursRange = [0, sumBy('hours')(builds)];
    const dateRange = [start, release.date];
    const xScale = scaleTime().domain(dateRange).range([-ratio * wide, 0]);
    const lastDayX = Math.min(xScale(builds.slice(-1)[0].date), 0);
    const hoursScale = scaleTime().domain(hoursRange).range([-ratio * wide, lastDayX]);
    const path = line().x(d => xScale(d.date)).y(d => yScale(d.rate)).curve(curveMonotoneX);
    // const area = d3.svg.area()
    //   .x(d => xScale(d.date))
    //   .y0(d => yScale(d.rate - d.variance))
    //   .y1(d => yScale(d.rate + d.variance))
    //   .interpolate('monotone');
    let hoursX = 0;
    const candidates = builds.map((candidate, cidx) => {
      if (candidate.hours) {
        hoursX += candidate.hours;
      }
      return this.renderCandidate({
        release: candidate,
        idx: cidx,
        rate: candidate.rate,
        xScale,
        yScale,
        hoursScale,
        hoursX,
        path,
      });
    });
    if (current) {
      candidates.push(
        <g
          key='release-today'
          className='release-today'
          style={{
            transform: `translateX(${xScale(new Date())}px)`,
          }}
        >
          <line x1={0} y1={gridY * 3} x2={0} y2={gridY * 5} />
        </g>,
      );
    }
    const mainRates = builds
      .map((entry) => {
        return {
          rate: entry.rate,
          variance: entry.variance,
          date: entry.release || entry.date,
        };
      })
      .filter(({ rate }) => rate > 0);
    const contentRates = builds
      .map((entry) => {
        return {
          rate: entry.contentRate,
          variance: entry.variance,
          date: entry.release || entry.date,
        };
      })
      .filter(({ rate }) => rate > 0);
    const version = +release.version;
    const color = colorScale(version);
    const cls = cx('release', {
      'state-current': current,
    });
    return (
      <g
        key={`release-${idx}`}
        className={cls}
        style={{
          transform: `translateX(${x}px)`,
        }}
      >
        <line className='release-tick' x1={0} y1={0} x2={0} y2={this.height} />
        <text
          className='release-label'
          key='release-label'
          textAnchor='middle'
          x={-ratio * wide / 2}
          y={gridY * 2.5}
        >
          {version}
        </text>
        <text
          className='release-date'
          key='release-date'
          textAnchor='end'
          y={this.height - gridY / 2}
          x={-gridX}
        >
          {moment(release.date).format('MMM D')}
        </text>
        {candidates}
        <path className='release-line' key='release-line' stroke={color} d={path(mainRates)} />
        <path
          className='release-line-content'
          key='release-line-content'
          stroke={color}
          d={path(contentRates)}
        />
      </g>
    );
  }

  renderCandidate({
    release,
    xScale,
    yScale,
    rate,
    // hoursScale,
    // hoursX,
    idx,
  }) {
    const color = colorScale(idx);
    const start = release.release || release.date;
    const mainRate = yScale(release.rate);
    const contentRate = yScale(release.contentRate);
    const title = `${(release.hours / 1000).toFixed(1)}m usage hours`;
    // const hoursStart = hoursScale(hoursX - (release.hours || 0));
    // const hourWidth = hoursScale(hoursX) - hoursStart;
    const { gridY } = this.props;
    console.log(gridY);
    const topY = gridY * 5;
    const cls = cx('candidate', {
      'candidate-no-signal': !rate,
      'candidate-has-signal': rate,
    });
    return (
      <g key={`candidate-${release.build}`} className={cls}>
        <g
          style={{
            transform: `translateX(${xScale(start)}px)`,
          }}
        >
          <line
            className='candidate-marker'
            x1={0}
            y1={mainRate - 5}
            x2={0}
            y2={mainRate + 5}
            stroke={color}
          />
          <line
            className='candidate-marker'
            x1={0}
            y1={contentRate - 2}
            x2={0}
            y2={contentRate + 2}
            stroke={color}
          />
          <line
            className='candidate-tick'
            key='candidate-tick-high'
            x1={0}
            y1={topY + 5}
            x2={0}
            y2={topY - 5}
            stroke={color}
          />
          <text className='candidate-label' textAnchor='middle' y={topY - gridY} stroke={color}>
            {release.candidate || '?'}
          </text>
          <title>
            {title}
          </title>
        </g>
        {/* <rect
          className='candidate-hours'
          key='candidate-hours'
          x={hoursStart}
          y={this.height - 40}
          width={hourWidth}
          height={7}
          fill={color}
        /> */}
      </g>
    );
  }

  render() {
    const { crashes, history, planned } = this.state;
    let svg = null;
    let details = null;

    if (crashes) {
      const yScale = scaleLinear().domain(rateRange).range([this.height - 30, 100]).clamp(true);

      const axis = [];
      for (let i = rateRange[0] + 1; i < rateRange[1]; i += 1) {
        const y = yScale(i);
        axis.push(
          <g
            key={`axis-rate-${i}`}
            className='axis-rate'
            style={{
              transform: `translateY(${y}px)`,
            }}
          >
            <line x1={0} y1={0} x2={this.width} y2={0} />
            <text x={5} y={5} textAnchor='start'>
              {i}
            </text>
          </g>,
        );
      }

      const hasNext = find({ version: planned.version })(crashes);
      const timeline =
        hasNext && hasNext.rate ? [planned].concat(history.slice(0, 4)) : history.slice(0, 5);

      const releases = timeline.map((release, idx) => {
        const before = timeline[idx + 1] || history[idx];
        const start = before.date;
        return this.renderRelease({
          release,
          idx: idx - 1,
          crashes: find({ version: release.version })(crashes),
          start,
          yScale,
        });
      });
      details = timeline
        .map(({ version }, idx) => {
          const scores = [];
          const entry = find({ version: version })(crashes);
          if (entry && entry.rate) {
            scores.push(
              <div className='score' key='score-avg'>
                <span className='score-label'>Avg per Build</span>
                <span className='score-main'>
                  {entry.rate.toFixed(1)}
                  <span className='score-extra'>
                    {entry.contentRate.toFixed(1)}
                  </span>
                </span>
              </div>,
            );
            if (!idx) {
              const crash = find({ version: entry.version })(crashes);
              const last = find(({ rate }) => rate)(crash.builds);
              scores.push(
                <div className='score' key='score-last'>
                  <span className='score-label'>
                    Beta {last.candidate}
                  </span>
                  <span className='score-main'>
                    {last.rate.toFixed(1)}
                    <span className='score-extra'>
                      {last.contentRate.toFixed(1)}
                    </span>
                  </span>
                </div>,
              );
            }
          }
          const cls = cx('scores', {
            'state-highlight': !idx,
            'state-empty': !scores.length,
          });
          const key = `score-${idx}`;
          return (
            <div
              key={key}
              className={cls}
              style={{
                width: `${(idx ? split : full) * 100}%`,
              }}
            >
              {scores}
            </div>
          );
        })
        .reverse();

      svg = (
        <svg height={this.height} width={this.width}>
          {axis}
          {releases}
        </svg>
      );
    } else {
      svg = 'Loading …';
    }

    const cls = cx('graphic-timeline', {
      'state-loading': !crashes,
    });

    return (
      <Dashboard
        title='Firefox Beta Stability'
        subtitle='Main & Content C/1kUH (E10S Only)'
        className='crashes-beta'
      >
        <section className={cls} ref={target => (this.target = target)}>
          {svg}
        </section>
        <section className='graphic-details'>
          {details}
        </section>
      </Dashboard>
    );
  }
}

FirefoxBeta.defaultProps = {};
FirefoxBeta.propTypes = {
  gridX: PropTypes.number,
  gridY: PropTypes.number,
};
