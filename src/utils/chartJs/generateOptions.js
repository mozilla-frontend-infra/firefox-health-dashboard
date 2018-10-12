const generateOptions = ({
    title = '',
    scaleLabel = 'Miliseconds',
    reverse = false,
}) => {
    const options = {
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
                    displayFormats: {
                    hour: 'MMM D',
                    },
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
        options.title = {
            display: true,
            text: title,
        };
    }
    if (scaleLabel) {
        options.scales.yAxes[0].scaleLabel = {
            display: true,
            labelString: scaleLabel,
        };
    }
    return options;
};

export default generateOptions;
