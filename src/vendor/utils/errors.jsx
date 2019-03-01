/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

const newIssue =
  'https://github.com/mozilla/firefox-health-dashboard/issues/new';
const BasicError = ({ error }) => (
  <p style={{ textAlign: 'center', fontSize: '1.5em' }}>
    {(() => {
      if (error.template) return error.template;

      if (error.cause && error.cause.message) return error.cause.message;

      return (
        <span>
          There has been a critical error. We have reported it. If the issue is
          not fixed within few hours please file an issue:
          <br />
          <a href={newIssue} target="_blank" rel="noopener noreferrer">
            {newIssue}
          </a>
        </span>
      );
    })()}
  </p>
);
const Except = class {
  constructor(props) {
    if (typeof props === 'string') {
      this.template = props;
      this.props = {};
      this.cause = null;
    } else {
      const { template, kwargs, cause } = props;

      this.template = template; // string descripbing the problem
      this.props = kwargs; // object with properties used by template
      this.cause = cause; // chained reason
    }
  }
};

Except.wrap = err => {
  if (err instanceof Except) {
    return err;
  }

  return new Except({ cause: err });
};

class ErrorMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidCatch(error, info) {
    const err = Except.wrap(error, info);

    this.setState({ error: err });

    // eslint-disable-next-line no-console
    console.info(`found error ${error}`);
  }

  render() {
    const { error } = this.state;

    if (error) return this.props.template({ error });

    return this.props.children;
  }
}

ErrorMessage.propTypes = {
  template: PropTypes.func.isRequired,
};

ErrorMessage.defaultProps = {
  template: BasicError,
};

const withErrorBoundary = WrappedComponent => {
  class ErrorBoundary extends React.Component {
    render() {
      return (
        <ErrorMessage>
          <WrappedComponent {...this.props} />
        </ErrorMessage>
      );
    }
  }

  return ErrorBoundary;
};

export { Except, withErrorBoundary, ErrorMessage };
