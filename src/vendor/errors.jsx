/* eslint-disable react/no-multi-comp */
/* eslint-disable max-len */
import React from 'react';
import {ErrorPanel} from "import ErrorPanel from '../components/ErrorPanel';"
import { coalesce, exists, isChrome, isNode, isString, missing } from './utils';
import { expand } from './Template';
import { frum } from './queryOps';

let stackPatterns = [];

if (isNode) {
  //   Error
  //       at Function.Object.<anonymous>.Log.error (C:\Users\kyle\code\firefox-health-dashboard\src\vendor\errors.jsx:174:9)
  //       at Object.error (C:\Users\kyle\code\firefox-health-dashboard\test\vendor\errors.test.js:9:16)
  //       at Object.asyncJestTest (C:\Users\kyle\code\firefox-health-dashboard\node_modules\jest-jasmine2\build\jasmine_async.js:108:37)
  //       at resolve (C:\Users\kyle\code\firefox-health-dashboard\node_modules\jest-jasmine2\build\queue_runner.js:56:12)
  //       at new Promise (<anonymous>)
  //       at mapper (C:\Users\kyle\code\firefox-health-dashboard\node_modules\jest-jasmine2\build\queue_runner.js:43:19)
  //       at promise.then (C:\Users\kyle\code\firefox-health-dashboard\node_modules\jest-jasmine2\build\queue_runner.js:87:41)
  //       at process.internalTickCallback (internal/process/next_tick.js:77:7)

  stackPatterns = [
    /\s*at (.*) \((.*):(\d+):(\d+)\)/,
    /\s*at (.*) \((.*)\)/,
    /\s*at( )(.*):(\d+):(\d+)/,
  ];
} else if (isChrome) {
  // TypeError: Converting circular structure to JSON
  //    at http://localhost:63342/charts/platform/modevlib/util/aUtil.js:83:26
  //    at Object.stringify (native)
  //    at Object.Map.jsonCopy (http://localhost:63342/charts/platform/modevlib/util/aUtil.js:83:26)
  //    at http://localhost:63342/charts/platform/modevlib/Dimension.js:58:22
  //    at Array.map (http://localhost:63342/charts/platform/modevlib/collections/aArray.js:85:10)
  //    at Object.Dimension.getDomain (http://localhost:63342/charts/platform/modevlib/Dimension.js:53:33)
  //    at __createChart (http://localhost:63342/charts/platform/release-history.html:167:75)
  //    at next (native)
  //    at Thread_prototype_resume [as resume] (http://localhost:63342/charts/platform/modevlib/threads/thread.js:248:24)
  //    at Object.Thread.resume.retval [as success] (http://localhost:63342/charts/platform/modevlib/threads/thread.js:226:11)
  //    at XMLHttpRequest.request.onreadystatechange (http://localhost:63342/charts/platform/modevlib/rest/Rest.js:93:15)"
  stackPatterns = [
    /\s*at (.*) \((.*):(\d+):(\d+)\)/,
    /\s*at (.*) \((.*)\)/,
    /\s*at( )(.*):(\d+):(\d+)/,
  ];
} else {
  // IN FIREFOX
  // window.Exception@file:///C:/Users/klahnakoski/git/MoDevMetrics/html/modevlib/debug/aException.js:14:4
  // build@file:///C:/Users/klahnakoski/git/MoDevMetrics/html/modevlib/threads/thread.js:76:2
  // @file:///C:/Users/klahnakoski/git/MoDevMetrics/html/modevlib/threads/thread.js:442:1
  // window.Exception@file:///C:/Users/klahnakoski/git/MoDevMetrics/html/modevlib/debug/aException.js:14:4
  // @file:///C:/Users/klahnakoski/git/MoDevMetrics/html/modevlib/debug/aException.js:77:2
  // @file:///C:/Users/klahnakoski/git/MoDevMetrics/html/modevlib/debug/aException.js:9:2
  stackPatterns = [/(.*)@(.*):(\d+):(\d+)/];
} // endif

