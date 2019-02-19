import { parse } from 'query-string';
import generateDatasetStyle from '../../chartJs/generateDatasetStyle';
import SETTINGS from '../../../settings';

const dataToChartJSformat = data =>
  data.map(({ datetime, value }) => ({
    x: datetime,
    y: value,
  }));
const generateInitialOptions = series => {
  // TODO: map tests and suite scores to measurement units and
  // add some label for scale
  const isTest = !!series.meta.test;
  // CRAZY ASSUMPTION THAT TESTS ARE A MEASURE OF DURATION
  const higherIsBetter = isTest ? false : !series.meta.lower_is_better;
  const higherOrLower = higherIsBetter ? 'higher is better' : 'lower is better';

  return {
    reverse: higherIsBetter,
    scaleLabel: higherIsBetter ? 'Score' : 'Duration',
    tooltips: {
      callbacks: {
        footer: (tooltipItems, data) => {
          const tooltipData = [];
          let delta = 'n/a';
          let deltaPercentage = 'n/a';
          let dataset = 'n/a';
          let currentData = 'n/a';

          if (tooltipItems[0].index > 0) {
            dataset = data.datasets[tooltipItems[0].datasetIndex].data;

            currentData = dataset[tooltipItems[0].index].y;
            const previousData = dataset[tooltipItems[0].index - 1].y;

            delta = (currentData - previousData).toFixed(2);
            deltaPercentage = (
              ((currentData - previousData) / previousData) *
              100
            ).toFixed(2);
          }

          const indicator = `${currentData} (${higherOrLower})`;

          tooltipData.push(indicator, `Δ ${delta} (${deltaPercentage}%)`);

          return tooltipData;
        },
      },
    },
  };
};

/* This function combines Perfherder series and transforms it
into ChartJS formatting */
const perfherderFormatter = series => {
  // The first series' metadata defines the whole set
  const newData = {
    data: { datasets: [] },
    options: generateInitialOptions(series[0]),
  };

  series.forEach(({ color, data, label, perfherderUrl }, index) => {
    if (data) {
      newData.data.datasets.push({
        ...generateDatasetStyle(color || SETTINGS.colors[index]),
        label,
        data: dataToChartJSformat(data),
      });
    }

    if (!newData.jointUrl) {
      newData.jointUrl = perfherderUrl;
    } else {
      // We're joining the different series for each subbenchmark
      const parsedUrl = parse(perfherderUrl);

      newData.jointUrl += `&series=${parsedUrl.series}`;
    }
  });

  return newData;
};

export default perfherderFormatter;
