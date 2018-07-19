import { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import Home from './home';
import ReleaseCrashes from './crashes/release';
import BetaCrashes from './crashes/beta';
import Status from './status/index';
import Android from './views/Android';
import AndroidV2 from './views/AndroidV2';
import Quantum64 from './quantum/index-64bit';
import Quantum32 from './quantum/index-32bit';
import QuantumResponsivenessParent from './quantum/responsiveness-parent';
import QuantumResponsivenessContent from './quantum/responsiveness-content';
import QuantumPageLoadRender from './quantum/pageload-render';
import QuantumTracking from './quantum/metric';
import Subbenchmark from './quantum/subbenchmarks';
import FlowTable from './quantum/flow-table';

const NoMatch = () => <div>404</div>;

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/android/v2" component={AndroidV2} />
      <Route path="/android" component={Android} />
      <Route path="/crashes/beta" component={BetaCrashes} />
      <Route path="/crashes" component={ReleaseCrashes} />
      <Route path="/status" component={Status} />
      <Route path="/quantum/:architecture/responsiveness/parent" component={QuantumResponsivenessParent} />
      <Route path="/quantum/:architecture/responsiveness/content" component={QuantumResponsivenessContent} />
      <Route path="/quantum/:architecture/pageload/render" component={QuantumPageLoadRender} />
      <Route path="/quantum/:architecture/track" component={QuantumTracking} />
      <Route path="/quantum/:architecture/bugs" component={FlowTable} />
      <Route path="/quantum/:platform/:suite" component={Subbenchmark} />
      <Route path="/quantum/32" component={Quantum32} />
      <Route path="/quantum/64" component={Quantum64} />
      <Route path="/" component={Home} />
      <Redirect from="/quantum" to="/" />
      <Route component={NoMatch} />
    </Switch>
  </BrowserRouter>
);

Routes.propTypes = {
  location: PropTypes.object,
};

export default Routes;
