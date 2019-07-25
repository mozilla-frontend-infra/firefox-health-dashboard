/* eslint-disable max-len */

import {
  coalesce, exists, isString, missing,
} from './utils';
import { Data } from './datas';
import { Template } from './Template';

//   Error
//       at Function.Object.<anonymous>.Log.error (C:\Users\kyle\code\firefox-health-dashboard\src\vendor\errors.jsx:174:9)
//       at Object.error (C:\Users\kyle\code\firefox-health-dashboard\test\vendor\errors.test.js:9:16)
//       at Object.asyncJestTest (C:\Users\kyle\code\firefox-health-dashboard\node_modules\jest-jasmine2\build\jasmine_async.js:108:37)
//       at resolve (C:\Users\kyle\code\firefox-health-dashboard\node_modules\jest-jasmine2\build\queue_runner.js:56:12)
//       at new Promise (<anonymous>)
//       at mapper (C:\Users\kyle\code\firefox-health-dashboard\node_modules\jest-jasmine2\build\queue_runner.js:43:19)
//       at promise.then (C:\Users\kyle\code\firefox-health-dashboard\node_modules\jest-jasmine2\build\queue_runner.js:87:41)
//       at process.internalTickCallback (internal/process/next_tick.js:77:7)
const stackPatterns = [
  /\s*at (.*) \((.*):(\d+):(\d+)\)/,
  /\s*at (.*) \((.*)\)/,
  /\s*at( )(.*):(\d+):(\d+)/,
];

function parseStack(stackString) {
  if (missing(stackString)) {
    return [];
  }

  return stackString
    .split('\n')
    .map(line => stackPatterns
      .map((stackPattern) => {
        const parts = stackPattern.exec(line);

        if (missing(parts)) return null;

        return {
          function: parts[1],
          fileName: parts[2],
          line: parts[3],
          column: parts[4],
        };
      })
      .find(exists))
    .filter(exists);
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
      missing(cause)
      && (params instanceof Exception || params instanceof Error)
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
      output.push(Template.expand(this.template, this.props));
    }

    if (this.trace) {
      output.push('stacktrace');
      output.push(
        ...this.trace.map((s) => {
          const output = ['    '];

          if (exists(s.function)) {
            output.push('at {{function}}');
          }

          if (exists(s.fileName)) {
            output.push(' ({{fileName}}');

            if (exists(s.line)) {
              output.push(' line {{line}} column {{column}}');
            }

            output.push(')');
          }

          return Template.expand(output.join(''), s);
        }),
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

    if (cause) {
      return cause.message;
    }

    if (template) {
      return Template.expand(template, props);
    }

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

Exception.wrap = (err) => {
  if (missing(err)) {
    return null;
  }

  if (err instanceof Exception) {
    return err;
  }

  const output = new Exception();

  output.template = err.message;
  output.props = null;
  output.cause = null;
  output.stack = err.stack;

  return output;
};

class Log {}

Log.note = (template, params) => {
  // eslint-disable-next-line no-console
  console.log(Template.expand(template, params));
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

Log.error = (template, params, cause) => {
  throw new Exception(template, params, cause, 1);
};

Data.log = Log;
Template.log = Log;

export { Exception, Log };
