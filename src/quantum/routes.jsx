import { Route, Switch } from 'react-router-dom';

import Quantum from './index';
import QuantumResponsivenessParent from './responsiveness-parent';
import QuantumResponsivenessContent from './responsiveness-content';
import QuantumPageLoadRender from './pageload-render';
import QuantumTracking from './metric';
import Subbenchmark from './subbenchmarks';

const routes = () => (
  <Switch>
    <Route path='/quantum' exact component={Quantum} />
    <Route path='/quantum/responsiveness/parent' component={QuantumResponsivenessParent} />
    <Route path='/quantum/responsiveness/content' component={QuantumResponsivenessContent} />
    <Route path='/quantum/pageload/render' component={QuantumPageLoadRender} />
    <Route path='/quantum/track' component={QuantumTracking} />
  </Switch>
);

export default routes;
