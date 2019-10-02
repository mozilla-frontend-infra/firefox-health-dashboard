import React, { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

const Home = lazy(() => import(/* webpackChunkName: "home" */ './Home'));
const AndroidPage = lazy(() => import(/* webpackChunkName: "andriod" */'./android'));
const NimbledroidGraphPage = lazy(() => import(/* webpackChunkName: "nimbledroid" */'./nimbledroid/NimbledroidGraphPage'));
const Quantum = lazy(() => import(/* webpackChunkName: "quantum" */'./quantum/Quantum'));
const TP6 = lazy(() => import(/* webpackChunkName: "quantum-tp6" */'./quantum/TP6'));
const TP6M = lazy(() => import(/* webpackChunkName: "andriod-tp6m" */'./android/TP6m'));
const Power = lazy(() => import(/* webpackChunkName: "power" */'./power'));
const Playback = lazy(() => import(/* webpackChunkName: "playback-playback" */'./playback/playback'));
const PlaybackDetails = lazy(() => import(/* webpackChunkName: "playback-details" */ './playback/details'));
const Subtests = lazy(() => import(/* webpackChunkName: "quantum-subtests" */'./quantum/subtests'));
const NoMatch = lazy(() => import(/* webpackChunkName: "not-found" */'./NotFound'));

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
