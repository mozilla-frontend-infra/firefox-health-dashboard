import { Route, Switch } from 'react-router-dom';

import Quantum64bit from './index-64bit';
import Quantum32bit from './index-32bit';
import QuantumResponsivenessParent from './responsiveness-parent';
import QuantumResponsivenessContent from './responsiveness-content';
import QuantumPageLoadRender from './pageload-render';
import QuantumTracking from './metric';
import Subbenchmark from './subbenchmarks';

const routes = () => (
  <Switch>
    <Route path='/quantum32bit' component={Quantum32bit} />
    <Route path='/quantum64bit' component={Quantum64bit} />
    <Route path='/quantum/responsiveness/parent' component={QuantumResponsivenessParent} />
    <Route path='/quantum/responsiveness/content' component={QuantumResponsivenessContent} />
    <Route path='/quantum/pageload/render' component={QuantumPageLoadRender} />
    <Route path='/quantum/track' component={QuantumTracking} />
    <Route path='/quantum/:platform/:suite' component={Subbenchmark} />
  </Switch>
);

export default routes;
