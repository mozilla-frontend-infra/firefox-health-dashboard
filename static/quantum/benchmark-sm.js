/* global fetch */
import 'babel-polyfill';
import React from 'react';
import { Link } from 'react-router';
import Dashboard from './../dashboard';

export default class QuantumBenchmarks extends React.Component {
  render() {
    return (
      <Dashboard
        title='Quantum Benchmarks'
        subtitle='Speedometer (Responsiveness)'
        className='quantum-benchmarks'
      >
        <div className='benchmark-sm' key='benchmark-sm'>
          <div>
            <span className='label-chrome'>Chrome</span>
            <span className='label-firefox'>Firefox</span>
          </div>
        </div>
      </Dashboard>
    );
  }
}
