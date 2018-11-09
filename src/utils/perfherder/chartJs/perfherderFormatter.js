import { parse } from 'query-string';
import generateLineChartStyles from '../../chartJs/generateLineChartStyles';
import SETTINGS from '../../../settings';

const dataToChartJSformat = data => data.map(({ datetime, value }) => ({
    x: datetime,
    y: value,
  }));

// This function combines Perfherder series and transforms it into ChartJS formatting
const perfherderFormatter = (series) => {
  // The first series defines the whole set
  const reverse = (series[0].meta && series[0].meta.lower_is_better) || true;
  const newData = {
    data: { datasets: [] },
    options: {
      reverse,
      scaleLabel: reverse ? 'Score' : 'Execution time (ms)',
    },
  };

  series.forEach(({ data, perfherderUrl, label }, index) => {
    if (data) {
      newData.data.datasets.push({
        ...generateLineChartStyles(SETTINGS.colors[index]),
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
