import { parse } from 'query-string';
import generateLineChartStyles from '../../chartJs/generateLineChartStyles';
import SETTINGS from '../../../settings';

const dataToChartJSformat = data => data.map(({ datetime, value }) => ({
  x: datetime,
  y: value,
}));

const generateInitialOptions = (meta) => {
  const higherIsBetter = (meta.lower_is_better === false);
  return {
    reverse: higherIsBetter,
    scaleLabel: higherIsBetter ? 'Score' : 'Load time',
  };
};

// This function combines Perfherder series and transforms it into ChartJS formatting
const perfherderFormatter = (series) => {
  // The first series' metadata defines the whole set
  const newData = {
    data: { datasets: [] },
    options: generateInitialOptions(series[0].meta),
  };

  series.forEach(({ color, data, label, perfherderUrl }, index) => {
    if (data) {
      newData.data.datasets.push({
        ...generateLineChartStyles(color || SETTINGS.colors[index]),
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
