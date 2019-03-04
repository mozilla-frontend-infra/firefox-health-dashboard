import dateFormat from 'dateformat';
import { coalesce, isString } from './utils';
import { value2json } from './convert';
import { round as mathRound, roundMetric } from './math';

const between = (v, min, max) => Math.max(min, Math.min(max, v));
const strings = {
  indent(value, amount) {
    const numTabs = coalesce(amount, 1);
    const indent = strings.left('\t\t\t\t\t\t', numTabs);
    const str = value.toString();
    // REMAINING WHITE IS KEPT (CASE OF CR/LF ESPECIALLY)
    const white = strings.rightBut(str, str.trimRight().length);

    return indent + str.trimRight().replace(/\n/, `\n${indent}`) + white;
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

  json(value) {
    return value2json(value);
  },
  comma(value) {
    // SNAGGED FROM http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
    const parts = value.toString().split('.');

    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return parts.join('.');
  },
  quote(value) {
    return value2json(value);
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

    return value2json();
  },

  format(value, format) {
    // see https://www.npmjs.com/package/dateformat
    const ff = coalesce(format, 'UTC:yyyy-mm-dd HH:MM:ss');

    return dateFormat(new Date(value) * 1000, ff);
  },

  unix(value) {
    return new Date(value).valueOf();
  },
};

export default strings;
