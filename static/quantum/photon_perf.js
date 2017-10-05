/* global fetch */
import React from 'react';
// import PropTypes from 'prop-types';
import Benchmark from './benchmark';


// const TelemetryPlotContainer = ({ evolutions }) => (
//   <div>
//     {evolutions.map(({ evo }) => (
//       <div key={evo.measure}>
//         <div>{evo}</div>
//       </div>
//     ))}
//   </div>
// );
//
// TelemetryPlotContainer.propTypes = {
//   evolutions: PropTypes.array,
// };

export default class PhotonPerfContainer extends React.Component {
  constructor(props) {
    super(props);
    this.fetchEvolutions();
  }

  async fetchEvolutions() {
    const evolutions = await (await fetch('/api/perf/notes')).json();
    console.log(evolutions);
    this.setState({
      evolutions,
    });
  }

  render() {
    const { evolutions } = this.state;

    return (
      <Benchmark
        title='Photon performance benchmark'
        id='photon-perf'
        link='http://astithas.com/perm/photon-perf/'
        targetDiff={20}
        type='line'
      />
    );
  }
}
