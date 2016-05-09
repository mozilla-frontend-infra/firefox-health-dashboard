/* global fetch */

import 'babel-polyfill';
import React from 'react';
import { Link } from 'react-router';

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <Link to='/crashes'>Crashes</Link> | <Link to='/regressions'>Regressions</Link>
      </div>
    );
  }
}
