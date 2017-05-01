/* global fetch */
import 'babel-polyfill';
import React from 'react';
import { Link } from 'react-router';
import Dashboard from './../dashboard';

export default class QuantumIndex extends React.Component {
  render() {
    return (
      <Dashboard
        title='Quantum'
        subtitle='Metrics & Insights'
        className='home'
      >
        <h2>Nightly Telemetry</h2>
        <Link to='/quantum/pageload/render'>Pageload: First Render</Link>
        <h2>Benchmarks</h2>
        <Link to='/quantum/benchmark/pageload'>Page Load</Link>
        <Link to='/quantum/benchmark/sm'>SM</Link>
        <Link to='/quantum/benchmark/hasal'>Hasal</Link>
        <h2>Engineering</h2>
        <Link to='/quantum/responsiveness/parent'>Responsiveness: Parent</Link>
        <Link to='/quantum/responsiveness/content'>Responsiveness: Content</Link>
      </Dashboard>
    );
  }
}
