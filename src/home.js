/* global fetch */
import React from 'react';
import { Link } from 'react-router-dom';
import Dashboard from './dashboard';

export default class Home extends React.Component {
  render() {
    return (
      <Dashboard
        title="Platform"
        subtitle="Metrics & Insights"
        className="home"
      >
        <Link to="/crashes">Crashes</Link>
        <Link to="/crashes/beta">Beta Crashes</Link>
        <Link to="/status">Feature Status</Link>
        <Link to="/quantum/32">Quantum 32bit</Link>
        <Link to="/quantum/64">Quantum 64bit</Link>
        <Link to="/android">Android</Link>
      </Dashboard>
    );
  }
}
