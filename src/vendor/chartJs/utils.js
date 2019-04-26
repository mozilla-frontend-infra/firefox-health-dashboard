import SETTINGS from '../../settings';
import { missing } from '../utils';
import { selectFrom } from '../vectors';
import Color from '../colors';

const invisible = 'rgba(0,0,0,0)';
/*
return maximum for most of the values
 */
const mostlyMax = values => {
  const sorted = selectFrom(values)
    .exists()
    .sortBy()
    .toArray();
  const num = sorted.length - 1;
  const p50 = sorted[Math.ceil(num * 0.5)];
  const p90 = sorted[Math.ceil(num * 0.9)];
  const max = sorted[num];

  return Math.min(max, Math.max(p50 * 2.0, p90 * 1.1));
};

/*
return nice, round, upper bound
 */
const niceCeiling = value => {
  const d = 10 ** (Math.ceil(Math.log10(value)) - 1);

  return Math.ceil(value / d) * d;
};

const generateOptions = (options = {}, data) => {
  const {
    title,
    scaleLabel,
    reverse = false,
    tooltips,
    ticksCallback,
    onClick,
  } = options;
  const temp = selectFrom;
  const yMax = niceCeiling(
    mostlyMax(
      temp(data.datasets)
        .select('data')
        .flatten()
        .select('y')
    )
  );
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
            min: 0,
            max: yMax,
          },
        },
      ],
    },
  };

  if (ticksCallback) {
    chartJsOptions.scales.yAxes[0].ticks.callback = ticksCallback;
  }

  if (tooltips){
    chartJsOptions.tooltips = tooltips;
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
const generateScatterChartStyle = color => {
  const gentleColor = missing(color)
    ? color
    : Color.parseHTML(color)
        .setOpacity(0.9)
        .toRGBA();

  return {
    type: 'scatter',
    backgroundColor: gentleColor,
    borderWidth: 0,
    borderColor: invisible,
    fill: false,
    lineTension: 0,

    pointRadius: 3,
    pointBackgroundColor: invisible,
    pointBorderColor: gentleColor,
    pointBorderWidth: 2,
    pointHitRadius: 10,

    pointHoverRadius: 3,
    pointHoverBackgroundColor: color,
    pointHoverBorderColor: gentleColor,
    pointHoverBorderWidth: 6,
  };
};

const generateDatasetStyle = (index, type = 'line') => {
  const colour = SETTINGS.colors[index];

  if (type === 'scatter') {
    return generateScatterChartStyle(colour);
  }

  return generateLineChartStyle(colour);
};

export { generateOptions, generateDatasetStyle };
