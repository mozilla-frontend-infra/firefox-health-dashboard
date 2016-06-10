import 'babel-polyfill';
import React from 'react';
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
      const { baselines } = this.props;
      if (baselines.length) {
        override.baselines = [
          { value: baselines[1], label: baselines[1] },
          { value: baselines[0], label: baselines[0] },
        ];
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
  full_width: true,
  show_secondary_x_label: false,
  y_extended_ticks: false,
  interpolate: 'monotone',
};
Graphic.propTypes = {
  data: React.PropTypes.array,
  title: React.PropTypes.string,
  baselines: React.PropTypes.array,
};
