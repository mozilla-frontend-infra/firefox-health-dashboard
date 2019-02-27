import { parse } from 'query-string';
import generateDatasetStyle from '../../chartJs/generateDatasetStyle';
import SETTINGS from '../../../settings';
// import generateCustomTooltip from '../../chartJs/generateCustomTooltipTest';
import generateCustomTooltip from '../../chartJs/generateCustomTooltip';

const dataToChartJSformat = data =>
  data.map(({ datetime, value }) => ({
    x: datetime,
    y: value,
  }));
const generateInitialOptions = series => {
  // The first series' metadata defines the whole set
  const higherIsBetter = !series[0].meta.lower_is_better;

  return {
    reverse: higherIsBetter,
    scaleLabel: higherIsBetter ? 'Score' : 'Load time',
    tooltips: {
      enabled: false,
      custom(tooltipModel) {
        // eslint-disable-next-line no-underscore-dangle
        const { canvas } = this._chart;

        generateCustomTooltip(canvas, tooltipModel, series);
      },
    },
  };
};

/* This function combines Perfherder series and transforms it 
into ChartJS formatting */
const perfherderFormatter = series => {
  const newData = {
    data: { datasets: [] },
    // all the series beed to be send, in order to build a custom tooltip
    options: generateInitialOptions(series),
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
