import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';

import Quantum from './index-64bit';
import Quantum32bit from './index-32bit';
import QuantumResponsivenessParent from './responsiveness-parent';
import QuantumResponsivenessContent from './responsiveness-content';
import QuantumPageLoadRender from './pageload-render';
import QuantumTracking from './metric';
import Subbenchmark from './subbenchmarks';

const routes = props => (
  <Switch>
    <Route
      path='/quantum/:architecture'
      exact
      render={() => (
        props.location.pathname === '/quantum/32' ?
          <Quantum32bit {...props} /> :
          <Quantum {...props} />
      )}
    />
    <Route path='/quantum/:architecture/responsiveness/parent' component={QuantumResponsivenessParent} />
    <Route path='/quantum/:architecture/responsiveness/content' component={QuantumResponsivenessContent} />
    <Route path='/quantum/:architecture/pageload/render' component={QuantumPageLoadRender} />
    <Route path='/quantum/:architecture/track' component={QuantumTracking} />
    <Route path='/quantum/:architecture/:platform/:suite' component={Subbenchmark} />
  </Switch>
);

routes.propTypes = {
  location: PropTypes.object,
};

export default routes;
