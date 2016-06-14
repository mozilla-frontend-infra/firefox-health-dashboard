import 'babel-polyfill';
import React from 'react';
import find from 'lodash/find';
import MG from 'metrics-graphics';
import cx from 'classnames';

export default class Graphic extends React.Component {
  constructor(props) {
    super(props);
    this.target = `graphic-${((Math.random() * 10000) | 0)}`;
  }

  componentDidMount() {
    // Workaround Chrome which screws height when adding graph
    this.height = document.getElementById(this.target).offsetHeight;
  }

  componentDidUpdate() {
    if (this.props.data) {
      const options = {
        target: `#${this.target}`,
        height: this.height,
      };
      const override = {};
      const { baseline } = this.props;
      if (baseline) {
        const high = find(this.props.data, (point) => {
          return point[this.props.x_accessor].getTime() === new Date(baseline).getTime();
        }).rate;
        if (high > 0) {
          const low = high * 0.7;
          override.baselines = [
            { value: high, label: high.toFixed(2) },
            { value: low, label: low.toFixed(2) },
          ];
          override.markers = Array.from(this.props.markers || []);
          override.markers.push({
            date: new Date(baseline),
            label: 'Baseline',
          });
        }
      }
      MG.data_graphic(Object.assign(options, this.props, override));
    }
  }

  render() {
    const cls = cx('graphic', {
      'state-loading': !this.props.data,
    });
    return (
      <div
        className={cls}
        id={this.target}
      >
        {this.props.data ? '' : (this.props.title || 'Loading …')}
      </div>
    );
  }
}

Graphic.defaultProps = {
  title: '',
  data: null,
  x_accessor: 'date',
  y_accessor: 'value',
  markers: [],
  top: 15,
  bottom: 10,
  left: 35,
  baselines: [],
  baseline: 0,
  full_width: true,
  show_secondary_x_label: false,
  y_extended_ticks: false,
  interpolate: 'monotone',
};
Graphic.propTypes = {
  data: React.PropTypes.array,
  baseline: React.PropTypes.string,
  title: React.PropTypes.string,
  baselines: React.PropTypes.array,
  markers: React.PropTypes.array,
  x_accessor: React.PropTypes.string,
};
