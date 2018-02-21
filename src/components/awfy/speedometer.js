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

  async fetchPlotGraph({ fetchData, targetDiff, targetLine }) {
    const data = await fetchData();
    const fxLastDataPoint = data.series[0][data.series[0].length - 1].value;
    let canaryLastDataPoint;
    let status;

    // In September, we adjusted the benchmark and caused Canary and Firefox
    // to have a new baseline. To make the graphs clearer we will drop data
    // before then
    data.series = data.series.map((line) => {
      return line.filter((el) => {
        const date = new Date(el.date);
        let newEl = null;
        if (date >= new Date('2017-10-01')) {
          newEl = el;
        }
        return newEl;
      });
    });

    if (targetLine && targetDiff) {
      canaryLastDataPoint = targetLine;
      const line = [
        { date: data.series[0][0].date, value: targetLine },
        { date: data.series[0][data.series[0].length - 1].date, value: targetLine },
      ];
      // We need to replace Canary's & Beta's data with an empty line
      // We want the target to be the 4th in line to match the CSS
      data.series.splice(1, 2, [], [], line);
      data.legendLabels.splice(1, 2, '', '', 'Target - Canary Dec. 2017');
    } else if (targetDiff) {
      canaryLastDataPoint = data.series[1][data.series[1].length - 1].value;
      // XXX: Index 1 represents Chrome
      const newLine = data.series[1].map(el => ({
        date: el.date,
        value: el.value * targetDiff,
      }));
      data.series = data.series.concat(new Array(newLine));
      data.legendLabels = data.legendLabels
        .concat(`Target of ${targetDiff * 100}%`);
    }

    const difference = Number.parseFloat(fxLastDataPoint - canaryLastDataPoint);
    const ratio = fxLastDataPoint / canaryLastDataPoint;
    if (targetLine && targetDiff) {
      status = targetLine + difference >= targetDiff * targetLine;
    } else {
      status = ratio >= targetDiff;
    }
    const moreProps = {
      status: status ? 'green' : 'yellow',
      reading: `${difference.toFixed(2)} runs/minute (${((1 - ratio) * 100).toFixed(2)}%)`,
      targetStatus: status ? 'pass' : 'fail',
    };

    graph(this.graphEl, data.series, data.legendLabels, this.props.title);
    this.setState({
      moreProps,
      series: data.series,
      titleLink: data.meta.viewUrl,
    });
  }

  render() {
    const { id, targetDiff, targetLine } = this.props;
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
  fetchData: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  targetDiff: PropTypes.number,
  targetLine: PropTypes.number,
};
