
import 'babel-polyfill';
import React from 'react';
import FirefoxAdiCrashes from './crashes/firefox-adi';
import FennecAdiCrashes from './crashes/fennec-adi';
import FirefoxUtCrashes from './crashes/firefox-ut';

export default class Crashes extends React.Component {
  render() {
    return (
      <div className='dashboard'>
        <FirefoxAdiCrashes />
        <FennecAdiCrashes />
        <FirefoxUtCrashes />
      </div>
    );
  }
}
