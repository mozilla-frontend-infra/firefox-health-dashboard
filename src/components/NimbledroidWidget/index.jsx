import { curveLinear } from 'd3';
import PropTypes from 'prop-types';
import { Component } from 'react';
import MetricsGraphics from 'react-metrics-graphics';

import Widget from '../../quantum/widget';

export default class NimbledroidWidget extends Component {
  constructor(props) {
    super(props);
    this.legendTarget = null;
  }

  render() {
    const { profile } = this.props;
    const labels = Object.keys(profile.data);
    const data = labels.map(product => profile.data[product]);
    const target = this.props.targetRatio * profile.lastDataPoints.focus;
    const status = profile.lastDataPoints.klar / profile.lastDataPoints.focus;

    return (
      <Widget
        // This classname is to undo what .criteria-widget:not:first-child sets
        className={'no-left-margin'}
        title={profile.title}
        targetStatus={status < 1 ? 'pass' : 'fail'}
        status={status < 1 ? 'green' : 'yellow'}
      >
        <div>
          <div className='legend' ref={ele => this.legendTarget = ele} />
          {profile &&
            <MetricsGraphics
              width={600}
              height={300}
              data={data}
              x_accessor='date'
              y_accessor='value'
              legend={labels}
              legend_target={this.legendTarget}
              interpolate={curveLinear}
              baselines={[{
                value: target,
                label: 'Target',
              }]}
            />
          }
        </div>
      </Widget>
    );
  }
}

NimbledroidWidget.propTypes = {
  profile: PropTypes.shape({
    title: PropTypes.string.isRequired,
    data: PropTypes.shape({}).isRequired,
  }),
  targetRatio: PropTypes.number.isRequired,
};
