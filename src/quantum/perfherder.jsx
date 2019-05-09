/* global fetch */
import React from 'react';
import PropTypes from 'prop-types';
import { maxBy, min, minBy } from 'lodash/fp';
import cx from 'classnames';
import moment from 'moment';
import {
  area,
  curveLinear,
  format,
  line,
  scaleLinear,
  scaleTime,
  timeFormat,
  timeMonth,
} from 'd3';
import { withErrorBoundary } from '../vendor/errors';
import { fetchJson, URL } from '../vendor/requests';
import Widget from './widget';
import SETTINGS from '../settings';

const tickCount = 4;

class PerfherderWidget extends React.Component {
  state = {};

  async componentDidMount() {
    await this.fetch();
  }

  async fetch() {
    const { signatures, framework } = this.props;
    const signatureLabels = Object.keys(signatures);
    const splitSignatures = Object.values(signatures).reduce(
      (split, signature, idx) => {
        signature
          .split(/\s*,\s*/)
          .forEach(entry => split.set(entry, signatureLabels[idx]));

        return split;
      },
      new Map()
    );
    const evolutions = await fetchJson(
      URL({
        path: [SETTINGS.backend, 'api/perf/herder'],
        query: {
          signatures: splitSignatures.keys(),
          framework,
        },
      })
    );

    this.setState({
      evolutions,
      signatures: splitSignatures,
      signatureLabels,
    });
  }

  render() {
    const { explainer, framework } = this.props;
    const { evolutions, signatures, signatureLabels } = this.state;
    let svg = null;

    if (evolutions) {
      const busy = signatures.size > 5;
      const referenceTime = this.props.reference;
      const referenceYs = [];
      const referenceFit = referenceTime
        ? moment(referenceTime)
            .add(-5, 'days')
            .unix()
        : 0;
      const [width, height] = this.viewport;
      const full = evolutions.reduce(
        (reduced, evolution) => reduced.concat(evolution),
        []
      );
      const xRange = [
        Math.max(referenceFit, minBy('time', full).time) * 1000,
        maxBy('time', full).time * 1000,
      ];
      const yRange = [minBy('value', full).value, maxBy('value', full).value];
      const xScale = scaleTime()
        .domain(xRange)
        .range([25, width]);
      const referenceX = xScale(new Date(referenceTime));
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
      const long = evolutions.length > 3;
      const $evolutions = evolutions.map((evolution, idx) => {
        if (!evolution) {
          return null;
        }

        const ref = evolution.find(
          d => moment(d.time * 1000).format('YYYY-MM-DD') === referenceTime
        );
        let $reference = null;

        if (ref) {
          const refY = yScale(ref.avg);

          referenceYs.push(refY);
          $reference = busy ? null : (
            <line
              key={`reference-${evolution[0].date}`}
              className="reference reference-x"
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
            className={cx(
              `series series-path series-${
                long ? Math.round(evolutions.length / idx - 1) : idx
              }`,
              {
                'series-busy': busy,
              }
            )}
          />
        );
        const $scatters = busy
          ? null
          : evolution.reduce((reduced, entry) => {
              entry.runs.forEach(run => {
                reduced.push(
                  <circle
                    cx={xScale(run.time * 1000)}
                    cy={yScale(run.value)}
                    r={1.5}
                    className={`series series-${idx}`}
                  />
                );
              }, reduced);

              return reduced;
            }, []);
        const $area = busy ? null : (
          <path
            d={filledPath(evolution)}
            className={cx(`series series-area series-${idx}`, {
              'series-busy': busy,
            })}
          />
        );

        return [$area, $scatters, $path, $reference];
      });
      const formatTick = format('.0d');
      const $yAxis = yScale.ticks(tickCount).map((tick, idx) => {
        const y = yScale(tick);
        const label = formatTick(tick);

        // if (!idx && this.props.unit) {
        //   label += this.props.unit;
        // }
        return (
          <g
            className={cx('tick', 'tick-y', {
              'tick-axis': idx === 0,
              'tick-secondary': idx > 0,
            })}
            key={`tick-${tick}`}>
            <line x1={0} y1={y} x2={width} y2={y} />
            <text x={2} y={y}>
              {label}
            </text>
          </g>
        );
      });
      const yFormat = timeFormat('%b');
      const $xAxis = xScale.ticks(timeMonth.every(1)).map(tick => {
        const x = xScale(tick);
        const label = yFormat(tick);

        return (
          <g className={cx('tick', 'tick-x')} key={`tick-${tick}`}>
            <text x={x} y={height - 5}>
              {label}
            </text>
          </g>
        );
      });
      const $legend =
        signatureLabels.length > 1
          ? signatureLabels.map((label, idx) => (
              <text
                className={`legend series-${idx}`}
                x={27 + 60 * idx}
                y={15}
                key={`legend-${label}`}>
                {label}
              </text>
            ))
          : null;
      const $reference = referenceX ? (
        <line
          key="reference-y"
          className="reference reference-y"
          x1={referenceX}
          y1={min(referenceYs)}
          x2={referenceX}
          y2={height - 25}
        />
      ) : null;

      svg = (
        <svg height={height} width={width}>
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

    const link = URL({
      path: 'https://treeherder.mozilla.org/perf.html#/graphs',
      query: {
        timerange: 7776000,
        series: (signatures
          ? [...signatures.keys()]
          : Object.values(this.props.signatures)
        ).map(signature => ['mozilla-central', signature, 1, framework]),
      },
    });

    return (
      <Widget
        key={this.props.title}
        {...this.props}
        link={link}
        target={
          this.props.target != null ? this.props.target : 'No regressions'
        }
        className="graphic-widget graphic-timeline"
        content={svg}
        loading={!evolutions}
        explainer={`${explainer} (14-day moving median, variance band between 1st/3rd quantile)`}
        viewport={size => (this.viewport = size)}
      />
    );
  }
}

PerfherderWidget.defaultProps = {
  signatures: '',
  framework: 1,
  reference: '',
};
PerfherderWidget.propTypes = {
  title: PropTypes.string.isRequired,
  signatures: PropTypes.object,
  framework: PropTypes.number,
  explainer: PropTypes.string,
  reference: PropTypes.string,
  target: PropTypes.string,
};

export default withErrorBoundary(PerfherderWidget);
