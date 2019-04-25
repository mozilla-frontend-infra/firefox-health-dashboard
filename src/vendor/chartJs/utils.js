import SETTINGS from '../../settings';

const generateOptions = (options = {}) => {
  const {
    title,
    scaleLabel,
    reverse = false,
    ticksCallback,
    onClick,
  } = options;
  const chartJsOptions = {
    legend: {
      labels: {
        boxWidth: 10,
        fontSize: 10,
      },
    },
    scales: {
      xAxes: [
        {
          type: 'time',
          time: {
            displayFormats: { hour: 'MMM D' },
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            reverse,
          },
        },
      ],
    },
  };

  if (ticksCallback) {
    chartJsOptions.scales.yAxes[0].ticks.callback = ticksCallback;
  }

  if (title) {
    chartJsOptions.title = {
      display: true,
      text: title,
    };
  }

  if (scaleLabel) {
    chartJsOptions.scales.yAxes[0].scaleLabel = {
      display: true,
      labelString: scaleLabel,
    };
  }

  if (onClick) {
    chartJsOptions.onClick = onClick;
  }

  return chartJsOptions;
};

const generateLineChartStyle = color => ({
  type: 'line',
  backgroundColor: color,
  borderColor: color,
  fill: false,
  pointRadius: '0',
  pointHoverBackgroundColor: 'white',
  lineTension: 0.1,
});
const generateScatterChartStyle = color => ({
  type: 'scatter',
  backgroundColor: color,
});
const generateDatasetStyle = (index, color, type = 'line') => {
  const colour = color || SETTINGS.colors[index];

  if (type === 'scatter') {
    return generateScatterChartStyle(colour);
  }

  return generateLineChartStyle(colour);
};

export { generateOptions, generateDatasetStyle };
