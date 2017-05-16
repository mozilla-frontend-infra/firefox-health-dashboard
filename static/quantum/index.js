/* global fetch */
import 'babel-polyfill';
import React from 'react';
import { Link } from 'react-router';
import Dashboard from './../dashboard';
import Perfherder from './perfherder';

export default class QuantumIndex extends React.Component {
  render() {
    return (
      <Dashboard
        title='Quantum'
        subtitle='Metrics & Insights'
        className='summary'
      >
        <div className='row'>
          <Perfherder
            title='Page Load (tp5)'
            signatures='ac46ba40f08bbbf209a6c34b8c054393bf222e67,b68e2b084272409d7def3928a55baf0e00f3888a'
          />
          <Perfherder
            title='Tabswitch (tps)'
            signatures='a86a2a069ed634663dbdef7193f2dee69b50dbc9,cfc195cb8dcd3d23be28f59f57a9bb68b8d7dfe2'
          />
          <Perfherder
            title='Browser Start-Up (ts_paint)'
            signatures='f04c0fb17ff70e2b5a99829a64d51411bd187d0a,e394aab72917d169024558cbab33eb4e7e9504e1'
          />
        </div>
        <div className='row'>
          <Perfherder
            title='Session Restore'
            signatures='196b82960327035de720500e1a5f9f0154cf97ad,555ac79a588637a3ec5752d5b9b3ee769a55d7f6'
          />
          <Perfherder
            title='Tab Opening (tabpaint)'
            signatures='0bec96d78bc54370bd027af09bdd0edc8df7afd7,26721ba0e181e2844da3ddc2284a331ba54eefe0'
          />
          <Perfherder
            title='Window Resizing (tresize)'
            signatures='869039422d1ff5a11ecef1a48ab7fc3877d8c13d,a14119c4d02daaf55113e3945c4385f4c927da27'
          />
        </div>
        <div className='row' />
      </Dashboard>
    );
  }
}
