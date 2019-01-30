const generateLineChartStyle = color => ({
  backgroundColor: color,
  borderColor: color,
  fill: false,
  pointRadius: '0',
  pointHoverBackgroundColor: 'white',
});
const generateScatterChartStyle = color => ({
  backgroundColor: color,
});
const generateDatasetStyle = (color, type = 'line') =>
  type === 'scatter'
    ? generateScatterChartStyle(color)
    : generateLineChartStyle(color);

export default generateDatasetStyle;
