import MG from 'metrics-graphics';

// This graph shows multiple lines on a graph
const graph = (graphEl, series, legend, title) => {
  // For every series let's convert the values to proper dates
  series.map(evo => MG.convert.date(evo, 'date'));
  MG.data_graphic({
    title: title,
    full_width: true,
    full_height: true,
    data: series,
    target: graphEl,
    legend: legend,
    legend_target: '.legend',
  });
};

export default graph;
