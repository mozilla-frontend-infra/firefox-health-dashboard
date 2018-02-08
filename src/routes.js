/* eslint react/no-multi-comp: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import Home from './home';
import ReleaseCrashes from './crashes/release';
import BetaCrashes from './crashes/beta';
import Status from './status/index';
import Quantum from './quantum/index';
import Devtools from './devtools/index';
import QuantumResponsivenessParent from './quantum/responsiveness-parent';
import QuantumResponsivenessContent from './quantum/responsiveness-content';
import QuantumPageLoadRender from './quantum/pageload-render';
import QuantumTracking from './quantum/metric';

const NoMatch = () => <div>404</div>;

class App extends Component {
  componentWillMount() {
    this.resize();
    let throttle = 0;
    window.addEventListener('resize', () => {
      clearTimeout(throttle);
      throttle = setTimeout(() => this.resize(), 100);
    });
  }

  resize() {
    this.setState({
      gridX: parseInt(
        window.getComputedStyle(document.body, null).getPropertyValue('font-size'),
        10,
      ),
      gridY: parseInt(
        window.getComputedStyle(document.body, null).getPropertyValue('line-height'),
        10,
      ),
      viewport: [window.innerWidth, window.innerHeight],
    });
    const children = this.props.children;
    if (children && children.onResize) {
      children.onResize(this.state);
    }
  }

  render() {
    return React.cloneElement(this.props.children, this.state);
  }
}

App.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default class Routes extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path='/' component={App}>
          <IndexRoute component={Home} />
          <Route path='crashes' component={ReleaseCrashes} />
          <Route path='crashes/beta' component={BetaCrashes} />
          <Route path='quantum' component={Quantum} />
          <Route path='quantum/responsiveness/parent' component={QuantumResponsivenessParent} />
          <Route path='quantum/responsiveness/content' component={QuantumResponsivenessContent} />
          <Route path='quantum/pageload/render' component={QuantumPageLoadRender} />
          <Route path='quantum/track' component={QuantumTracking} />
          <Route path='status' component={Status} />
          <Route path='devtools' component={Devtools} />
        </Route>
        <Route path='*' component={NoMatch} />
      </Router>
    );
  }
}
