import SETTINGS from '../../settings';
import Color from '../../vendor/colors';
import { missing } from '../../vendor/utils';

const invisible = 'rgba(0,0,0,0)';
const generateLineChartStyle = ({ color }) => ({
  backgroundColor: color,
  borderColor: color,
  fill: false,
  pointRadius: '0',
  pointHoverBackgroundColor: 'white',
  lineTension: 0.1,
});
const generateScatterChartStyle = ({ color }) => {
  const gentleColor = missing(color)
    ? color
    : Color.parseHTML(color)
        .setOpacity(0.7)
        .toRGBA();

  return {
    backgroundColor: gentleColor,
    borderWidth: 0,
    borderColor: invisible,
    fill: false,
    lineTension: 0,

    pointRadius: 3,
    pointBackgroundColor: invisible,
    pointBorderColor: gentleColor,
    pointBorderWidth: 2,
    pointHitRadius: 10,

    pointHoverRadius: 3,
    pointHoverBackgroundColor: color,
    pointHoverBorderColor: gentleColor,
    pointHoverBorderWidth: 6,
  };
};

const generateDatasetStyle = ({ index, color, type = 'line' }) => {
  const selectedColor = color || SETTINGS.colors[index];

  if (type === 'scatter') {
    return generateScatterChartStyle({ color: selectedColor });
  }

  return generateLineChartStyle({ color: selectedColor });
};

export default generateDatasetStyle;
