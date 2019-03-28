import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  tooltip: {
    position: 'absolute',
    padding: '6px',
    background: 'rgba(0, 0, 0, .8)',
    color: 'white',
    borderRadius: '4px',
    pointerEvents: 'none',
  },
  tooltipKey: {
    display: 'inline-block',
    width: '10px',
    height: '10px',
    marginRight: '10px',
  },
};

class CustomTooltip extends React.Component {
  constructor(props) {
    super(props);
    this.tooltip = React.createRef();
    this.state = { width: 0, height: 0 };
  }

  componentDidMount() {
    this.setState({
      width: this.tooltip.current.clientWidth,
      height: this.tooltip.current.clientHeight,
    });
  }

  render() {
    const { classes, tooltipModel, series, canvas } = this.props;

    if (tooltipModel.opacity === 0) return null;

    let top = canvas.offsetTop + tooltipModel.caretY;
    let left = canvas.offsetLeft + tooltipModel.caretX;

    if (tooltipModel.yAlign === 'bottom') {
      top -= this.state.height;
    } else if (tooltipModel.yAlign === 'center') {
      top -= 0.5 * this.state.height;
    }

    if (tooltipModel.xAlign === 'right') {
      left -= this.state.width;
    } else if (tooltipModel.xAlign === 'center') {
      left -= 0.5 * this.state.width;
    }

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
      <div className={classes.tooltip} style={inlineStyle} ref={this.tooltip}>
        <div>{currPoint.xLabel}</div>
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
      </div>
    );
  }
}

export default withStyles(styles)(CustomTooltip);
