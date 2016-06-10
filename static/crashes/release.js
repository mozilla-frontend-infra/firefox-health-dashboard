import 'babel-polyfill';
import React from 'react';
import FirefoxAdiCrashes from './firefox-adi';
import FennecAdiCrashes from './fennec-adi';
import FirefoxUtCrashes from './firefox-ut';
import Dashboard from '../dashboard';

export default class Crashes extends React.Component {
  render() {
    return (
      <Dashboard
        title='ADI & Telemetry Crash Rate'
        subtitle='Firefox Release'
        className='crashes-release'
      >
        <FirefoxAdiCrashes />
        <FennecAdiCrashes />
        <FirefoxUtCrashes />
      </Dashboard>
    );
  }
}
