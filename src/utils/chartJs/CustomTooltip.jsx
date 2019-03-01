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

function Footer({ dataset, index, currData }) {
  const prevData = dataset[index - 1].value;
  const prevRevision = dataset[index - 1].revision;
  const delta = (currData - prevData).toFixed(2);
  const deltaPercentage = ((currData / prevData - 1) * 100).toFixed(2);
  const currRevision = dataset[index].revision;
  const hgURL = `https://hg.mozilla.org/mozilla-central/pushloghtml?fromchange=${prevRevision}&tochange=${currRevision}`;

  return (
    <React.Fragment>
      <div>
        Δ {delta} ({deltaPercentage} %)
      </div>
      <div>
        <a href={hgURL}>{currRevision.slice(0, 12)}</a>
      </div>
    </React.Fragment>
  );
}

function CustomTooltip({ classes, tooltipModel, series }) {
  if (tooltipModel.opacity === 0) return null;

  const { xLabel, index, datasetIndex } = tooltipModel.dataPoints[0];
  const dataset = series[datasetIndex].data;
  const seriesLabel = series[datasetIndex].label;
  const labelColors = tooltipModel.labelColors[0];
  const currData = tooltipModel.dataPoints[0].yLabel;
  const higherIsBetter = !series[datasetIndex].meta.lower_is_better;
  const higherOrLower = higherIsBetter ? 'higher is better' : 'lower is better';
  const paddingStyle = {
    padding: `${tooltipModel.yPadding}px ${tooltipModel.xPadding}px`,
  };

  return (
    <div className={classes.tooltip} style={paddingStyle}>
      <div>{xLabel}</div>
      <div>
        <span style={labelColors} className={classes.tooltipKey} />
        {seriesLabel}: {currData}
      </div>
      <div>
        {currData} ({higherOrLower})
      </div>
      {index > 0 && <Footer {...{ dataset, index, currData }} />}
    </div>
  );
}

export default withStyles(styles)(CustomTooltip);
