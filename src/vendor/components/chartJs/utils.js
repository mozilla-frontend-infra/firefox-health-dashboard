import SETTINGS from '../../../config';
import {
  exists, isNumeric, missing, toArray, zip,
} from '../../utils';
import { Data, isData } from '../../datas';
import { first, selectFrom } from '../../vectors';
import { max, min } from '../../math';
import Color from '../../colors';
import { GMTDate as Date } from '../../dates';
import { Template } from '../../Template';
import { Log } from '../../logs';
import jx from '../../jx/expressions';

const invisible = 'rgba(0,0,0,0)';
/*
return maximum for most of the values
 */
const mostlyMax = (values) => {
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
const niceCeiling = (value) => {
  if (value === 0) return 1;
  const d = 10 ** (Math.ceil(Math.log10(value)) - 1);
  const norm = value / d;
  const nice = [1.5, 2, 3, 5, 7.5, 10].find(v => norm <= v);

  return nice * d;
};

const generateLineChartStyle = color => ({
  type: 'line',
  backgroundColor: color,
  borderColor: color,
  fill: false,

  pointRadius: 5,
  pointBackgroundColor: invisible,
  pointBorderColor: invisible,

  pointHoverRadius: 3,
  pointHoverBackgroundColor: color,
  pointHoverBorderWidth: 6,

  lineTension: 0.1,
});
const generateScatterChartStyle = (color) => {
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

const generateDatasetStyle = (colour, type = 'line') => {
  if (type === 'scatter') {
    return generateScatterChartStyle(colour);
  }

  return generateLineChartStyle(colour);
};

/*
Convert from standard chart structure to CharJS structure
 */
const cjsGenerator = (standardOptions) => {
  // ORGANIZE THE OPTIONS INTO STRUCTURE
  const options = (() => {
    // DEEP COPY, BUT NOT THE data
    const { data, ...rest } = standardOptions;
    const newRest = Data.deepCopy(rest);

    return Data.fromConfig({ data, ...newRest });
  })();
  const xAxes = (() => {
    const xDomain = Data.get(options, 'axis.x.domain');

    if (xDomain) {
      return toArray(xDomain).map((x) => {
        const [min, max] = [x.min, x.max];

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

    // DEFAULT
    return [
      {
        type: 'time',
        time: {
          displayFormats: { hour: 'MMM D' },
        },
      },
    ];
  })();

  if (missing(options.series)) {
    Log.error('expecting series');
  }

  const xEdge = selectFrom(toArray(options.series))
    .where({ 'select.axis': 'x' })
    .first();

  if (missing(xEdge)) {
    Log.error(
      "Expecting chart definition to have series.select.axis=='x'; pointing to the X axis",
    );
  }

  // BE SURE THE xEdge IS LAST (SO IT LINES UP WITH ChartJS datasetIndex
  options.series = [...options.series.filter(s => s !== xEdge), xEdge];
  // ENSURE ALL SERIES HAVE A COLOR
  options.series.forEach((s, i) => {
    Data.setDefault(
      s,
      { style: standardOptions.style },
      { style: { color: SETTINGS.colors[i] }, select: { axis: 'y' } },
    );
  });

  const x = xEdge.select;
  const xSelector = jx(x.value);

  xEdge.selector = xSelector;

  const datasets = selectFrom(options.series)
    .filter(s => s !== xEdge)
    .map((s) => {
      const { select: y, style, type } = s;
      const color = Data.get(style, 'color');

      // CHART A RANGE, OVER TIME (INDEPENDENT VARIABLE)
      if (exists(y.range)) {
        const yMin = jx(y.range.min);
        const yMax = jx(y.range.max);

        // eslint-disable-next-line no-param-reassign
        s.selector = row => ({ min: yMin(row), max: yMax(row) });

        return [
          {
            type: 'line',
            label: null,
            data: selectFrom(options.data)
              .select({
                [y.axis]: yMin,
                [x.axis]: r => Date.newInstance(xSelector(r)),
              })
              .toArray(),
            ...generateDatasetStyle(color, 'line'),
            borderColor: invisible,
          },
          {
            type: 'line',
            label: s.label,
            data: selectFrom(options.data)
              .select({
                [y.axis]: yMax,
                [x.axis]: r => Date.newInstance(xSelector(r)),
              })
              .toArray(),
            ...generateDatasetStyle(color, type),
            fill: '-1',
            borderColor: invisible,
          },

        ];
      }

      // SINGLE VALUE
      const ySelector = jx(y.value);

      // eslint-disable-next-line no-param-reassign
      s.selector = ySelector;

      return [{
        type,
        label: s.label,
        data: selectFrom(options.data)
          .select({
            [y.axis]: ySelector,
            [x.axis]: r => Date.newInstance(xSelector(r)),
            note: 'note',
          })
          .toArray(),
        ...generateDatasetStyle(color, type),
      }];
    })
    .flatten()
    .toArray();
  const {
    title, tooltips, ticksCallback, onClick,
  } = options;
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
          .select('y'), // TODO: This 'y' may not equal y.axis (above)
      ),
    );

    if (isData(requestedMax)) {
      return min([requestedMax.max, max([niceMax, requestedMax.min])]);
    }

    return niceMax;
  })();
  const yMin = (() => {
    const requestedMin = Data.get(options, 'axis.y.min');

    if (isNumeric(requestedMin)) {
      return requestedMin;
    }

    const mini = selectFrom(datasets)
      .select('data')
      .flatten()
      .select('y') // TODO: This 'y' may not equal y.axis (above)
      .min();
    return min([mini, 0]);
  })();
  const yReversed = Data.get(options, 'axis.y.reverse');

  // MARK EXTREME POINTS AS TRIANGLES, AND AT MAX CHART VALUE
  datasets.forEach((dataset) => {
    const { data, pointStyle } = dataset;
    let needNewStyle = false;
    const newStyle = data.map((d) => {
      if (exists(d.note)) {
        needNewStyle = true;
        return [pointStyle, 0];
      } if (d.y > yMax) {
        // eslint-disable-next-line no-param-reassign
        d.y = yMax;
        needNewStyle = true;
        return ['triangle', 0];
      } if (d.y < yMin) {
        // eslint-disable-next-line no-param-reassign
        d.y = yMin;
        needNewStyle = true;
        return ['triangle', 180];
      }
      return [pointStyle, 0];
    });

    if (needNewStyle) {
      [
        // eslint-disable-next-line no-param-reassign
        dataset.pointStyle,
        // eslint-disable-next-line no-param-reassign
        dataset.pointRotation,
      ] = zip(...newStyle);

      // eslint-disable-next-line no-param-reassign
      if (yReversed) dataset.pointRotation = data.map(v => v - 180);
    }
  });

  const yAxes = [
    {
      ticks: {
        beginAtZero: true,
        reverse: yReversed,
        min: yMin,
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
    type: 'line', // dummy value to get legend to show
    options: {
      animation: false,
      legend: {
        labels: {
          boxWidth: 10,
          fontSize: 10,
          filter: item => exists(item.text),
        },
      },
      scales: {
        xAxes,
        yAxes,
      },
      backgroundColor: 'rgb(255,0,0)',
    },
    data: { datasets },
  };
  if (ticksCallback) {
    cjsOptions.options.scales.yAxes[0].ticks.callback = ticksCallback;
  }

  if (tooltips) {
    cjsOptions.options.tooltips = tooltips;
  }

  if (title) {
    cjsOptions.options.title = {
      display: true,
      text: title,
    };
  }

  if (onClick) {
    cjsOptions.options.onClick = onClick;
  }

  return { cjsOptions, standardOptions: options };
};


// eslint-disable-next-line import/prefer-default-export
export { cjsGenerator };
