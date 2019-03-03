import Raven from 'raven-js';
import React, { Component } from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import './index.css';
import Routes from './routes';
import registerTooltip from './utils/registerTooltip';

require('typeface-roboto');

if (process.env.NODE_ENV === 'production') {
  Raven.config(
    'https://77916a47017347528d25824beb0a077e@sentry.io/1225660'
  ).install();
}

// handle sticky tooltip for all charts
registerTooltip();

class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidCatch(error, info) {
    this.setState({ error });

    if (process.env.NODE_ENV === 'production') {
      Raven.captureException(error);
    } else {
      // eslint-disable-next-line no-console
      console.error(error, info);
    }

    return true;
  }

  render() {
    if (this.state.error) {
      return (
        <p style={{ textAlign: 'center', fontSize: '1.5em' }}>
          <span>
            There has been a critical error. We have reported it. If the issue
            is not fixed within few hours please file an issue:
            <br />
            <a
              href="https://github.com/mozilla/firefox-health-dashboard/issues/new"
              target="_blank"
              rel="noopener noreferrer">
              {'https://github.com/mozilla/firefox-health-dashboard/issues/new'}
            </a>
          </span>
        </p>
      );
    }

    return this.props.children;
  }
}

const root = document.getElementById('root');
const load = () =>
  render(
    <AppContainer>
      <GlobalErrorBoundary>
        <Routes />
      </GlobalErrorBoundary>
    </AppContainer>,
    root
  );

// This is needed for Hot Module Replacement
if (module.hot) {
  module.hot.accept('./routes', load);
}

load();
