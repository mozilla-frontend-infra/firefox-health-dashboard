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
        subtitle='Visual Page Load'
        className='quantum-benchmarks'
        source='https://docs.google.com/spreadsheets/d/1Kxn850VasyaG_WfRg3pMInW0hbIT8LP7pRPBYTIpdbM/edit'
        sourceTitle='Spreadsheet by :bsmedberg'
      >
        <iframe
          scrolling='no'
          src='https://docs.google.com/spreadsheets/d/1UMsy_sZkdgtElr2buwRtABuyA3GY6wNK_pfF01c890A/pubchart?oid=334349786&format=interactive'
        />
      </Dashboard>
    );
  }
}
