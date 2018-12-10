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
        <Link to='/js-team'>JS team</Link>
      </Dashboard>
    );
  }
}
