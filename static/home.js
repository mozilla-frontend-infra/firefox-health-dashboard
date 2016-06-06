/* global fetch */

import 'babel-polyfill';
import React from 'react';
import { Link } from 'react-router';

const Home = () => (
  <div>
    <Link to='/crashes'>Crashes</Link>
    |
    <Link to='/crashes/beta'>Beta Crashes</Link>
  </div>
);

export default Home;
