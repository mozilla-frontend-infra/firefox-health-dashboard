/* global document */
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import './index.css';
import { reportOrLog } from './vendor/errors';
import Decommission from './decommission';

require('typeface-roboto');

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidCatch(error, info) {
    this.setState({ error });
    reportOrLog(error, info);
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
              rel="noopener noreferrer"
            >
              https://github.com/mozilla/firefox-health-dashboard/issues/new
            </a>
          </span>
        </p>
      );
    }

    return this.props.children;
  }
}
const root = document.getElementById('root');
const load = () => render(
  <AppContainer>
    <GlobalErrorBoundary>
      <Decommission />
    </GlobalErrorBoundary>
  </AppContainer>,
  root,
);

// This is needed for Hot Module Replacement
if (module.hot) {
  module.hot.accept('./routes', load);
}

load();
