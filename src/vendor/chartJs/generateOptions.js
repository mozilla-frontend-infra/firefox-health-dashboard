const generateOptions = (options = {}) => {
  const {
    title,
    scaleLabel,
    reverse = false,
    ticksCallback,
    onClick,
  } = options;
  const chartJsOptions = {
    legend: {
      labels: {
        boxWidth: 10,
        fontSize: 10,
      },
    },
    scales: {
      xAxes: [
        {
          type: 'time',
          time: {
            displayFormats: { hour: 'MMM D' },
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            reverse,
          },
        },
      ],
    },
  };

  if (ticksCallback) {
    chartJsOptions.scales.yAxes[0].ticks.callback = ticksCallback;
  }

  if (title) {
    chartJsOptions.title = {
      display: true,
      text: title,
    };
  }

  if (scaleLabel) {
    chartJsOptions.scales.yAxes[0].scaleLabel = {
      display: true,
      labelString: scaleLabel,
    };
  }

  if (onClick) {
    chartJsOptions.onClick = onClick;
  }

  return chartJsOptions;
};

export default generateOptions;
