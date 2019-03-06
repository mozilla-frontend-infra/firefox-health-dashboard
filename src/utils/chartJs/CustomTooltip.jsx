import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  tooltip: {
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

function CustomTooltip({ classes, tooltipModel, series }) {
  if (tooltipModel.opacity === 0) return null;

  const currPoint = tooltipModel.dataPoints[0];
  const labelColors = tooltipModel.labelColors[0];
  const { index } = currPoint;
  const currSeries = series[currPoint.datasetIndex];
  const higherIsBetter = !currSeries.meta.lower_is_better;
  const higherOrLower = higherIsBetter ? 'higher is better' : 'lower is better';
  const curr = currSeries.data[index];
  const hgURL = `https://hg.mozilla.org/mozilla-central/pushloghtml?changeset=${
    curr.revision
  }`;
  const jobURL = `https://treeherder.mozilla.org/#/jobs?repo=mozilla-central&revision=${
    curr.revision
  }&selectedJob=${curr.job_id}&group_state=expanded`;

  return (
    <div className={classes.tooltip}>
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

export default withStyles(styles)(CustomTooltip);
