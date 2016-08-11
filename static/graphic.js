import 'babel-polyfill';
import React from 'react';
import MG from 'metrics-graphics';
import cx from 'classnames';
import moment from 'moment';

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
      const { baseline, baselines } = this.props;
      if (baseline) {
        const needle = this.props.data.filter((point) => {
          return moment(point.date).format('YYYY-MM-DD') === baseline;
        })[0];
        console.log(needle);
        if (needle && needle.rate > 0) {
          const high = needle.rate;
          const low = high * 0.67;
          override.baselines = [
            { value: high, label: high.toFixed(2) },
            { value: low, label: low.toFixed(2) },
          ];
          const baselineMarker = moment(baseline, 'YYYY MM DD');
          override.markers = Array.from(this.props.markers || [])
            .concat([{
              date: baselineMarker.toDate(),
              label: 'Baseline',
            }]);
        }
      }
      if (baselines && baselines.length) {
        override.baselines = [
          { value: baselines[0].rate, label: 'Target' }, // baselines[0].rate.toFixed(2)
          { value: baselines[1].rate, label: 'Baseline' }, // baselines[1].rate.toFixed(2)
        ];
        override.markers = Array.from(this.props.markers || [])
          .concat([{
            date: new Date(baselines[1].date),
            label: 'Baseline',
          }]);
      }
      if (this.props.cleaned) {
        override.data = this.props.data.reduce((split, entry) => {
          if (entry.rate) {
            split[0].push({ date: entry.date, rate: entry.rate });
          }
          split[1].push({ date: entry.date, rate: entry.dirty });
          return split;
        }, [[], []]);
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
  baseline: null,
  full_width: true,
  show_secondary_x_label: false,
  y_extended_ticks: false,
  interpolate: 'monotone',
  cleaned: false,
};
Graphic.propTypes = {
  data: React.PropTypes.array,
  baseline: React.PropTypes.string,
  title: React.PropTypes.string,
  baselines: React.PropTypes.array,
  markers: React.PropTypes.array,
  x_accessor: React.PropTypes.string,
  cleaned: React.PropTypes.bool,
};
