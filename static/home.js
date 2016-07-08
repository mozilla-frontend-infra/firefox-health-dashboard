/* global fetch */
import 'babel-polyfill';
import React from 'react';
import { Link } from 'react-router';
import Dashboard from './dashboard';

export default class Home extends React.Component {
  render() {
    return (
      <Dashboard
        title='Platform'
        subtitle='Metrics & Insights'
        className='home'
      >
        <Link to='/crashes'>Crashes</Link>
        <Link to='/crashes/beta'>Beta Crashes</Link>
        <Link to='/status'>Feature Status</Link>
      </Dashboard>
    );
  }
}
