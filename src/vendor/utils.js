/* eslint-disable no-restricted-syntax */

/*
Container classes
 */
const { isArray } = Array;
const zero = () => 0;
const MANY_TYPES = [];

/*
return true if the container is empty
 */
function isEmpty(value) {
  return (
    (isArray(value) && value.length === 0)
    || (MANY_TYPES.some(t => value instanceof t) && value.isEmpty())
  );
}

/*
return new array of given length
 */
function array(length = 0) {
  return new Array(length).fill(null);
}

/*
return true if value is null, or undefined, or not a legit value
 */
function missing(value) {
  return (
    value == null
    || value === ''
    || Number.isNaN(value)
    || value === Number.POSITIVE_INFINITY
    || value === Number.NEGATIVE_INFINITY
    || isEmpty(value)
  );
}

function isMany(value) {
  return isArray(value) || MANY_TYPES.some(t => value instanceof t);
}

/*
return false if value is null, or undefined, or not a legit value
 */
function exists(value) {
  return !missing(value);
}

/*
pick first non-missing value
 */
function coalesce(...args) {
  for (const a of args) {
    if (exists(a)) {
      return a;
    }
  }

  return null;
}

/*
return first element from list, or null
 */
function first(list) {
  for (const v of list) return v;

  return null;
}

/*
return last element from list, or null
 */
function last(list) {
  if (isArray(list)) {
    return list[list.length - 1];
  }

  let value = null;

  for (const v of list) value = v;

  return value;
}

/*
return new array in reverse order
 */
function reverse(list) {
  return list.slice().reverse();
}

/*
return all but last element
 */
function notLast(list) {
  if (isArray(list)) {
    return list.slice(0, list.length - 1);
  }

  const arr = Array.from(list);

  return arr.slice(arr.length - 1);
}

/*
return true if `value` is a string
 */
function isString(value) {
  return typeof value === 'string';
}

/*
return an Array
 */
function toArray(value) {
  if (value == null) {
    return [];
  }

  if (isString(value)) {
    return [value];
  }

  if (isArray(value)) {
    return value;
  }

  if (value[Symbol.iterator]) {
    return Array.from(value);
  }

  return [value];
}

function isNumeric(n) {
  if (isString(n)) {
    /* eslint-disable-next-line max-len */
    return /^[+-]?[0123456789]+\.?[0123456789]*([eE][+-]?[0123456789]+)?$/y.test(
      n,
    );
  }

  return Number.isFinite(n);
}

function isInteger(n) {
  if (isString(n)) {
    return /^[+-]?[0123456789]+\.?0*([eE]\+?[0123456789]+)?$/y.test(n);
  }

  return Number.isInteger(n);
}

function isFunction(f) {
  return typeof f === 'function';
}

/*
expecting Array of Arrays, return transpose
 */
function zip(...args) {
  const length = Math.max(...args.map(a => a.length));

  return array(length).map((_, i) => args.map(a => a[i]));
}

/*
interpret a string with possible dots as a literal key, not a path
 */
function literalField(fieldname) {
  return fieldname.replace(/\./g, '\\.');
}

/*
accept dot-delimited path name
return array of keys representing the same
 */
function splitField(fieldname) {
  if (isArray(fieldname)) return fieldname;

  return fieldname
    .replace(/\\\./g, '\b')
    .split('.')
    .map(v => v.replace(/[\b]/g, '.'));
}

/*
accept an array of keys representing a path
return dot-delimited path name
 */
function joinField(path) {
  return path.map(literalField).join('.');
}

/*
join two dot-delimited path names
 */
function concatField(...many) {
  let output = '.';

  many.forEach((m) => {
    if (output === '.') {
      output = m;
    } else if (m !== '.') {
      output = `${output}.${m}`;
    }
  });

  return output;
}

/*
Represent JSON object: map from string keys to values
 */
class Data {}

const OBJECT_CONSTRUCTOR = {}.constructor;

/*
 * Check if the `val` is Data
 * Direct instances of Object are also considered data
 */
function isData(val) {
  if (missing(val)) {
    return false;
  }

  if (val[Symbol.iterator]) {
    return false;
  }

  return val.constructor === OBJECT_CONSTRUCTOR || val instanceof Data;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const delayedValue = () => {
  // return a Promise to a value
  // this.resolve(value) to assign the value when available
  let selfResolve = null;
  let selfReject = null;
  const self = new Promise((resolve, reject) => {
    selfResolve = resolve;
    selfReject = reject;
  });

  self.resolve = selfResolve;
  self.reject = selfReject;

  return self;
};

export {
  delayedValue,
  first,
  last,
  toArray,
  isArray,
  isNumeric,
  isInteger,
  isFunction,
  missing,
  exists,
  coalesce,
  isString,
  splitField,
  joinField,
  literalField,
  concatField,
  zip,
  array,
  zero,
  notLast,
  MANY_TYPES,
  isMany,
  reverse,
  Data,
  isData,
  sleep,
};
