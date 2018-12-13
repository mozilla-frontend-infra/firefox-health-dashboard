const generateOptions = (options = {}) => {
    const { title, scaleLabel, reverse = false, tooltipFormat, tooltips } = options;
    const chartJsOptions = {
        legend: {
            labels: {
                boxWidth: 10,
                fontSize: 10,
            },
        },
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    displayFormats: { hour: 'MMM D' },
                },
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    reverse,
                },
            }],
        },
    };
    if (title) {
        chartJsOptions.title = {
            display: true,
            text: title,
        };
    }
    if (tooltipFormat) {
        chartJsOptions.scales.xAxes[0].time.tooltipFormat = 'll';
    }

    if (tooltips) {
        chartJsOptions.tooltips = tooltips;
    }

    if (scaleLabel) {
        chartJsOptions.scales.yAxes[0].scaleLabel = {
            display: true,
            labelString: scaleLabel,
        };
    }
    return chartJsOptions;
};

export default generateOptions;
