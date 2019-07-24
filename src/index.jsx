import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import './index.css';
import Routes from './routes';
import registerTooltip from './utils/registerTooltip';
import { reportOrLog } from './vendor/errors';

require('typeface-roboto');

// handle sticky tooltip for all charts
registerTooltip();

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
const load = () => render(
  <AppContainer>
    <GlobalErrorBoundary>
      <Routes />
    </GlobalErrorBoundary>
  </AppContainer>,
  root,
);

// This is needed for Hot Module Replacement
if (module.hot) {
  module.hot.accept('./routes', load);
}

load();
