import generateOptions from './generateOptions';
import generateLineChartStyles from './generateLineChartStyles';
import SETTINGS from '../../settings';

const dataToChartJSformat = data => data.map(({ datetime, value }) => ({
    x: datetime,
    y: value,
  }));

const generateChartJsOptions = (meta) => {
  const higherIsBetter = (meta.lower_is_better === false);
  return generateOptions({
    reverse: higherIsBetter,
    scaleLabel: higherIsBetter ? 'Score' : 'Execution time (ms)',
  });
};

// This function combines Perfherder series and transforms it into ChartJS formatting
const perfherderFormatter = (series) => {
  const newData = {
    data: { datasets: [] },
    // The first series defines the whole set
    options: generateChartJsOptions(series[0].meta),
  };

  series.forEach(({ data, label }, index) => {
    newData.data.datasets.push({
      ...generateLineChartStyles(SETTINGS.colors[index]),
      label,
      data: dataToChartJSformat(data),
    });
  });

  return newData;
};

export default perfherderFormatter;
