/* eslint-disable no-restricted-syntax */

function isNumeric(n) {
  if (n == null) return null;

  return !Number.isNaN(parseFloat(n)) && Number.isFinite(n);
}

const { isArray } = Array;

function isInteger(n) {
  if (n == null) return null;

  return !Number.isNaN(parseInt(n, 10)) && Number.isFinite(n);
}

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

function isString(value) {
  return typeof value === 'string';
}

function isObject(val) {
  if (missing(val)) {
    return false;
  }

  return typeof val === 'function' || typeof val === 'object';
}

function isMap(val) {
  if (missing(val)) {
    return false;
  }

  return typeof val === 'object';
}

function isFunction(f) {
  return typeof f === 'function';
}

function literalField(fieldname) {
  return fieldname.replace(/\./, '\\.');
}

function splitField(fieldname) {
  return fieldname
    .replace(/\\\./, '\b')
    .split('.')
    .map(v => v.replace(/[\b]/, '.'));
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
  isArray,
  isNumeric,
  isInteger,
  isFunction,
  missing,
  exists,
  coalesce,
  isString,
  isMap,
  isObject,
  splitField,
  joinField,
  literalField,
  concatField,
};
