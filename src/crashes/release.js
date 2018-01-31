import React from 'react';
import PropTypes from 'prop-types';
import FirefoxUtCrashes from './firefox-ut';
import Dashboard from '../dashboard';

export default class Crashes extends React.Component {
  render() {
    return (
      <Dashboard
        title='Crash Rate'
        subtitle='Firefox Release'
        className='crashes-release'
      >
        <FirefoxUtCrashes />
      </Dashboard>
    );
  }
}

Crashes.propTypes = {
  location: PropTypes.object,
};
