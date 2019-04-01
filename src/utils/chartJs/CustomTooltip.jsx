import React from 'react';
import { withStyles } from '@material-ui/core/styles';

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
  tooltipKey: {
    display: 'inline-block',
    width: '10px',
    height: '10px',
    marginRight: '10px',
  },
  lockMessage: {
    color: '#ccc',
  },
};

class CustomTooltip extends React.Component {
  render() {
    const { classes, tooltipModel, series, canvas, isLocked } = this.props;

    if (tooltipModel.opacity === 0) return null;

    const top = canvas.offsetTop + tooltipModel.caretY;
    const left = canvas.offsetLeft + tooltipModel.caretX;
    const alignments = [`x${tooltipModel.xAlign}`, `y${tooltipModel.yAlign}`];
    // console.log(alignments);
    const inlineStyle = {
      top,
      left,
      // eslint-disable-next-line no-underscore-dangle
      fontFamily: tooltipModel._bodyFontFamily,
      // eslint-disable-next-line no-underscore-dangle
      fontSize: `${tooltipModel._bodyFontSize}px`,
    };
    const currPoint = tooltipModel.dataPoints[0];
    const labelColor = {
      backgroundColor: tooltipModel.labelColors[0].borderColor,
    };
    const { index } = currPoint;
    const currSeries = series[currPoint.datasetIndex];
    const higherOrLower = currSeries.meta.lower_is_better
      ? 'lower is better'
      : 'higher is better';
    const curr = currSeries.data[index];
    const hgURL = `https://hg.mozilla.org/mozilla-central/pushloghtml?changeset=${
      curr.revision
    }`;
    const jobURL = `https://treeherder.mozilla.org/#/jobs?repo=mozilla-central&revision=${
      curr.revision
    }&selectedJob=${curr.job_id}&group_state=expanded`;

    return (
      <div
        className={[classes.tooltip, ...alignments].join(' ')}
        style={inlineStyle}>
        <div className={classes.test}>{currPoint.xLabel}</div>
        <div>
          <span style={labelColor} className={classes.tooltipKey} />
          {currSeries.label}: {currPoint.yLabel}
        </div>
        <div>
          {currPoint.yLabel} ({higherOrLower})
        </div>
        {(() => {
          if (index === 0) return null;

          const prev = currSeries.data[index - 1];
          const delta = curr.value - prev.value;
          const deltaPercentage = (delta / prev.value) * 100;

          return (
            <div>
              Δ {delta.toFixed(2)} ({deltaPercentage.toFixed(1)} %)
            </div>
          );
        })()}
        <div>
          <a href={hgURL} target="_blank" rel="noopener noreferrer">
            {curr.revision.slice(0, 12)}
          </a>
          {` `}(
          <a href={jobURL} target="_blank" rel="noopener noreferrer">
            job
          </a>
          )
        </div>
        <div className={classes.lockMessage}>
          {isLocked ? 'Click to unlock' : 'Click to lock'}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(CustomTooltip);
