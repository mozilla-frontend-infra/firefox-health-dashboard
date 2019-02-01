import generateDatasetStyle from './generateDatasetStyle';
import SETTINGS from '../../settings';
import CONFIG from '../nimbledroid/config';

const dataToChartJSformat = data => (
    data.map(({ date, value }) => ({
        x: date,
        y: value,
    }))
);

const nimbledroidFormatter = ({ data }) => ({
    datasets: Object.keys(data).map((packageId, index) => ({
        data: dataToChartJSformat(data[packageId]),
        label: CONFIG.packageIdLabels[packageId],
        ...generateDatasetStyle(SETTINGS.colors[index]),
    })),
});

export default nimbledroidFormatter;
