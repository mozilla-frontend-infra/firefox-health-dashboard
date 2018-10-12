const generateOptions = ({
    title,
    scaleLabel = 'Miliseconds',
    reverse = false,
}) => {
    const options = {
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
