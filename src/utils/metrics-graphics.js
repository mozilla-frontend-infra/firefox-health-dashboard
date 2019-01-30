import MG from 'metrics-graphics';

// This graph shows multiple lines on a graph
const graph = specs => {
  const { target, data, legend, title, legendTarget, markers } = specs;

  // For every series let's convert the values to proper dates
  data.map(evo => MG.convert.date(evo, 'date'));
  MG.data_graphic({
    title,
    full_width: true,
    full_height: true,
    data,
    target,
    legend,
    legendTarget,
    markers,
  });
};

export default graph;
