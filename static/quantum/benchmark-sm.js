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
        source='https://arewefastyet.com/#machine=17&view=breakdown&suite=speedometer-misc'
        sourceTitle='AWFY (Log in required)'
        link='https://bit.ly/quantum-dashboards'
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
