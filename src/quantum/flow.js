/* global fetch */
import React from 'react';
import MetricsGraphics from 'react-metrics-graphics';
import moment from 'moment';
import PropTypes from 'prop-types';

import { stringify, parse } from 'query-string';
import { curveLinear } from 'd3';
import Widget from './widget';
import SETTINGS from '../settings';

export default class Flow extends React.Component {
  state = {};

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const { whiteboard } = this.props;
    let url = `${SETTINGS.backend}/api/bz/burnup`;

    if (whiteboard) {
      url += `/?${stringify(whiteboard)}`;
    }
    fetch(url).then(response => response.json()).then(data => this.transformData(data));
  }

  transformData(data) {
    const total = [];
    const closed = [];
    const needsAnalysis = [];
    const analyzed = [];

    for (const item of data) {
      total.push({ date: new Date(item.date), value: item.total });
      closed.push({ date: new Date(item.date), value: item.closed });
      needsAnalysis.push({ date: new Date(item.date), value: item.needsAnalysis });
      analyzed.push({ date: new Date(item.date), value: item.analyzed });
    }
    this.setState({ data: [total, closed, needsAnalysis, analyzed] });
  }

  render() {
    const { data } = this.state;
    let viewport = [0, 0];
    return (
      <Widget
        className='graphic-timeline graphic-widget wide-content'
        link={this.props.link}
        target='*Fix P1 Bugs*'
        title='Quantum Flow P1 Bugs Data'
        loading={!data}
        viewport={size => (viewport = size)}
      >
        {data &&
        <div>
          <div className='legend' />
          <MetricsGraphics
            width={900}
            height={300}
            data={data}
            x_accessor='date'
            y_accessor='value'
            interpolate={curveLinear}
            legend={['Total', 'Closed', 'Needs-analysis', 'Analyzed']}
            legend_target={'.legend'}
          />
        </div>}
      </Widget>
    );
  }
}

Flow.propTypes = {
  link: PropTypes.string,
  whiteboard: PropTypes.shape({}),
};
