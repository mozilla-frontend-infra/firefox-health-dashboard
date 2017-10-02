import React from 'react';
import PropTypes from 'prop-types';


const TelemetryPlotContainer = ({ evolutions }) => (
  <div>
    {evolutions.map(({ evo }) => (
      <div key={evo.measure}>
        <div>{evo}</div>
      </div>
    ))}
  </div>
);

TelemetryPlotContainer.propTypes = {
  evolutions: PropTypes.array,
};

export default class PhotonPerfContainer extends React.Component {
  state = {
    evolutions: [],
  }
  componentDidMount() {
    // TODO: Fetch /api/perf/photon
  }

  render() {
    const { evolutions } = this.state;

    return (<TelemetryPlotContainer evolutions={evolutions} />);
  }
}
