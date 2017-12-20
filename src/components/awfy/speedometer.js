/* global fetch */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Widget from '../../quantum/widget';
import graph from '../../utils/metrics-graphics';

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

  async fetchPlotGraph({ fetchData, targetDiff }) {
    const data = await fetchData();
    if (targetDiff) {
      // XXX: Index 1 represents Chrome
      const targetLine = data.series[1].map(el => ({
        date: el.date,
        value: el.value * targetDiff,
      }));
      data.series = data.series.concat(new Array(targetLine));
      data.legendLabels = data.legendLabels
        .concat(`Target of ${targetDiff * 100}%`);
    }
    const ratio = (data.series[0][data.series[0].length - 1].value) /
      (data.series[1][data.series[1].length - 1].value);
    const difference = ((data.series[0][data.series[0].length - 1].value) -
      (data.series[1][data.series[1].length - 1].value)).toFixed(2);
    graph(this.graphEl, data.series, data.legendLabels, this.props.title);
    this.setState({
      difference,
      ratio,
      series: data.series,
      titleLink: data.meta.viewUrl,
    });
  }

  render() {
    const { id, targetDiff } = this.props;
    const { difference, ratio, series, titleLink } = this.state;
    let moreProps = {};
    // Do not pass certain props until we are ready
    if (series) {
      moreProps = {
        status: (ratio >= targetDiff) ? 'green' : 'yellow',
        reading: `${difference} runs/minute (${((1 - ratio) * 100).toFixed(2)}%)`,
        targetStatus: (ratio >= targetDiff) ? 'pass' : 'fail',
      };
    }
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
  fetchData: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  targetDiff: PropTypes.number,
};
