import generateLineChartStyles from './generateLineChartStyles';
import SETTINGS from '../../settings';

const dataToChartJSformat = data => (
    data.map(({ date, value }) => ({
        x: date,
        y: value,
    }))
);

const nimbledroidFormatter = ({ data }) => ({
    datasets: Object.keys(data).map((packageId, index) => ({
        data: dataToChartJSformat(data[packageId]),
        label: packageId,
        ...generateLineChartStyles(SETTINGS.colors[index]),
    })),
});

export default nimbledroidFormatter;
