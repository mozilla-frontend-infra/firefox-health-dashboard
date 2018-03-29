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
    <Route path='/quantum32bit' exact component={Quantum32bit} />
    <Route path='/quantum64bit' exact component={Quantum64bit} />

    <Route path='/quantum32bit/responsiveness/parent' component={QuantumResponsivenessParent} />
    <Route path='/quantum32bit/responsiveness/content' component={QuantumResponsivenessContent} />
    <Route path='/quantum32bit/pageload/render' component={QuantumPageLoadRender} />
    <Route path='/quantum32bit/track' component={QuantumTracking} />
    <Route path='/quantum32bit/:platform/:suite' component={Subbenchmark} />

    <Route path='/quantum64bit/responsiveness/parent' component={QuantumResponsivenessParent} />
    <Route path='/quantum64bit/responsiveness/content' component={QuantumResponsivenessContent} />
    <Route path='/quantum64bit/pageload/render' component={QuantumPageLoadRender} />
    <Route path='/quantum64bit/track' component={QuantumTracking} />
    <Route path='/quantum64bit/:platform/:suite' component={Subbenchmark} />
  </Switch>
);

export default routes;
