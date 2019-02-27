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
  table: {
    borderCollapse: 'collapse',
  },
};
const Header = ({ xLabel }) => (
  <thead>
    <tr>
      <th>{xLabel}</th>
    </tr>
  </thead>
);
const TopBodyLines = props => (
  <React.Fragment>
    <tr>
      <td>
        <span style={props.labelColors} className={props.classes.tooltipKey} />
        {props.seriesLabel}: {props.currData}
      </td>
    </tr>
    <tr>
      <td>
        {props.currData} ({props.higherOrLower})
      </td>
    </tr>
  </React.Fragment>
);

function CustomTooltip({ classes, tooltipModel, series }) {
  if (tooltipModel.opacity === 0) {
    // Chartjs removes some properties in `tooltipModel` when datapoint
    // is not active. Those propertiles includes `title`, `dataPoints`, etc.
    // We can't go forward if that's the case
    return null;
  }

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
  const cmpProps = {
    classes,
    labelColors,
    seriesLabel,
    currData,
    higherOrLower,
  };

  // console.log('series', series);
  // console.log('tooltipModel', tooltipModel);

  if (index === 0) {
    return (
      <div className={classes.tooltip} style={paddingStyle}>
        <table className={classes.table}>
          <Header xLabel={xLabel} />
          <tbody>
            <TopBodyLines {...cmpProps} />
          </tbody>
        </table>
      </div>
    );
  }

  const prevData = dataset[index - 1].value;
  const delta = (currData - prevData).toFixed(2);
  const deltaPercentage = ((currData / prevData - 1) * 100).toFixed(2);
  const currRevision = dataset[index].revision;
  const prevRevision = dataset[index - 1].revision;
  const hgURL = `https://hg.mozilla.org/mozilla-central/pushloghtml?fromchange=${prevRevision}&tochange=${currRevision}`;

  return (
    <div className={classes.tooltip} style={paddingStyle}>
      <table className={classes.table}>
        <Header xLabel={xLabel} />
        <tbody>
          <TopBodyLines {...cmpProps} />
          <tr>
            <td>
              Δ {delta} ({deltaPercentage} %)
            </td>
          </tr>
          <tr>
            <td>
              <a href={hgURL}>{currRevision.slice(0, 12)}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default withStyles(styles)(CustomTooltip);
