import React, { Component } from 'react';
import { Router, Route, browserHistory } from 'react-router';

import Home from './home.js';
import ReleaseCrashes from './crashes/release.js';
import BetaCrashes from './crashes/beta.js';
import Regressions from './regressions.js';

const NoMatch = () => (<div>404</div>);

export default class Routes extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path='/' name='home' component={Home} />
        <Route path='/crashes' name='crashes' component={ReleaseCrashes} />
        <Route path='/crashes/beta' name='crashes-beta' component={BetaCrashes} />
        <Route path='/regressions' name='regressions' component={Regressions} />
        <Route path='*' component={NoMatch} />
      </Router>
    );
  }
}
