import React from 'react';
import { Link } from 'react-router-dom';
import Dashboard from './dashboard';

export default class Home extends React.Component {
  render() {
    return (
      <Dashboard
        title='Firefox health'
        subtitle='Tracking metrics for Firefox products'
        className='home'
      >
        <Link to='/android'>Android</Link>
        <Link to='/quantum/32'>Quantum 32bit</Link>
        <Link to='/quantum/64'>Quantum 64bit</Link>
        <a
          href='https://github.com/mozilla-frontend-infra/firefox-health-dashboard/issues/172'
          style={{ fontSize: '0.75rem' }}
        >
          Few routes being EOL. Read more about it
        </a>
      </Dashboard>
    );
  }
}
