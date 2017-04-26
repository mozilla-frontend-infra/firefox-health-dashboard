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
        subtitle='Hasal (Responsiveness)'
        className='quantum-benchmarks'
        source='https://docs.google.com/spreadsheets/d/1UMsy_sZkdgtElr2buwRtABuyA3GY6wNK_pfF01c890A/edit#gid=0'
        sourceTitle='Spreadsheet'
      >
        <iframe
          scrolling='no'
          src='https://docs.google.com/spreadsheets/d/1UMsy_sZkdgtElr2buwRtABuyA3GY6wNK_pfF01c890A/pubchart?oid=1602308955&format=interactive'
        />
      </Dashboard>
    );
  }
}
