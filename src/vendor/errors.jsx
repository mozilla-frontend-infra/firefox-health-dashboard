/* eslint-disable react/no-multi-comp */
/* eslint-disable max-len */
import Raven from 'raven-js';
import React from 'react';
import ErrorPanel from '@mozilla-frontend-infra/components/ErrorPanel';
import { Log, Exception } from './logs';
import { coalesce, missing } from './utils';

const withErrorBoundary = WrappedComponent => {
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

      Raven.captureException(error);
      Raven.captureMessage(info);

      Log.warning(error);
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

      if (error)
        return (
          <ErrorPanel error={coalesce(error.message, 'something went wrong')} />
        );

      try {
        return super.render();
      } catch (error) {
        this.componentDidCatch(error);

        return (
          <ErrorPanel error={coalesce(error.message, 'something went wrong')} />
        );
      }
    }
  }

  return ErrorBoundary;
};

export default withErrorBoundary;
