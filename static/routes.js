/* eslint react/no-multi-comp: 0 */
import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import Home from './home';
import ReleaseCrashes from './crashes/release';
import BetaCrashes from './crashes/beta';
import XpCrashes from './crashes/xp';
import Regressions from './regressions';
import Status from './status/index';
import Quantum from './quantum/index';
import QuantumCountdown from './quantum/countdown';
import QuantumResponsivenessParent from './quantum/responsiveness-parent';
import QuantumResponsivenessContent from './quantum/responsiveness-content';
import QuantumPageLoadRender from './quantum/pageload-render';
import QuantumBenchmarkHasal from './quantum/benchmark-hasal';
import QuantumBenchmarkSm from './quantum/benchmark-sm';
import QuantumBenchmarkPageload from './quantum/benchmark-pageload';

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
        10,
      ),
      gridY: parseInt(
        window.getComputedStyle(document.body, null)
          .getPropertyValue('line-height'),
        10,
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
          <Route path='crashes/xp' component={XpCrashes} />
          <Route path='regressions' component={Regressions} />
          <Route path='quantum' component={Quantum} />
          <Route path='quantum/countdown' component={QuantumCountdown} />
          <Route path='quantum/responsiveness/parent' component={QuantumResponsivenessParent} />
          <Route path='quantum/responsiveness/content' component={QuantumResponsivenessContent} />
          <Route path='quantum/pageload/render' component={QuantumPageLoadRender} />
          <Route path='quantum/benchmark/hasal' component={QuantumBenchmarkHasal} />
          <Route path='quantum/benchmark/pageload' component={QuantumBenchmarkPageload} />
          <Route path='quantum/benchmark/sm' component={QuantumBenchmarkSm} />
          <Route path='status' component={Status} />
        </Route>
        <Route path='*' component={NoMatch} />
      </Router>
    );
  }
}
