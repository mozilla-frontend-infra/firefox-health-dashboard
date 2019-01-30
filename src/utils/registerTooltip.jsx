/* eslint-disable no-underscore-dangle */
import Chart from 'chart.js';

const handleOnClick = (_, items) => {
  Chart.lastClickedDataPoint = null;

  // Check if the click happened on empty chart space or data point
  if (items.length > 0) {
    // A Chart element has a reference to which chart it belongs to and what
    // the current tooltip in view has a reference to the last active tooltip
    // eslint-disable-next-line prefer-destructuring
    Chart.lastClickedDataPoint = items[0]._chart.tooltip._lastActive[0];
  }

  Chart.helpers.each(Chart.instances, chartItem => {
    chartItem.update();
  });
};

const registerPlugin = () => {
  Chart.plugins.register({
    id: 'tooltip-plugin',
    beforeRender(chart) {
      this.pluginTooltips = [];

      // Process only if a data point was clicked
      if (Chart.lastClickedDataPoint) {
        // eslint-disable-next-line no-underscore-dangle
        if (Chart.lastClickedDataPoint._chart.chart.id !== chart.id) {
          return;
        }

        const { _datasetIndex, _index } = Chart.lastClickedDataPoint;

        this.pluginTooltips.push(
          new Chart.Tooltip(
            {
              _chart: chart.chart,
              _chartInstance: chart,
              _data: chart.data,
              _options: chart.options.tooltips,
              // eslint-disable-next-line no-underscore-dangle
              _active: [chart.getDatasetMeta(_datasetIndex).data[_index]],
            },
            chart
          )
        );
      }
    },
    afterDatasetsDraw(easing) {
      Chart.helpers.each(this.pluginTooltips, tooltip => {
        tooltip.initialize();
        tooltip.update();
        tooltip.pivot();
        tooltip.transition(easing).draw();
      });
    },
  });
};

const registerTooltipPlugin = () => {
  registerPlugin();
  Chart.defaults.global.onClick = handleOnClick;
};

export default registerTooltipPlugin;
