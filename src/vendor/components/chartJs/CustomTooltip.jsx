/* eslint-disable react/no-multi-comp */
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { missing } from '../../utils';

const topAligned = {
  '--trans-y': 'var(--tip-size)',
  '&::before': { bottom: '100%', borderBottomColor: 'var(--bg-color)' },
  '&.xright': {
    '--trans-x': 'calc(-100% + 2 * var(--tip-size))',
    '&::before': { right: 'var(--tip-size)' },
  },
  '&.xcenter': {
    '--trans-x': '-50%',
    '&::before': { left: 'calc(50% - var(--tip-size))' },
  },
  '&.xleft': {
    '--trans-x': 'calc(-2 * var(--tip-size))',
    '&::before': { left: 'var(--tip-size)' },
  },
};
const styles = {
  tooltip: {
    '--bg-color': 'rgba(0, 0, 0, .8)',
    '--tip-size': '6px',
    position: 'absolute',
    padding: '6px',
    background: 'var(--bg-color)',
    color: 'white',
    borderRadius: '4px',
    pointerEvents: 'none',
    transform: 'translate(var(--trans-x), var(--trans-y))',
    '& a': {
      pointerEvents: 'auto',
    },
    '&::before': {
      position: 'absolute',
      content: '""',
      borderWidth: 'var(--tip-size)',
      borderStyle: 'solid',
      borderColor: 'transparent',
    },
    '&.ytop': {
      ...topAligned,
    },
    '&.ycenter': {
      '--trans-y': '-50%',
      '&::before': { top: 'calc(50% - var(--tip-size))' },
      '&.xright': {
        '--trans-x': 'calc(-1 * (100% + var(--tip-size)))',
        '&::before': { left: '100%', borderLeftColor: 'var(--bg-color)' },
      },
      '&.xleft': {
        '--trans-x': 'var(--tip-size)',
        '&::before': { right: '100%', borderRightColor: 'var(--bg-color)' },
      },
    },
    '&.ybottom': {
      ...topAligned,
      '--trans-y': 'calc(-100% - var(--tip-size))',
      '&::before': { top: '100%', borderTopColor: 'var(--bg-color)' },
    },
  },
};

class CustomTooltip extends React.Component {
  render() {
    const {
      classes,
      tooltipModel,
      series,
      canvas,
      tooltipIsLocked,
      renderTooltip,
    } = this.props;

    if (!tooltipModel) return null;

    if (tooltipModel.opacity === 0) return null;

    const top = canvas.offsetTop + tooltipModel.caretY;
    const left = canvas.offsetLeft + tooltipModel.caretX;
    const alignments = [`x${tooltipModel.xAlign}`, `y${tooltipModel.yAlign}`];
    const inlineStyle = {
      top,
      left,
      // eslint-disable-next-line no-underscore-dangle
      fontFamily: tooltipModel._bodyFontFamily,
      // eslint-disable-next-line no-underscore-dangle
      fontSize: `${tooltipModel._bodyFontSize}px`,
    };
    const currPoint = tooltipModel.dataPoints[0];
    const { index } = currPoint;
    const s = currPoint.datasetIndex;
    const currSeries = series[s];

    if (missing(currSeries)) return null;
    const { data } = currSeries;
    const record = data[index];
    // BUILD CANONICAL SERIES
    const newSeries = {
      label: currSeries.label,
      meta: currSeries.meta,
      style: {
        color: tooltipModel.labelColors[0].borderColor,
      },
    };

    return (
      <div className={[classes, ...alignments].join(' ')} style={inlineStyle}>
        {renderTooltip({
          record,
          index,
          data,
          series: newSeries,
          isLocked: tooltipIsLocked,
        })}
      </div>
    );
  }
}

CustomTooltip.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  renderTooltip: PropTypes.func.isRequired,
  tooltipModel: PropTypes.shape({}),
  tooltipIsLocked: PropTypes.bool.isRequired,
  canvas: PropTypes.shape({}),
};

const StyledCustomTooltip = withStyles(styles)(CustomTooltip);

function withTooltip(renderTooltip) {
  // https://reactjs.org/docs/higher-order-components.html
  //
  // Expects `renderTooltip` function that accepts
  // * record - particualr raw record being shown
  // * index - position of record in data
  // * data - all the data in the series
  // * series - the particular dataset being shown
  // * s - index into series
  // * seri - all series shown on this chart

  return WrappedComponent => {
    class Output extends React.Component {
      constructor(...props) {
        super(...props);

        this.state = {
          tooltipModel: null,
          tooltipIsLocked: false,
          canvas: null,
        };
      }

      async componentDidMount() {
        const self = this;

        this.setState(prevState => {
          const { options } = prevState;

          options.onClick = this.handleChartClick;
          options.tooltips.custom = function custom(tooltipModel) {
            if (!self.state.tooltipIsLocked) {
              // eslint-disable-next-line no-underscore-dangle
              self.setState({ tooltipModel, canvas: this._chart.canvas });
            }
          };

          return { ...prevState, options };
        });
      }

      handleChartClick = () => {
        this.setState(prevState => ({
          tooltipIsLocked: !prevState.tooltipIsLocked,
        }));
      };

      render() {
        const { series } = this.props;
        const { tooltipModel, tooltipIsLocked, canvas, ...state } = this.state;

        return (
          <div style={{ position: 'relative' }}>
            <WrappedComponent {...this.props} {...state} />
            <StyledCustomTooltip
              {...{
                tooltipModel,
                series,
                canvas,
                tooltipIsLocked,
                renderTooltip,
              }}
            />
          </div>
        );
      }
    }

    return Output;
  };
}

export { withTooltip }; // eslint-disable-line import/prefer-default-export
