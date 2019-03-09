/* eslint-disable react/no-multi-comp */
/* eslint-disable max-len */
import Raven from 'raven-js';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { missing } from './utils';

const RED = 'red';
const styles = {
  container: {
    position: 'relative',
    height: '100%',
    width: '100%',
  },
  frame: {
    boxSizing: 'border-box',
    position: 'absolute',
    top: 5,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 5,
    backgroundColor: RED,
    borderWidth: 5,
    borderColor: RED,
  },
  message: {
    backgroundColor: RED,
    color: 'white',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    height: '1rem',
    textAlign: 'center',
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
        <div className={frame}>
          <div className={message}>{error.message}</div>
        </div>
      </div>
    );
  }
}

const ErrorMessage = withStyles(styles)(RawErrorMessage);
const withErrorBoundary = WrappedComponent => {
  if (
    WrappedComponent.displayName &&
    WrappedComponent.displayName.startsWith('WithStyles')
  ) {
    throw new Error(
      'Can not wrap WithStyles because componentDidMount() returns undefined'
    );
  }

  class ErrorBoundary extends WrappedComponent {
    constructor(...props) {
      super(...props);

      if (missing(this.state)) {
        this.state = {};
      }
    }

    componentDidCatch(error, info) {
      this.setState({ error });

      Raven.captureException(error);
      Raven.captureMessage(info);

      // eslint-disable-next-line no-console
      console.warn(error);
    }

    async componentDidMount() {
      try {
        await super.componentDidMount();
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

export { withErrorBoundary, ErrorMessage };
