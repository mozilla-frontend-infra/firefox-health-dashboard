import PropTypes from 'prop-types';
import Chart from 'react-chartjs-2';

const PerfherderGraph = ({ data, options }) => (
  <Chart
    type="scatter"
    data={data}
    height={50}
    options={options}
  />
);

PerfherderGraph.propTypes = {
    data: PropTypes.shape({}).isRequired,
    options: PropTypes.shape({}).isRequired,
};

export default PerfherderGraph;
