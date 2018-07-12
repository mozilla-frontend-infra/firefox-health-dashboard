/* eslint react/no-multi-comp: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './home';
import ReleaseCrashes from './crashes/release';
import BetaCrashes from './crashes/beta';
import Status from './status/index';
import Devtools from './devtools/index';
import QuantumRoutes from './quantum/routes';
import Android from './views/Android';
import AndroidV2 from './views/AndroidV2';

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
      <BrowserRouter>
        <App>
          <Switch>
            <Route path='/android' exact component={Android} />
            <Route path='/android/v2' exact component={AndroidV2} />
            <Route path='/' exact component={Home} />
            <Route path='/crashes' exact component={ReleaseCrashes} />
            <Route path='/crashes/beta' component={BetaCrashes} />
            <Route path='/status' component={Status} />
            <Route path='/devtools' component={Devtools} />
            <QuantumRoutes />
            <Route component={NoMatch} />
          </Switch>
        </App>
      </BrowserRouter>
    );
  }
}
