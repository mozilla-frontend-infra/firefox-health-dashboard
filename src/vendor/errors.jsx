import Raven from 'raven-js';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { missing } from './utils';
import { Log, Exception } from './logs';
import SETTINGS from './settings';

if (process.env.NODE_ENV === 'production') {
  Raven.config(
    'https://c7561fc1f4df441c9aa8cd203a3aeeed@sentry.prod.mozaws.net/433',
  ).install();
}

const reportOrLog = (error, info) => {
  if (process.env.NODE_ENV === 'production') {
    Raven.captureException(error);
  }

  if (info) {
    if (process.env.NODE_ENV === 'production') {
      Raven.captureMessage(info);
    }
  }
};

const RED = SETTINGS.colors.error;
const styles = {
  container: {
    position: 'relative',
    height: '100%',
    width: '100%',
  },
  frame: {
    boxSizing: 'border-box',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderStyle: 'solid',
    borderWidth: '0.2rem',
    borderColor: RED,
    pointerEvents: 'none',
  },
  message: {
    boxSizing: 'border-box',
    backgroundColor: RED,
    color: 'white',
    width: '100%',
    position: 'absolute',
    margin: 0,
    padding: 0,
    bottom: 0,
    height: '1.0rem',
    textAlign: 'center',
    opacity: 0.77,
  },
};

class RawErrorMessage extends React.Component {
  render() {
    const {
      error,
      classes: { container, frame, message },
      children,
    } = this.props;

    return (
      <div className={container}>
        {children}
        <div className={frame} />
        <div className={message}>{error.message}</div>
      </div>
    );
  }
}

const ErrorMessage = withStyles(styles)(RawErrorMessage);
const withErrorBoundary = WrappedComponent => {
  if (
    WrappedComponent.displayName
    && WrappedComponent.displayName.startsWith('WithStyles')
  ) {
    Log.error(
      'Can not wrap WithStyles because componentDidMount() returns undefined',
    );
  }

  class ErrorBoundary extends WrappedComponent {
    constructor(...props) {
      super(...props);

      if (missing(this.state)) {
        this.state = {};
      }
    }

    componentDidCatch(err, info) {
      const error = Exception.wrap(err, info);

      this.setState({ error });
      Log.warning(error);
      reportOrLog(error, info);
    }

    async componentDidMount() {
      try {
        await super.componentDidMount();
      } catch (error) {
        this.componentDidCatch(error);
      }
    }

    async componentDidUpdate(...args) {
      if (!super.componentDidUpdate) {
        return;
      }

      try {
        await super.componentDidUpdate(...args);
      } catch (error) {
        this.componentDidCatch(error);
      }
    }

    render() {
      const { error } = this.state;

      try {
        if (error) {
          return <ErrorMessage error={error}>{super.render()}</ErrorMessage>;
        }

        return super.render();
      } catch (error) {
        return <ErrorMessage error={error} />;
      }
    }
  }

  return ErrorBoundary;
};

export { withErrorBoundary, ErrorMessage, reportOrLog };
