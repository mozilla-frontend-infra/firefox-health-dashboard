/* eslint-disable react/no-multi-comp */
/* eslint-disable max-len */
import Raven from 'raven-js';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { missing } from './utils';

const RED = 'red';
const borderWidth = '1rem';
const styles = {
  frame: {
    position: 'absolute',
    top: borderWidth,
    bottom: borderWidth,
    left: borderWidth,
    right: borderWidth,
    borderWidth,
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
      classes: { frame, message },
      children,
    } = this.props;

    return (
      <div style={{ position: 'relative' }}>
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

export default withErrorBoundary;
