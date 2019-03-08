/* eslint-disable react/no-multi-comp */
/* eslint-disable max-len */
import Raven from 'raven-js';
import React from 'react';
import ErrorPanel from '@mozilla-frontend-infra/components/ErrorPanel';
import { coalesce, missing } from './utils';

const withErrorBoundary = WrappedComponent => {
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
