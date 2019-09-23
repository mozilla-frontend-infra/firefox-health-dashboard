import {
  coalesce, isString, missing, exists,
} from './utils';
import { round as mathRound, roundMetric } from './math';

const between = (v, min, max) => Math.max(min, Math.min(max, v));
const strings = {
  indent(value, amount) {
    const numTabs = coalesce(amount, 1);
    const indent = '    '.repeat(numTabs);
    const str = value.toString();
    // REMAINING WHITE IS KEPT (CASE OF CR/LF ESPECIALLY)
    const left = str.trimRight();
    const white = strings.rightBut(str, left.length);

    return indent + left.split('\n').join(`\n${indent}`) + white;
  },

  left(value, amount) {
    return value.slice(0, between(amount, 0, value.length));
  },
  right(value, amount) {
    return value.slice(between(value.length - amount, 0, value.length));
  },
  leftBut(value, amount) {
    return value.slice(0, between(value.length - amount, 0, value.length));
  },
  rightBut(value, amount) {
    return value.slice(between(amount, 0, value.length), value.length);
  },

  comma(value) {
    // SNAGGED FROM http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
    const parts = value.toString().split('.');

    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return parts.join('.');
  },
  quote(value) {
    return strings.json(value);
  },
  round(value, digits) {
    const v = isString(value) ? Number.parseFloat(value) : value;
    const r = mathRound(v, { digits });

    return `${r}`;
  },
  metric: roundMetric,
  upper(value) {
    if (isString(value)) {
      return value.toUpperCase();
    }

    return strings.json(value).toUpperCase();
  },

  lower(value) {
    if (isString(value)) {
      return value.toLowerCase();
    }

    return strings.json(value).toLowerCase();
  },

  trimLeft(value, prefix) {
    if (missing(prefix)) {
      return value.trimLeft();
    }

    let v = value;

    while (v.startsWith(prefix)) {
      v = v.slice(prefix.length);
    }

    return v;
  },
  trimRight(value, prefix) {
    if (missing(prefix)) {
      return value.trimRight();
    }

    let v = value;

    while (v.endsWith(prefix)) {
      v = strings.leftBut(v, prefix.length);
    }

    return v;
  },

  trim(value, prefix) {
    if (missing(prefix)) {
      return value.trim();
    }

    let v = value;

    while (v.startsWith(prefix)) {
      v = v.slice(prefix.length);
    }

    while (v.endsWith(prefix)) {
      v = v.slice(0, v.length - prefix.length);
    }

    return v;
  },

  replaceAll(value, find, replace) {
    return value.split(find).join(replace);
  },

  between(value, prefix, suffix) {
    let s = 0;

    if (exists(prefix)) {
      s = value.indexOf(prefix);

      if (s === -1) return null; // NOT FOUND
      s += prefix.length;
    }

    let e = value.length;

    if (exists(suffix)) {
      e = value.indexOf(suffix, s);

      if (e === -1) return null;

      if (exists(prefix)) {
        s = value.lastIndexOf(prefix, e) + prefix.length;
      }
    }

    return value.slice(s, e);
  },

  percent(value) {
    return `${mathRound(value * 100, { places: 2 })}%`;
  },

  json(value) {
    return JSON.stringify(value);
  },
};

export default strings;
