import SETTINGS from '../../settings';
import { missing, toArray } from '../utils';
import { Data } from '../Data';
import { selectFrom, first } from '../vectors';
import Color from '../colors';
import Date from '../dates';

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

const generateOptions = (rawOptions = {}, data) => {
  // ORGANIZE THE OPTIONS INTO STRUCTURE
  const options = Data.fromConfig(rawOptions);
  const { title, reverse = false, tooltips, ticksCallback, onClick } = options;
  const xAxes = (() => {
    if (Data.get(options, 'axis.x')) {
      return toArray(options.axis.x).map(x => {
        const { min, max } = x;

        return {
          type: 'time',
          time: {
            displayFormats: { hour: 'MMM D' },
            min: Date.newInstance(min),
            max: Date.newInstance(max),
          },
        };
      });
    }

    return [
      {
        type: 'time',
        time: {
          displayFormats: { hour: 'MMM D' },
        },
      },
    ];
  })();
  const yMax = niceCeiling(
    mostlyMax(
      selectFrom(data.datasets)
        .select('data')
        .flatten()
        .select('y')
    )
  );
  const yAxes = [
    {
      ticks: {
        beginAtZero: true,
        reverse,
        min: 0,
        max: yMax,
      },
    },
  ];
  const yLabel = first(toArray(Data.get(options, 'axis.y.label')));

  if (yLabel) {
    yAxes[0].scaleLabel = {
      display: true,
      labelString: yLabel,
    };
  }

  const chartJsOptions = {
    legend: {
      labels: {
        boxWidth: 10,
        fontSize: 10,
      },
    },
    scales: {
      xAxes,
      yAxes,
    },
  };

  if (ticksCallback) {
    chartJsOptions.scales.yAxes[0].ticks.callback = ticksCallback;
  }

  if (tooltips) {
    chartJsOptions.tooltips = tooltips;
  }

  if (title) {
    chartJsOptions.title = {
      display: true,
      text: title,
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