function parseStack(stackString) {
  if (missing(stackString)) return [];

  return stackString.split('\n').map(line =>
    frum(stackPatterns)
      .map(stackPattern => {
        const parts = stackPattern.exec(line);

        if (missing(parts)) return { function: line };

        return {
          function: parts[1],
          fileName: parts[2],
          line: parts[3],
          column: parts[4],
        };
      })
      .exists()
      .first()
  );
}

class Exception extends Error {
  constructor(template, params, cause, stackOffset = 0) {
    super();

    let t = null;
    let c = null;
    let p = null;

    if (missing(template)) {
      return;
    }

    if (!isString(template)) {
      throw Exception('expecting string, not {{type}}', {
        type: typeof template,
      });
    } else if (
      missing(cause) &&
      (params instanceof Exception || params instanceof Error)
    ) {
      t = template;
      c = Exception.wrap(params);
    } else {
      t = template;
      p = coalesce(params);
      c = Exception.wrap(cause);
    }

    this.template = t; // string descripbing the problem
    this.props = p; // object with properties used by template
    this.cause = c; // chained reason
    this.stackOffset = stackOffset;
  }

  get trace() {
    return parseStack(this.stack).slice(this.stackOffset);
  }

  toString() {
    const output = [];

    if (exists(this.template)) {
      output.push(expand(this.template, this.props));
    }

    if (this.trace) {
      output.push(`stacktrace`);
      output.push(
        ...this.trace.map(s => {
          const output = ['    '];

          if (exists(s.function)) output.push('at {{function}}');

          if (exists(s.fileName)) {
            output.push(' ({{fileName}}');

            if (exists(s.line)) output.push(' line {{line}} column {{column}}');
            output.push(')');
          }

          return expand(output.join(''), s);
        })
      );
    }

    if (this.cause) {
      output.push('caused by');
      output.push(this.cause.toString());
    }

    return output.join('\n');
  }

  get message() {
    // RETURN THE SHORT MESSAGE
    const { template, props, cause } = this;

    if (cause) return cause.message;

    if (template) return expand(template, props);

    return 'unknown error';
  }

  toData() {
    return {
      template: this.template,
      props: this.props,
      cause: exists(this.cause) ? this.cause.toData() : null,
      trace: this.trace,
    };
  }
}

Exception.wrap = err => {
  if (missing(err)) return null;

  if (err instanceof Exception) return err;

  const output = new Exception();

  output.template = err.message;
  output.props = null;
  output.cause = null;
  output.stack = err.stack;

  return output;
};

class Log {}

Log.error = (template, params, cause) => {
  throw new Exception(template, params, cause, 1);
};

Log.warning = (template, params, cause) => {
  let e = null;

  if (template instanceof Error) {
    e = Exception.wrap(template);
  } else {
    e = new Exception(template, params, cause, 1);
  }

  // eslint-disable-next-line no-console
  console.log(e.toString());
};

class ErrorMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidCatch(err, info) {
    const error = Exception.wrap(err, info);

    this.setState({ error });

    Log.warning(error);
  }

  render() {
    const { error } = this.state;

    if (error)
      return (
        <ErrorPanel error={coalesce(error.message, 'something went wrong')} />
      );

    const parent = this;
    const handleError = error => parent.componentDidCatch(error);

    try {
      return React.Children.map(this.props.children, child =>
        React.cloneElement(child, { handleError })
      );
    } catch (error) {
      this.setState({ error });
    }
  }
}

const withErrorBoundary = WrappedComponent => {
  class ErrorBoundary extends ErrorMessage {
    render() {
      const self = this;

      return (
        <ErrorMessage>
          <WrappedComponent
            handleError={self.componentDidCatch}
            {...this.props}
          />
        </ErrorMessage>
      );
    }
  }

  return ErrorBoundary;
};

export { Exception, withErrorBoundary, ErrorMessage, Log };
