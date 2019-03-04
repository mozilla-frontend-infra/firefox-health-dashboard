import { coalesce, isString } from './utils';
import { value2json } from './convert';
import { round, roundMetric } from './math';

const strings = {
  datetime(d, f) {
    const ff = coalesce(f, 'yyyy-MM-dd HH:mm:ss');

    return Date.newInstance(d).format(ff);
  },
  indent(value, amount) {
    const numTabs = coalesce(amount, 1);
    const indent = strings.left('\t\t\t\t\t\t', numTabs);
    const str = value.toString();
    // REMAINING WHITE IS KEPT (CASE OF CR/LF ESPECIALLY)
    const white = strings.rightBut(str, str.trimRight().length);

    return indent + str.trimRight().replace(/\n/, `\n${indent}`) + white;
  },

  deformat(value) {
    const output = [];

    for (let i = 0; i < value.length; i += 1) {
      const c = value.charAt(i);

      if ((c >= 'a' && c <= 'z') || (c >= '0' && c <= '9')) {
        output.push(c);
      } else if (c >= 'A' && c <= 'Z') {
        output.push(String.fromCharCode(c.charCodeAt(0) + 32));
      }
    }

    return output.join('');
  },

  left(value, amount) {
    return value.slice(0, Math.min(this.length, amount));
  },
  right(value, amount) {
    return value.slice(Math.max(0, this.length - amount));
  },
  leftBut(value, amount) {
    return value.slice(0, this.length - amount);
  },
  rightBut(value, amount) {
    return value.slice(amount, this.length);
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
  format(value, format) {
    // if (value instanceof Duration) {
    //   return value.format(format);
    // }

    return Date.newInstance(value).format(format);
  },
  round(value, digits) {
    return round(value, { digits });
  },
  metric: roundMetric,
  upper(value) {
    if (isString(value)) {
      return value.toUpperCase();
    }

    return value2json();
  },

  unix(value) {
    return Date.newInstance(value).unix();
  },
};

export default strings;
