import Raven from 'raven-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CriticalErrorMessage from './criticalErrorMessage';

export default class ErrorBoundary extends Component {
  state = {
    caughtBoundaryError: false,
  };

  componentDidCatch(error, info) {
    this.setState({ caughtBoundaryError: true });
    Raven.captureException(error);
    Raven.captureMessage(info);
  }

  render() {
    if (this.state.caughtBoundaryError) {
      if (this.props.critical) {
        return <CriticalErrorMessage />;
      }

      return (
        <div>
          <p style={{ color: 'black' }}>Oops; something went wrong</p>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  critical: PropTypes.bool,
};

ErrorBoundary.defaultProps = {
  critical: false,
};
