import React from 'react';
import PropTypes from 'prop-types';
import MG from 'metrics-graphics';
import cx from 'classnames';
import moment from 'moment';

export default class Graphic extends React.Component {
  constructor(props) {
    super(props);
    this.target = `graphic-${Math.round((Math.random() * 10000))}`;
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
        const needle = this.props.data.filter(point => moment(point.date).format('YYYY-MM-DD') === baseline)[0];
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
        if (baselines[1].oldRate) {
          const baselineRate = baselines[1].oldRate;
          const targetRate = baselineRate * 0.67;
          override.baselines = [
            {
              value: targetRate,
              label: targetRate.toFixed(2),
            },
            {
              value: baselineRate,
              label: baselineRate.toFixed(2),
            },
          ];
        } else {
          override.baselines = [
            { value: baselines[0].rate, label: 'Target' },
            { value: baselines[1].rate, label: 'Baseline' },
          ];
        }
        override.markers = Array.from(this.props.markers || [])
          .concat([
            {
              date: new Date(baselines[0].date),
              label: 'Target',
            },
            {
              date: new Date(baselines[1].date),
              label: 'Baseline',
            },
          ]);
      }
      if (this.props.cleaned) {
        override.data = this.props.data.reduce((split, entry) => {
          let add = 0;
          // if (entry.oldRate) {
          //   split[add++].push({ date: entry.date, rate: entry.oldRate });
          // }
          if (entry.rate) {
            split[(add += 1)].push({ date: entry.date, rate: entry.rate });
          }
          split[(add += 1)].push({ date: entry.date, rate: entry.dirty });
          return split;
        }, [[], [], []]);
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
  // x_accessor: 'date',
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
  cleaned: false,
};
Graphic.propTypes = {
  data: PropTypes.array,
  baseline: PropTypes.string,
  title: PropTypes.string,
  baselines: PropTypes.array,
  markers: PropTypes.array,
  // x_accessor: PropTypes.string,
  cleaned: PropTypes.bool,
  // full: PropTypes.bool,
};
