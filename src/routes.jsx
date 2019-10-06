import React, { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './Home';
import Power from './power';
import NoMatch from './NotFound';
import Playback from './playback/playback';
import PlaybackDetails from './playback/details';

const AndroidPage = lazy(() => import(/* webpackChunkName: "andriod" */ './android'));
const NimbledroidGraphPage = lazy(() => import(/* webpackChunkName: "nimbledroid" */ './nimbledroid/NimbledroidGraphPage'));
const Quantum = lazy(() => import(/* webpackChunkName: "quantum" */ './quantum/Quantum'));
const TP6 = lazy(() => import(/* webpackChunkName: "quantum-tp6" */ './quantum/TP6'));
const TP6M = lazy(() => import(/* webpackChunkName: "andriod-tp6m" */ './android/TP6m'));
const Subtests = lazy(() => import(/* webpackChunkName: "quantum-subtests" */ './quantum/subtests'));

const Routes = () => (
  <BrowserRouter>
    <Suspense fallback="">
      <Switch>
        <Route path="/quantum/tp6" component={TP6} />
        <Route path="/quantum/tp6m" component={TP6M} />
        <Route path="/android/tp6m" component={TP6M} />
        <Route path="/android/graph" component={NimbledroidGraphPage} />

        <Route path="/android" component={AndroidPage} />
        <Route path="/power" component={Power} />
        <Route path="/playback/details" component={PlaybackDetails} />
        <Route path="/playback" component={Playback} />
        <Route path="/quantum/subtests" component={Subtests} />
        <Route path="/quantum/:bits" component={Quantum} />
        <Route path="/" component={Home} />
        <Route component={NoMatch} />
      </Switch>
    </Suspense>
  </BrowserRouter>
);

Routes.propTypes = {
  location: PropTypes.object,
};

export default Routes;
