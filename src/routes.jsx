import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import AndroidPage from './android';
import Home from './Home';
import NimbledroidGraphPage from './nimbledroid/NimbledroidGraphPage';
import NoMatch from './NotFound';
import Playback from './playback/playback';
import PlaybackDetails from './playback/details';
import Power from './power/power';
import PowerDetails from './power/details';
import Subtests from './windows/subtests';
import TP6 from './windows/TP6';
import TP6M from './android/TP6m';
import Windows from './windows/Windows';

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/windows/tp6" component={TP6} />
      <Route path="/windows/tp6m" component={TP6M} />
      <Route path="/android/tp6m" component={TP6M} />
      <Route path="/android/graph" component={NimbledroidGraphPage} />
      <Route path="/android" component={AndroidPage} />
      <Route path="/power/details" component={PowerDetails} />
      <Route path="/power" component={Power} />
      <Route path="/playback/details" component={PlaybackDetails} />
      <Route path="/playback" component={Playback} />
      <Route path="/windows/subtests" component={Subtests} />
      <Route path="/windows/:bits" component={Windows} />
      <Route path="/" component={Home} />
      <Route component={NoMatch} />
    </Switch>
  </BrowserRouter>
);

Routes.propTypes = {
  location: PropTypes.object,
};

export default Routes;
