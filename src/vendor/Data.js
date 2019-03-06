/* eslint-disable no-restricted-syntax */

import { toPairs } from './queryOps';
import {
  coalesce,
  exists,
  isArray,
  isObject,
  isInteger,
  isData,
  missing,
  splitField,
} from './utils';
import { Log } from './errors';

const Data = (key, value) => {
  if (key == null) {
    Log.error('expecting a string key');
  }

  const output = {};

  output[key] = value;

  return output;
};

Data.zip = (keys, values) => {
  // LIST OF [k, v] TUPLES EXPECTED
  // OR LIST OF keys AND LIST OF values
  const output = {};

  if (values === undefined) {
    keys.forEach(([k, v]) => {
      // LIST OF [k, v] TUPLES EXPECTED
      output[k] = v;
    });
  } else {
    keys.forEach((k, i) => {
      output[k] = values[i];
    });
  }

  return output;
};

Data.copy = (from, to) => {
  const output = coalesce(to, {});

  toPairs(from).forEach((v, k) => {
    if (exists(v)) output[k] = v;
  });

  return output;
};

Data.setDefault = (dest, ...args) => {
  function setDefault(dest, source, path) {
    const output = dest;

    toPairs(source).forEach((sourceValue, key) => {
      const value = output[key];

      if (missing(value)) {
        output[key] = sourceValue;
      } else if (path.indexOf(value) !== -1) {
        Log.warning('possible loop');
      } else if (isData(value)) {
        setDefault(value, sourceValue, path.concat([value]));
      }
    });

    return output;
  }

  args.forEach(source => {
    if (missing(source)) return;

    if (missing(dest)) {
      if (isData(source)) {
        return setDefault({}, source, []);
      }

      return source;
    }

    if (isData(dest)) {
      return setDefault(dest, source, []);
    }
  });

  return dest;
};

// ASSUME THE DOTS (.) IN fieldName ARE SEPARATORS
// AND THE RESULTING LIST IS A PATH INTO THE STRUCTURE
// (ESCAPE "." WITH "\\.", IF REQUIRED)
Data.get = (obj, path) => {
  if (missing(obj)) return obj;

  if (path === '.') return obj;

  const pathArray = splitField(path);
  let output = obj;

  for (const step of pathArray) {
    if (isArray(output)) {
      if (step === 'length') {
        output = output.length;
      } else if (isInteger(step)) {
        output = output[step];
      } else if (isArray(output)) {
        output = output.map(o => (isObject(o) ? o[step] : null));
      }
    } else if (isObject(output)) {
      output = output[step];
    } else {
      return null;
    }

    if (missing(output)) return null;
  }

  return output;
};

Data.set = (obj, path, value) => {
  if (missing(obj) || path === '.')
    Log.error('must be given an object ad field');

  const split = splitField(path);
  const [last] = split.slice(-1);
  const pathArray = split.slice(0, split.length - 1);
  let o = obj;

  for (const step of pathArray) {
    let val = o[step];

    if (missing(val)) {
      val = {};
      o[step] = val;
    }

    o = val;
  }

  o[last] = value;

  return obj;
};

Data.add = (obj, path, value) => {
  if (missing(obj) || path === '.')
    Log.error('must be given an object ad field');

  const split = splitField(path);
  const [last] = split.slice(-1);
  const pathArray = split.slice(0, split.length - 1);
  let o = obj;

  for (const step of pathArray) {
    let val = o[step];

    if (missing(val)) {
      val = {};
      o[step] = val;
    }

    o = val;
  }

  const existing = o[last];
  if (missing(existing)) {
    o[last] = value;
  }else if (isArray(existing)){
    o[last].push(value);
  }else{
    o[last]=[existing, value];
  }

  return obj;
};


export default Data;
