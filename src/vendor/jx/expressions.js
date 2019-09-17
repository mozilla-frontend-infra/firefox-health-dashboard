/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
import {
  exists,
  first,
  isString,
  missing,
  toArray,
  isArray,
  isFunction,
  splitField,
  isInteger,
  coalesce,
} from '../utils';
import { Data, isData } from '../datas';
import { GMTDate as Date } from '../dates';
import { Log } from '../logs';

const expressions = {};
const defineFunction = (expr) => {
  if (isFunction(expr)) {
    return expr;
  }

  if (isString(expr)) {
    const pathArray = splitField(expr);

    if (pathArray.length === 0) {
      return row => coalesce(row);
    }

    if (pathArray.length === 1) {
      const step = pathArray[0];

      return (row) => {
        if (isArray(row)) {
          if (step === 'length') {
            return row.length;
          }

          if (isInteger(step)) {
            return row[step];
          }

          if (isArray(row)) {
            return row.map(o => (isData(o) ? o[step] : null));
          }
        } else if (isData(row)) {
          return coalesce(row[step]);
        } else {
          return null;
        }
      };
    }

    return (row) => {
      let output = row;

      for (const step of pathArray) {
        if (isArray(output)) {
          if (step === 'length') {
            output = output.length;
          } else if (isInteger(step)) {
            output = output[step];
          } else if (isArray(output)) {
            output = output.map(o => (isData(o) ? o[step] : null));
          }
        } else if (isData(output)) {
          output = output[step];
        } else {
          return null;
        }

        if (missing(output)) return null;
      }

      return output;
    };
  }

  if (isData(expr)) {
    const output = first(
      Object.entries(expr).map(([op, term]) => {
        const func = expressions[op];

        if (func === undefined) {
          Log.error('expecting a known operator, not {{op}}', { op });
        }

        return func(term);
      }),
    );

    if (exists(output)) {
      return output;
    }
  }

  if (exists(expr)) {
    return () => expr; // some constant
  }

  Log.error('does not look like an expression: {{expr|json}}', { expr });
};

/*
example {and: [a, b, c, ...]}

return true if all `terms` return true
 */
expressions.and = (terms) => {
  const filters = toArray(terms).map(defineFunction);

  if (filters.length === 0) {
    return () => true;
  }

  if (filters.length === 1) {
    return row => filters[0](row);
  }

  return row => filters.every(f => f(row));
};

/*
example {or: [a, b, c, ...]}

return true if any `terms` return true
 */
expressions.or = (terms) => {
  const filters = toArray(terms).map(defineFunction);

  if (filters.length === 0) {
    return () => false;
  }

  if (filters.length === 1) {
    return row => filters[0](row);
  }

  return row => filters.some(f => f(row));
};

/*
example {not: expr}

return opposite of expr
 */
expressions.not = (expr) => {
  const filter = defineFunction(expr);

  return row => !filter(row);
};

/*
example {eq: {variable: value}}
        {eq: {variable: [v1, v2, ... v3]}}

if variable equals literal value then
    return true
if value is an array, then
    return true if any of the values match
 */
expressions.eq = (term) => {
  if (isData(term)) {
    const filters = Object.entries(term).map(([k, v]) => {
      if (missing(v)) {
        return () => true;
      }

      const allowed = toArray(v);
      const s = defineFunction(k);

      return (row) => {
        const value = s(row);

        return allowed.includes(value);
      };
    });

    return row => filters.every(f => f(row));
  }

  if (isArray(term)) {
    const [a, b] = term.map(defineFunction);

    return row => a(row) === b(row);
  }

  Log.error('eq Expecting object, or array');
};

expressions.in = expressions.eq;

/*
example {prefix: {name: prefix}}

Return true if `name` starts with literal `prefix`
 */
expressions.prefix = term => row => Object.entries(term).every(([name, prefix]) => {
  const value = Data.get(row, name);

  if (missing(value)) {
    return false;
  }

  return value.startsWith(prefix);
});

/*
return true if `expression` is missing
 */
expressions.missing = (expression) => {
  const func = defineFunction(expression);

  return row => missing(func(row));
};

/*
return index of substring
return null if not found
 */

expressions.find = term => row => Object.entries(term).every(([name, substring]) => {
  const value = Data.get(row, name);
  if (missing(value)) return false;
  const index = value.indexOf(substring);
  if (index === -1) return null;
  return index;
});

/*
return true if `expression` exists
 */
expressions.exists = (expression) => {
  const func = defineFunction(expression);

  return row => exists(func(row));
};

/*
example {gte: {name: reference}

return true if `name` >= `reference`
 */
expressions.gte = (obj) => {
  const lookup = Object.entries(obj).map(([name, reference]) => [
    defineFunction(name),
    defineFunction(reference),
  ]);

  return row => lookup.every(([a, b]) => {
    const av = a(row);
    const bv = b(row);

    if (missing(av) || missing(bv)) {
      return false;
    }

    return av >= bv;
  });
};

/*
example {lt: {name: reference}

return true if `name` < `reference`
 */
expressions.lt = (obj) => {
  const lookup = Object.entries(obj).map(([name, reference]) => [
    defineFunction(name),
    defineFunction(reference),
  ]);

  return row => lookup.every(([a, b]) => {
    const av = a(row);
    const bv = b(row);

    if (missing(av) || missing(bv)) {
      return false;
    }

    return av < bv;
  });
};

/*
convert a date-like value into unix timestamp
 */
expressions.date = (value) => {
  const date = Date.tryParse(value);

  if (exists(date)) {
    const val = date.unix();

    return () => val;
  }

  const v = defineFunction(value);

  return row => Date.newInstance(v(row)).unix();
};

export default defineFunction;
