const dataToChartJSformat = data =>
  data.map(({ datetime, value }) => ({
    x: datetime,
    y: value,
  }));

const chartJsOptions = (reverse, scaleLabel) => ({
  scales: {
    xAxes: [
      {
        type: 'time',
        time: {
          displayFormats: {
            hour: 'MMM D',
          },
        },
      },
    ],
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
          reverse,
        },
        scaleLabel: {
          display: true,
          labelString: scaleLabel,
        },
      },
    ],
  },
});

const generateChartJsOptions = (meta) => {
  const higherIsBetter = (meta.lower_is_better === false);
  const yLabel = higherIsBetter ? 'Score' : 'Execution time (ms)';
  return chartJsOptions(higherIsBetter, yLabel);
};

// This function combines Perfherder series and transforms it into ChartJS formatting
const chartJsFormatter = (series) => {
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

export default chartJsFormatter;
