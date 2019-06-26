import SETTINGS from '../../../settings';
import { isNumeric, missing, toArray } from '../../utils';
import { Data, isData } from '../../datas';
import { first, selectFrom, selector } from '../../vectors';
import { max, min } from '../../math';
import Color from '../../colors';
import { Date } from '../../dates';
import { Template } from '../../Template';
import { Log } from '../../logs';

const invisible = 'rgba(0,0,0,0)';
/*
return maximum for most of the values
 */
const mostlyMax = values => {
  const sorted = selectFrom(values)
    .exists()
    .sort()
    .toArray();
  const num = sorted.length - 1;
  const p50 = sorted[Math.ceil(num * 0.5)];
  const p90 = sorted[Math.ceil(num * 0.9)];
  const max = sorted[num];
  const most = Math.max(p50 * 2.0, p90 * 1.1);

  if (most === 0) return max * 1.1;

  return Math.min(max * 1.1, most);
};

/*
return nice, round, upper bound
 */
const niceCeiling = value => {
  if (value === 0) return 1;
  const d = 10 ** (Math.ceil(Math.log10(value)) - 1);
  const norm = value / d;
  const nice = [1.5, 2, 3, 5, 7.5, 10].find(v => norm <= v);

  return nice * d;
};

const cjsOptionsGenerator = standardOptions => {
  // ORGANIZE THE OPTIONS INTO STRUCTURE
  const options = Data.fromConfig(standardOptions);
  const xAxis = selectFrom(options.series)
    .where({ 'select.axis': 'x' })
    .first();

  if (missing(xAxis)) {
    Log.error(
      "Expecting chart definition to have series.select.axis=='x'; pointing to the X axis"
    );
  }

  const x = xAxis.select;
  const datasets = options.series.map(s => {
    const { select } = s.select;

    return {
      data: selectFrom(options.data)
        .select({
          [select.axis]: select.value,
          [x.axis]: x.value,
        })
        .toArray(),
      style: {
        type: s.type,
        backgroundColor: s.style.color,
        borderColor: s.style.color,
        fill: false,
        pointRadius: '0',
        pointHoverRadius: '0',
        pointHoverBackgroundColor: s.style.color,
        lineTension: 0,
      },
    };
  });
  const { title, tooltips, ticksCallback, onClick } = options;
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
  const yMax = (() => {
    const requestedMax = Data.get(options, 'axis.y.max');

    if (isNumeric(requestedMax)) {
      return requestedMax;
    }

    const niceMax = niceCeiling(
      mostlyMax(
        selectFrom(datasets)
          .select('data')
          .flatten()
          .select('y')
      )
    );

    if (isData(requestedMax)) {
      return min([requestedMax.max, max([niceMax, requestedMax.min])]);
    }

    return niceMax;
  })();
  const yAxes = [
    {
      ticks: {
        beginAtZero: true,
        reverse: Data.get(options, 'axis.y.reverse'),
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

  const yFormat = first(toArray(Data.get(options, 'axis.y.format')));

  if (yFormat) {
    const t = new Template(yFormat);

    yAxes[0].ticks.callback = (value, i, values) => {
      const [last1, last2, last3] = values;

      // DO NOT SHOW LAST VALUE IF IT IS NOT A FULL STEP ABOVE SECOND-LAST VALUE
      if (value === last1 && last1 - last2 < 0.9 * (last2 - last3)) {
        return '';
      } // endif

      return t.expand(value);
    };
  }

  const cjsOptions = {
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
    datasets,
  };

  if (ticksCallback) {
    cjsOptions.scales.yAxes[0].ticks.callback = ticksCallback;
  }

  if (tooltips) {
    cjsOptions.tooltips = tooltips;
  }

  if (title) {
    cjsOptions.title = {
      display: true,
      text: title,
    };
  }

  if (onClick) {
    cjsOptions.onClick = onClick;
  }

  cjsOptions.animation = false;

  return cjsOptions;
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


export { cjsOptionsGenerator, generateDatasetStyle };
