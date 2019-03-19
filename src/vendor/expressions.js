/* eslint-disable linebreak-style */
/* eslint-disable no-use-before-define */

import { exists, first, missing, toArray } from './utils';
import Data from './Data';

const jx = expr => {
  const output = first(
    Object.entries(expr).map(([op, term]) => {
      const func = expressions[op];

      if (func === undefined) {
        throw new Error(`expecting a known operator,  not {{oop}}${op}`);
      }

      return func(term);
    })
  );

  if (exists(output)) return output;
  throw new Error(`does not look like an expression: {{expr}}${expr}`);
};

const expressions = {
  and: terms => {
    const filters = terms.map(jx);

    return row => filters.every(f => f(row));
  },

  or: terms => {
    const filters = terms.map(jx);

    return row => filters.some(f => f(row));
  },

  eq: obj => {
    const filters = Object.entries(obj).map(([k, v]) => {
      if (missing(v)) return () => true;

      return row => toArray(v).includes(Data.get(row, k));
    });

    return row => filters.every(f => f(row));
  },

  prefix: term => row =>
    Object.entries(term).every(([name, prefix]) => {
      const value = Data.get(row, name);

      if (missing(value)) return false;

      return value.startsWith(prefix);
    }),
};

expressions.in = expressions.eq;

export { jx }; // eslint-disable-line import/prefer-default-export
