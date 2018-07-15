import { curveLinear } from 'd3';
import PropTypes from 'prop-types';
import { Component } from 'react';
import MetricsGraphics from 'react-metrics-graphics';

import Widget from '../../quantum/widget';

const widgetStatus = (status) => {
  let smileyFace = 'pass';
  let widgetColor = 'green';

  if (status > 2) {
    widgetColor = 'red';
  } else if (status >= 1) {
    widgetColor = 'yellow';
  }

  if (widgetColor !== 'green') {
    smileyFace = 'fail';
  }
  return { smileyFace, widgetColor };
};

export default class NimbledroidWidget extends Component {
  constructor(props) {
    super(props);
    this.legendTarget = null;
  }

  render() {
    const { profile } = this.props;
    const labels = Object.keys(profile.data);
    const data = labels.map(product => profile.data[product]);
    const target = this.props.targetRatio * profile.lastDataPoints.WV;
    const status = profile.lastDataPoints.GV /
      (this.props.targetRatio * profile.lastDataPoints.WV);
    const { smileyFace, widgetColor } = widgetStatus(status);

    return (
      <Widget
        // This classname is to undo what .criteria-widget:not:first-child sets
        className={'no-left-margin'}
        title={profile.title}
        target='GeckoView <= WebView + 20%'
        targetStatus={smileyFace}
        status={widgetColor}
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
