/* global fetch */
import PropTypes from 'prop-types';
import { stringify } from 'query-string';
import React, { Component } from 'react';
import Widget from '../../quantum/widget';
import graph from '../../utils/metrics-graphics';
import SETTINGS from '../../settings';

const queryParams = ({ architecture, browsers, targetRatio, baseValue, skipDataBefore }) => {
  // XXX: Throw errors if we don't pass enough parameters
  let params = stringify({
      architecture,
      browser: browsers,
      skipDataBefore,
  });
  params += targetRatio ? `&${stringify({ targetRatio })}` : '';
  params += baseValue ? `&${stringify({ baseValue })}` : '';
  return params;
};

// Convert fx-health API data to fit metrics-graphics expectation
const transform = (data) => {
  const dataKeys = Object.keys(data);
  const result = {
    labels: [],
    series: [],
  };
  // Our CSS expects Target to be first and Canary second
  for (const k of ['Target', 'Canary']) {
    if (dataKeys.includes(k)) {
      result.labels.push(data[k].label);
      result.series.push(data[k].data);
      delete data[k];
    } else {
      result.labels.push('');
      result.series.push([]);
    }
  }
  for (const key in data) {
    result.labels.push(data[key].label);
    result.series.push(data[key].data);
  }
  return result;
};

export default class Speedometer extends Component {
  constructor(props) {
    super(props);
    const { targetRatio } = props;
    if (targetRatio && (targetRatio < 0 || targetRatio > 2)) {
      throw Error('targetRatio should be a value between 0 and 2');
    }
  }

  state = {
    series: undefined,
  }

  componentDidMount() {
    this.fetchPlotGraph(this.props);
  }

  viewport: [0, 0];

  async fetchPlotGraph({
    architecture, benchmark, browsers, targetBrowser, targetRatio, baseValue, skipDataBefore,
  }) {
    const { meta, data } = await (
      await fetch(`${SETTINGS.backend}/api/perf/benchmark/${benchmark}?` +
        `${queryParams({ architecture, browsers, targetRatio, baseValue, skipDataBefore })}`,
      )).json();
    const lastDataPoint = data[targetBrowser].data[data[targetBrowser].data.length - 1].value;
    let targetLastDataPoint;
    if (baseValue && targetRatio) {
      targetLastDataPoint = data.Target.data[data.Target.data.length - 1].value;
    } else {
      targetLastDataPoint = data.Canary.data[data.Canary.data.length - 1].value;
    }

    const difference = Number.parseFloat(lastDataPoint - targetLastDataPoint);
    const ratio = lastDataPoint / targetLastDataPoint;
    let status;
    if (baseValue && targetRatio) {
      status = baseValue + difference >= targetRatio * baseValue;
    } else {
      status = ratio >= targetRatio;
    }
    const moreProps = {
      status: status ? 'green' : 'yellow',
      reading: `${difference.toFixed(2)} runs/minute (${((ratio - 1) * 100).toFixed(2)}%)`,
      targetStatus: status ? 'pass' : 'fail',
    };
    const baselines = baseValue ? [{ value: baseValue * targetRatio, label: `Target ${targetRatio * 100}%` }] : null;
    const { labels, series } = transform(data);
    graph({
      target: this.graphEl,
      data: series,
      legend: labels,
      title: this.props.title,
      legend_target: this.legendEl,
      baselines });

    this.setState({
      moreProps,
      series: series,
      titleLink: meta.viewUrl,
    });
  }

  render() {
    const { id, targetRatio, baseValue } = this.props;
    const { moreProps, series, titleLink } = this.state;
    return (
      <Widget
        target={`&le; Chrome + ${100 * (1 - targetRatio).toFixed(2)}%`}
        className='graphic-widget graphic-timeline widget-benchmark'
        link={titleLink}
        loading={!series}
        viewport={size => (this.viewport = size)}
        {...this.props}
        {...moreProps}
      >
        <div id={id} key={id} className='criteria-widget'>
          {!series &&
            <div>Loading...</div>
          }
          <div className='graph' ref={div => this.graphEl = div}>
            <div className='legend' ref={div => this.legendEl = div}>{}</div>
          </div>
        </div>
      </Widget>
    );
  }
}

Speedometer.propTypes = {
  benchmark: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  targetBrowser: PropTypes.string.isRequired,
  targetRatio: PropTypes.number,
  baseValue: PropTypes.number,
  skipDataBefore: PropTypes.string,
};
