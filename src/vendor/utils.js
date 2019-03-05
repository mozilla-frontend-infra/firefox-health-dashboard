/* eslint-disable no-restricted-syntax */

function missing(value) {
  // return true if value is null, or undefined, or not a legit value
  return value == null || Number.isNaN(value) || value === '';
}

function exists(value) {
  // return false if value is null, or undefined, or not a legit value
  return !missing(value);
}

function coalesce(...args) {
  for (const a of args) {
    if (exists(a)) return a;
  }

  return null;
}

function first(list) {
  for (const v of list) return v;

  return null;
}

function last(list) {
  let value = null;

  for (const v of list) value = v;

  return value;
}

function toArray(value) {
  // return a list
  if (Array.isArray(value)) {
    return value;
  }

  if (value == null) {
    return [];
  }

  return [value];
}

function isNumeric(n) {
  if (n == null) return false;

  return !Number.isNaN(parseFloat(n)) && Number.isFinite(n);
}

const { isArray } = Array;

function isString(value) {
  return typeof value === 'string';
}

function isInteger(n) {
  if (isString(n)) {
    return /[+-]?[0123456789]+\.?0*$/y.test(n);
  }

  return Number.isInteger(n);
}

function isObject(val) {
  if (missing(val)) {
    return false;
  }

  return typeof val === 'function' || typeof val === 'object';
}

function isData(val) {
  if (missing(val)) {
    return false;
  }

  return typeof val === 'object';
}

function isFunction(f) {
  return typeof f === 'function';
}

function literalField(fieldname) {
  return fieldname.replace(/\./g, '\\.');
}

function splitField(fieldname) {
  return fieldname
    .replace(/\\\./g, '\b')
    .split('.')
    .map(v => v.replace(/[\b]/g, '.'));
}

function joinField(path) {
  return path.map(literalField).join('.');
}

function concatField(...many) {
  let output = '.';

  many.forEach(m => {
    if (output === '.') {
      output = m;
    } else if (m !== '.') {
      output = `${output}.${m}`;
    }
  });

  return output;
}

export {
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
  isData,
  isObject,
  splitField,
  joinField,
  literalField,
  concatField,
};
