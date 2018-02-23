/* global fetch */
import PropTypes from 'prop-types';
import { stringify } from 'query-string';
import React, { Component } from 'react';
import Widget from '../../quantum/widget';
import graph from '../../utils/metrics-graphics';
import SETTINGS from '../../settings';

const queryParams = ({ architecture, browsers, targetDiff, baseValue }) => {
  // XXX: Throw errors if we don't pass enough parameters
  let params = stringify({
      architecture,
      browser: browsers,
  });
  params += targetDiff ? `&${stringify({ targetDiff })}` : '';
  params += baseValue ? `&${stringify({ baseValue })}` : '';
  return params;
};

// Convert fx-health API data to fit metrics-graphics expectation
const transform = (data) => {
  return Object.values(data).reduce((result, el) => {
    result.labels.push(el.label);
    result.series.push(el.data);
    return result;
  }, { labels: [], series: [] });
};

export default class Speedometer extends Component {
  constructor(props) {
    super(props);
    const { targetDiff } = props;
    if (targetDiff && (targetDiff < 0 || targetDiff > 1)) {
      throw Error('targetDiff should be a value between 0 and 1');
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
    architecture, benchmark, browsers, targetBrowser, targetDiff, baseValue,
  }) {
    const { meta, data } = await (
      await fetch(`${SETTINGS.backend}/api/perf/benchmark/${benchmark}?` +
        `${queryParams({ architecture, browsers, targetDiff, baseValue })}`,
      )).json();
    const lastDataPoint = data[targetBrowser].data[data[targetBrowser].data.length - 1].value;
    const canaryLastDataPoint = data.Canary.data[data.Canary.data.length - 1].value;

    const difference = Number.parseFloat(lastDataPoint - canaryLastDataPoint);
    const ratio = lastDataPoint / canaryLastDataPoint;
    let status;
    if (baseValue && targetDiff) {
      status = baseValue + difference >= targetDiff * baseValue;
    } else {
      status = ratio >= targetDiff;
    }
    const moreProps = {
      status: status ? 'green' : 'yellow',
      reading: `${difference.toFixed(2)} runs/minute (${((1 - ratio) * 100).toFixed(2)}%)`,
      targetStatus: status ? 'pass' : 'fail',
    };
    const { labels, series } = transform(data);
    graph(this.graphEl, series, labels, this.props.title);
    this.setState({
      moreProps,
      series: series,
      titleLink: meta.viewUrl,
    });
  }

  render() {
    const { id, targetDiff, baseValue } = this.props;
    const { moreProps, series, titleLink } = this.state;
    return (
      <Widget
        target={`&le; Chrome + ${100 * (1 - targetDiff).toFixed(2)}%`}
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
            <div className='graph-legend'>{}</div>
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
  targetDiff: PropTypes.number,
  baseValue: PropTypes.number,
};
