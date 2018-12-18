import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './home';
import AndroidPage from './views/Android';
import JsTeam from './views/JsTeam';
import NimbledroidGraphPage from './views/NimbledroidGraph';
import Quantum64 from './quantum/index-64bit';
import Quantum32 from './quantum/index-32bit';
import TP6 from './quantum/tp6';
import Subbenchmark from './quantum/subbenchmarks';
import FlowTable from './quantum/flow-table';

const NoMatch = () => <div>404</div>;

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route path='/quantum/tp6' component={TP6} />
      <Route path='/android/graph' component={NimbledroidGraphPage} />
      <Route path='/android' component={AndroidPage} />
      <Route path='/quantum/:architecture/bugs' component={FlowTable} />
      <Route path='/quantum/:platform/:suite' component={Subbenchmark} />
      <Route path='/quantum/32' component={Quantum32} />
      <Route path='/quantum/64' component={Quantum64} />
      <Route path='/js-team' component={JsTeam} />
      <Route path='/' component={Home} />
      <Route component={NoMatch} />
    </Switch>
  </BrowserRouter>
);

Routes.propTypes = {
  location: PropTypes.object,
};

export default Routes;
