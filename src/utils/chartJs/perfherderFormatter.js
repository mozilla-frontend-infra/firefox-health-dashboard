import generateOptions from './generateOptions';

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

  series.forEach(({ color, data, label }) => {
    newData.data.datasets.push({
      backgroundColor: color,
      label,
      data: dataToChartJSformat(data),
    });
  });

  return newData;
};

export default perfherderFormatter;
