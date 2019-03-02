import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  tooltip: {
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

function CustomTooltip({ classes, tooltipModel, series }) {
  if (tooltipModel.opacity === 0) return null;

  const currPoint = tooltipModel.dataPoints[0];
  const labelColors = tooltipModel.labelColors[0];
  const { index } = currPoint;
  const currSeries = series[currPoint.datasetIndex];
  const higherIsBetter = !currSeries.meta.lower_is_better;
  const higherOrLower = higherIsBetter ? 'higher is better' : 'lower is better';
  const paddingStyle = {
    padding: `${tooltipModel.yPadding}px ${tooltipModel.xPadding}px`,
  };

  return (
    <div className={classes.tooltip} style={paddingStyle}>
      <div>{currPoint.xLabel}</div>
      <div>
        <span style={labelColors} className={classes.tooltipKey} />
        {currSeries.label}: {currPoint.yLabel}
      </div>
      <div>
        {currPoint.yLabel} ({higherOrLower})
      </div>
      {(() => {
        if (index === 0) return null;

        const [prev, curr] = currSeries.data.slice(index - 1);
        const delta = curr.value - prev.value;
        const deltaPercentage = (delta / prev.value) * 100;
        const hgURL = `https://hg.mozilla.org/mozilla-central/pushloghtml?fromchange=${
          prev.revision
        }&tochange=${curr.revision}`;

        return (
          <React.Fragment>
            <div>
              Δ {delta.toFixed(2)} ({deltaPercentage.toFixed(1)} %)
            </div>
            <div>
              <a href={hgURL}>{curr.revision.slice(0, 12)}</a>
            </div>
          </React.Fragment>
        );
      })()}
    </div>
  );
}

export default withStyles(styles)(CustomTooltip);
