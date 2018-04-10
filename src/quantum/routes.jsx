import { Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import Quantum64 from './index-64bit';
import Quantum32 from './index-32bit';
import QuantumResponsivenessParent from './responsiveness-parent';
import QuantumResponsivenessContent from './responsiveness-content';
import QuantumPageLoadRender from './pageload-render';
import QuantumTracking from './metric';
import Subbenchmark from './subbenchmarks';

const routes = props => (
  <Switch>
    <Redirect exact from='/quantum' to='/' />
    <Route
      path='/quantum/:architecture'
      exact
      render={() => (
        props.location.pathname === '/quantum/32' ?
          <Quantum32 {...props} /> :
          <Quantum64 {...props} />
      )}
    />
    <Route path='/quantum/:architecture/responsiveness/parent' component={QuantumResponsivenessParent} />
    <Route path='/quantum/:architecture/responsiveness/content' component={QuantumResponsivenessContent} />
    <Route path='/quantum/:architecture/pageload/render' component={QuantumPageLoadRender} />
    <Route path='/quantum/:architecture/track' component={QuantumTracking} />
    <Route path='/quantum/:platform/:suite' component={Subbenchmark} />
  </Switch>
);

routes.propTypes = {
  location: PropTypes.object,
};

export default routes;
