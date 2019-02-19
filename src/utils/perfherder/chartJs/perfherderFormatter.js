import { parse } from 'query-string';
import generateDatasetStyle from '../../chartJs/generateDatasetStyle';
import SETTINGS from '../../../settings';

const dataToChartJSformat = data =>
  data.map(({ datetime, value }) => ({
    x: datetime,
    y: value,
  }));
const generateInitialOptions = series => {
  const higherIsBetter = !series.meta.lower_is_better;
  const higherOrLower = higherIsBetter ? 'higher is better' : 'lower is better';

  return {
    reverse: higherIsBetter,
    scaleLabel: higherIsBetter ? 'Score' : 'Load time',
    tooltips: {
      callbacks: {
        footer: (tooltipItems, data) => {
          // get data from all points of selected series
          const dataset = data.datasets[tooltipItems[0].datasetIndex].data;
          // get data from selected point
          const currentData = dataset[tooltipItems[0].index].y;
          const tooltipData = []; // footer's text lines will be stored here
          let delta = 0;
          let deltaPercentage = 0;

          if (tooltipItems[0].index > 0) {
            const previousData = dataset[tooltipItems[0].index - 1].y;

            delta = currentData - previousData;
            // [(c - p) / p] * 100 is equivalent to (c / p - 1) * 100
            deltaPercentage = (currentData / previousData - 1) * 100;
          }

          delta = delta.toFixed(2);
          deltaPercentage = deltaPercentage.toFixed(2);

          const indicator = `${currentData} (${higherOrLower})`;
          const deltaLine = `Δ ${delta} (${deltaPercentage}%)`;

          tooltipData.push(indicator, deltaLine);

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
