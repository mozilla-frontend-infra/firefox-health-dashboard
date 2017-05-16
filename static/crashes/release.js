import 'babel-polyfill';
import React from 'react';
import PropTypes from 'prop-types';
import FirefoxAdiCrashes from './firefox-adi';
import FennecAdiCrashes from './fennec-adi';
import FirefoxUtCrashes from './firefox-ut';
import Dashboard from '../dashboard';

export default class Crashes extends React.Component {
  render() {
    const query = this.props.location.query;
    const full = (query && query.full) ? 1 : 0;
    return (
      <Dashboard
        title='ADI & Telemetry Crash Rate'
        subtitle='Firefox Release'
        className='crashes-release'
      >
        <FirefoxAdiCrashes full={full} />
        <FennecAdiCrashes full={full} />
        <FirefoxUtCrashes />
      </Dashboard>
    );
  }
}

Crashes.propTypes = {
  location: PropTypes.object,
};
