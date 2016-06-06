import 'babel-polyfill';
import React from 'react';
import FirefoxAdiCrashes from './firefox-adi';
import FennecAdiCrashes from './fennec-adi';
import FirefoxUtCrashes from './firefox-ut';

const Crashes = () => (
  <div className='dashboard'>
    <FirefoxAdiCrashes />
    <FennecAdiCrashes />
    <FirefoxUtCrashes />
  </div>
);

export default Crashes;
