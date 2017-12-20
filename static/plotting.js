/* global fetch */
import MG from 'metrics-graphics';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

// This graph shows multiple lines on a graph
const graph = (graphEl, series, legend, title) => {
  // For every series let's convert the values to proper dates
  series.map(evo => MG.convert.date(evo, 'date'));
  MG.data_graphic({
    title: title,
    full_width: true,
    full_height: true,
    data: series,
    target: graphEl,
    legend: legend,
    legend_target: '.legend',
  });
};

export default class GraphWithTarget extends Component {
  constructor(props) {
    super(props);
    const { targetDiff } = props;
    if (targetDiff && (targetDiff < 0 || targetDiff > 1)) {
      throw Error('targetDiff should be a value between 0 and 1');
    }
  }

  componentDidMount() {
    this.fetchPlotGraph(this.props);
  }

  async fetchPlotGraph({ fetchData, targetDiff }) {
    const data = await fetchData();
    this.graphTitleLink.setAttribute('href', data.meta.viewUrl);
    if (targetDiff) {
      // XXX: Index 1 represents Chrome
      const targetLine = data.series[1].map(el => ({
        date: el.date,
        value: el.value * targetDiff,
      }));
      data.series = data.series.concat(new Array(targetLine));
      data.legendLabels = data.legendLabels.concat('Target');
    }
    graph(this.graphEl, data.series, data.legendLabels, this.props.title);
  }

  render() {
    const { id, title } = this.props;
    return (
      <div id={id} key={id} className='criteria-widget'>
        <header>
          <h3 className='graph-title'>
            <a className='graph-title-link' ref={a => this.graphTitleLink = a}>{title}</a>
          </h3>
        </header>
        <div className='graph' ref={div => this.graphEl = div}>
          <div className='graph-legend'>{}</div>
        </div>
      </div>
    );
  }
}

GraphWithTarget.propTypes = {
  fetchData: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  targetDiff: PropTypes.number,
};
