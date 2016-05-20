import 'babel-polyfill';
import React from 'react';
import MG from 'metrics-graphics';
import cx from 'classnames';

export default class Graphic extends React.Component {
  constructor(props) {
    super(props);
    this.target = `graphic-${((Math.random() * 10000) | 0)}`;
  }

  componentDidUpdate() {
    if (this.props.data) {
      MG.data_graphic(Object.assign({
        target: `#${this.target}`
      }, this.props));
    }
  }

  render() {
    const cls = cx('graphic', {
      'state-loading': !this.props.data
    });
    return (
      <div className={cls} id={this.target}>
        {this.props.data ? '' : this.props.title}
      </div>
    );
  }
};

Graphic.defaultProps = {
  title: 'Graphic',
  data: null,
  x_accessor: 'date',
  y_accessor: 'value',
  markers: [],
  baselines: [],
  full_width: true,
  full_height: true,
  show_secondary_x_label: false,
  y_extended_ticks: false,
  interpolate: 'monotone'
};
Graphic.propTypes = {
  data: React.PropTypes.array,
  title: React.PropTypes.string
};
