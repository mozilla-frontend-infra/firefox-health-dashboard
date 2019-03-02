/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { missing } from './utils';
import { expand } from './Template';

const newIssue =
  'https://github.com/mozilla/firefox-health-dashboard/issues/new';
const BasicError = ({ error }) => (
  <p style={{ textAlign: 'center', fontSize: '1.5em' }}>
    {(() => {
      if (error.toString) return error.toString();

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
  constructor(template, params, cause) {
    let t = null;
    let c = null;
    let p = null;

    if (template instanceof Exception || template instanceof Exception) {
      c = template;
    } else if (
      missing(cause) &&
      (params instanceof Exception || params instanceof Error)
    ) {
      t = template;
      c = params;
    } else {
      t = template;
      p = params;
      c = cause ? cause.toString() : '';
    }

    this.template = t; // string descripbing the problem
    this.props = p; // object with properties used by template
    this.cause = c; // chained reason
  }

  toString() {
    if (missing(this.template)) {
      return this.cause.toString();
    }

    let output = expand(this.template, this.props);

    if (this.cause) {
      output = `${output}\ncaused by\n${this.cause.toString()}`;
    }

    return output;
  }
};

Exception.wrap = err => {
  if (err instanceof Exception) {
    return err;
  }

  return new Exception({ cause: err });
};

function error(template, params, cause) {
  throw new Exception(template, params, cause);
}

function warning(template, params, cause) {
  const e = new Exception(template, params, cause);

  // eslint-disable-next-line no-console
  console.log(e.toString());
}

class ErrorMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidCatch(error, info) {
    const err = Exception.wrap(error, info);

    this.setState({ error: err });

    warning(error);
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

export { Exception, withErrorBoundary, ErrorMessage, warning, error };
