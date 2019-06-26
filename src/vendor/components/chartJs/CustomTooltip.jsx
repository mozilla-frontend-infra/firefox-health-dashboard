/* eslint-disable react/no-multi-comp */
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

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
      standardOptions,
      tooltipModel,
      canvas,
      tooltipIsLocked,
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
      fontSize: `${tooltipModel.bodyFontSize}px`,
    };
    const currPoint = tooltipModel.dataPoints[0];
    const { data, series } = standardOptions;
    const index = data.findIndex(currPoint);
    const s = currPoint.datasetIndex;
    const currSeries = series[s];
    const record = data[index];
    // BUILD CANONICAL SERIES
    const newSeries = {
      label: currSeries.label,
      meta: currSeries.meta,
      style: {
        color: tooltipModel.labelColors[0].borderColor,
      },
    };
    const HandleTooltip = standardOptions.tooltip;

    return (
      <div className={[classes, ...alignments].join(' ')} style={inlineStyle}>
        <HandleTooltip
          {...{
            record,
            index,
            data,
            series: newSeries,
            isLocked: tooltipIsLocked,
            seri: series,
          }}
        />
      </div>
    );
  }
}

CustomTooltip.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  HandleTooltip: PropTypes.func.isRequired,
  series: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  tooltipModel: PropTypes.shape({}),
  tooltipIsLocked: PropTypes.bool.isRequired,
  canvas: PropTypes.shape({}),
};

const StyledCustomTooltip = withStyles(styles)(CustomTooltip);

function withTooltip() {
  // https://reactjs.org/docs/higher-order-components.html
  //
  // Expects `HandleTooltip` property that accepts
  // * record - particualr raw record being shown
  // * index - position of record in data
  // * data - all the data in the series
  // * series - the particular dataset being shown
  // * s - index into series
  // * seri - all series shown on this chart

  return WrappedChart => {
    class Output extends React.Component {
      constructor(props, ...moreArgs) {
        const { standardOptions, options, ...moreProps } = props;

        super(moreProps, ...moreArgs);

        const self = this;
        const newOptions = { tooltips: {}, ...options };

        if (standardOptions.tooltip) {
          newOptions.onClick = this.handleChartClick;
          newOptions.tooltips.custom = function custom(tooltipModel) {
            if (!self.state.tooltipIsLocked) {
              // eslint-disable-next-line no-underscore-dangle
              self.setState({ tooltipModel, canvas: this._chart.canvas });
            }
          };
        }

        this.state = {
          options: newOptions,
          standardOptions,
          tooltipModel: null,
          tooltipIsLocked: false,
          canvas: null,
        };
      }

      handleChartClick = () => {
        this.setState(prevState => ({
          tooltipIsLocked: !prevState.tooltipIsLocked,
        }));
      };

      render() {
        const { standardOptions, options, ...rest } = this.state;

        if (standardOptions.tooltip) {
          return (
            <div style={{ position: 'relative' }}>
              <WrappedChart {...{ ...this.props, options }} />
              <StyledCustomTooltip {...{ standardOptions, ...rest }} />
            </div>
          );
        }

        return <WrappedChart {...this.props} />;
      }
    }

    return Output;
  };
}

export { withTooltip }; // eslint-disable-line import/prefer-default-export
