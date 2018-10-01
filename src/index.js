import Raven from 'raven-js';
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import './index.css';
import GenericErrorBoundary from './components/genericErrorBoundary';
import Routes from './routes';

require('typeface-fira-sans');

if (process.env.NODE_ENV === 'production') {
  Raven.config('https://77916a47017347528d25824beb0a077e@sentry.io/1225660').install();
}

const root = document.getElementById('root');
const load = () => render(
  (
    <AppContainer>
      <GenericErrorBoundary critical>
        <Routes />
      </GenericErrorBoundary>
    </AppContainer>
  ), root,
);

// This is needed for Hot Module Replacement
if (module.hot) {
  module.hot.accept('./routes', load);
}

load();
