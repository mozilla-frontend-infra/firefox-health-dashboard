/* eslint-disable react/no-multi-comp */
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Data } from '../../datas';

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
    display: 'inline-table',
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
    const { datasetIndex: seriesIndex, index } = tooltipModel.dataPoints[0];
    const { data, series } = standardOptions;
    const currSeries = series[seriesIndex];
    const record = data[index];
    const HandleTooltip = standardOptions.tip;

    return (
      <div
        className={[classes.tooltip, ...alignments].join(' ')}
        style={inlineStyle}
      >
        <HandleTooltip
          {...{
            record,
            index,
            data,
            series: currSeries,
            isLocked: tooltipIsLocked,
            seri: series,
            standardOptions,
          }}
        />
      </div>
    );
  }
}

CustomTooltip.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  standardOptions: PropTypes.shape({
    tip: PropTypes.func.isRequired,
    series: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }).isRequired,
  tooltipModel: PropTypes.shape({}),
  tooltipIsLocked: PropTypes.bool.isRequired,
  canvas: PropTypes.shape({}),
};

const StyledCustomTooltip = withStyles(styles)(CustomTooltip);

function withTooltip() {
  // https://reactjs.org/docs/higher-order-components.html
  //
  // Expects `standardOptions.tip` property that accepts
  // * record - particular raw record being shown
  // * index - position of record in data
  // * data - all the data in the series
  // * series - the particular dataset being shown
  // * s - index into series
  // * seri - all series shown on this chart

  return (WrappedChart) => {
    class Output extends React.Component {
      constructor(props, ...moreArgs) {
        super(props, ...moreArgs);
        const { standardOptions } = props;
        const self = this;
        const options = { tooltips: {} };

        if (standardOptions.tip) {
          options.onClick = this.handleChartClick;
          options.tooltips.enabled = false;
          options.tooltips.custom = function custom(tooltipModel) {
            if (!self.state.tooltipIsLocked) {
              // eslint-disable-next-line no-underscore-dangle
              self.setState({ tooltipModel, canvas: this._chart.canvas });
            }
          };
        }

        this.state = {
          options,
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

      async componentDidUpdate(prevProps) {
        const { standardOptions } = this.props;

        if (prevProps.standardOptions !== standardOptions) {
          // eslint-disable-next-line react/no-did-update-set-state
          this.setState({ standardOptions });
        }
      }

      render() {
        const { standardOptions: _, chartRef, ...moreProps } = this.props;
        const { standardOptions, options, ...rest } = this.state;

        if (standardOptions.tip) {
          return (
            <div style={{ position: 'relative' }}>
              <WrappedChart ref={chartRef} {...Data.setDefault(moreProps, { options })} />
              <StyledCustomTooltip {...{ standardOptions, ...rest }} />
            </div>
          );
        }

        return <WrappedChart ref={chartRef} {...moreProps} />;
      }
    }

    return Output;
  };
}

export { withTooltip }; // eslint-disable-line import/prefer-default-export
