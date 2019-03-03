/* eslint-disable no-restricted-syntax */

import { toPairs } from './queryOps';
import {
  exists,
  missing,
  isMap,
  isArray,
  isInteger,
  isObject,
  literalField,
  concatField,
  splitField,
  coalesce,
} from './utils';
import { Log } from './errors';

const Map = {};

Map.newInstance = (key, value) => {
  if (key == null) {
    Log.error('expecting a string key');
  }

  const output = {};

  output[key] = value;

  return output;
};

Map.zip = (keys, values) => {
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

Map.copy = (from, to) => {
  const output = coalesce(to, {});

  toPairs(from).forEach((v, k) => {
    if (exists(v)) output[k] = v;
  });

  return output;
};

Map.setDefault = (dest, ...args) => {
  function setDefault(dest, source, path) {
    const output = dest;

    toPairs(source).forEach((sourceValue, key) => {
      const value = output[key];

      if (missing(value)) {
        output[key] = sourceValue;
      } else if (path.indexOf(value) !== -1) {
        Log.warning('possible loop');
      } else if (isMap(value)) {
        setDefault(value, sourceValue, path.concat([value]));
      }
    });

    return output;
  } // function

  args.forEach(source => {
    if (missing(source)) return;

    if (missing(dest)) {
      if (isMap(source)) {
        return setDefault({}, source, []);
      }

      return source;
    }

    if (isMap(dest)) {
      return setDefault(dest, source, []);
    }
  });

  return dest;
};

Map.jsonCopy = value => {
  if (value === undefined) return undefined;

  return JSON.parse(JSON.stringify(value));
};

Map.clone = Map.jsonCopy;

// IF map IS NOT 1-1 THAT'S YOUR PROBLEM
Map.inverse = map => {
  const output = {};

  toPairs(map).forEach((v, k) => {
    output[v] = k;
  });

  return output;
};

// THROW AN ERROR IF WE DO NOT SEE THE GIVEN ATTRIBUTE IN THE LIST
Map.expecting = (obj, keyList) => {
  for (const k of keyList) {
    if (missing(obj[k]))
      Log.error(`expecting object to have {{k|quote}} attribute`, { k });
  } // for
};

// ASSUME THE DOTS (.) IN fieldName ARE SEPARATORS
// AND THE RESULTING LIST IS A PATH INTO THE STRUCTURE
// (ESCAPE "." WITH "\\.", IF REQUIRED)
Map.get = (obj, path) => {
  if (missing(obj)) return obj;

  if (path === '.') return obj;

  const pathArray = splitField(path);
  let output = obj;

  for (const step of pathArray) {
    if (step === 'length') {
      output = output.length;
    } else if (isInteger(step)) {
      output = output[step];
    } else if (isArray(output)) {
      output = output.map(o => o[step]);
    } else {
      output = output[step];
    }

    if (missing(output)) return null;
  }

  return output;
};

Map.set = (obj, path, value) => {
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

// RETURN TRUE IF MAPS LOOK IDENTICAL
Map.equals = (a, b) => {
  for (const key of Object.keys(a)) {
    if (b[key] !== a[key]) return false;
  } // for

  for (const key of Object.keys(b)) {
    if (b[key] !== a[key]) return false;
  } // for

  return true;
};

// RETURN LEAVES
Map.leafItems = map => {
  const output = [];

  function leaves(map, prefix) {
    toPairs(map).forEach((val, key) => {
      let fullname = literalField(key);

      if (prefix) fullname = concatField(prefix, fullname);

      if (missing(val)) {
        // do nothing
      } else if (isObject(val)) {
        leaves(val, fullname);
      } else {
        output.push([fullname, val]);
      }
    });
  }

  leaves(map, '.');

  return output;
};

// USE THE MAP FOR REVERSE LOOKUP ON codomain VALUES PROVIDED
// SINCE THE MAP CODOMAIN IS A VALUE, === IS USED FOR COMPARISION
Map.reverse = (map, codomain) => {
  const output = [];

  codomain.forEach(c => {
    toPairs(map).forEach((v, k) => {
      if (v === c) output.push(k);
    });
  });

  return output;
};

export default Map;
