import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import AndroidPage from './android';
import Home from './Home';
import NoMatch from './NotFound';
import Playback from './playback/playback';
import PlaybackDetails from './playback/details';
import Power from './power/power';
import PowerDetails from './power/details';
import Subtests from './windows/subtests';
import TP6 from './windows/TP6';
import TP6M from './android/TP6m';
import Windows from './windows/Windows';
import TP6Fission from './fission/TP6Fission';
import Fission from './fission/index';

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/windows/tp6" component={TP6} />
      <Route path="/windows/tp6m" component={TP6M} />
      <Route path="/android/tp6m" component={TP6M} />
      <Route path="/android" component={AndroidPage} />
      <Route path="/power/details" component={PowerDetails} />
      <Route path="/power" component={Power} />
      <Route path="/playback/details" component={PlaybackDetails} />
      <Route path="/playback" component={Playback} />
      <Route path="/windows/subtests" component={Subtests} />
      <Route path="/windows/:bits" component={Windows} />
      <Route path="/fission/tp6" component={TP6Fission} />
      <Route path="/fission" component={Fission} />
      <Route path="/" component={Home} />
      <Route component={NoMatch} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
