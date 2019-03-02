/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isString, missing } from './utils';
import { Template } from './Template';

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
const Exception = class {
  constructor(props) {
    if (isString(props)) {
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

  toString() {}
};

Exception.wrap = err => {
  if (err instanceof Exception) {
    return err;
  }

  return new Exception({ cause: err });
};

function warning(template, params, cause) {
  let c = null;
  let p = null;

  if (
    missing(cause) &&
    (params instanceof Exception || params instanceof Error)
  ) {
    c = params;
    p = {};
  } else {
    p = params;
    c = cause ? cause.toString() : '';
  }

  // eslint-disable-next-line no-console
  console.log(Template(template).expand(p) + c.toString());
}

class ErrorMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidCatch(error, info) {
    const err = Exception.wrap(error, info);

    this.setState({ error: err });

    // eslint-disable-next-line no-console
    console.info(`found error ${error.toString()}`);

    return true;
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

export { Exception, withErrorBoundary, ErrorMessage, warning };
