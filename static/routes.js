/* eslint react/no-multi-comp: 0 */
import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import Home from './home.js';
import ReleaseCrashes from './crashes/release.js';
import BetaCrashes from './crashes/beta.js';
import Regressions from './regressions.js';

const NoMatch = () => (<div>404</div>);

class App extends Component {
  componentWillMount() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.setState({
      gridX: parseInt(
        window.getComputedStyle(document.body, null)
          .getPropertyValue('font-size'),
        10
      ),
      gridY: parseInt(
        window.getComputedStyle(document.body, null)
          .getPropertyValue('line-height'),
        10
      ),
      viewport: [window.innerWidth, window.innerHeight],
    });
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
          <Route path='regressions' component={Regressions} />
        </Route>
        <Route path='*' component={NoMatch} />
      </Router>
    );
  }
}
