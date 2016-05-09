import { render } from 'react-dom';
import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

import './index.css';
import Home from './home.js';
import Crashes from './crashes.js';
import Regressions from './regressions.js';

const NoMatch = () => (<div>404</div>);

render((
  <Router history={browserHistory}>
    <Route path='/' component={Home} />
    <Route path='/crashes' component={Crashes} />
    <Route path='/regressions' component={Regressions} />
    <Route path='*' component={NoMatch} />
  </Router>
), document.getElementById('root'));
