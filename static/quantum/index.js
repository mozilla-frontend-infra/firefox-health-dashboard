/* global fetch */
import 'babel-polyfill';
import React from 'react';
import Dashboard from './../dashboard';

export default class QuantumIndex extends React.Component {
  state = {};

  componentDidMount() {
    this.fetch();
    if (this.target) {
      const rect = this.target.getBoundingClientRect();
      this.width = rect.width;
      this.height = rect.height;
    }
  }

  height = 0;
  width = 0;

  async fetch() {
    this.setState({
      tmo: null,
    });
  }

  render() {
    // const { tmo } = this.state;
    return (
      <Dashboard
        title='Firefox 57 (Quantum)'
        subtitle='Release Criteria'
        className='quantum-index'
      >
        <section>
          Page Load
        </section>
        <section>
          Engegament
        </section>
      </Dashboard>
    );
  }
}

QuantumIndex.defaultProps = {
};
QuantumIndex.propTypes = {
};
