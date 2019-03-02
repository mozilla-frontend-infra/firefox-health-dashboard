import { frum, toPairs } from './queryOps';
import { error, warning } from './errors';
import { isFunction, isObject } from './utils';
import strings from './strings';

function URL2Object(url) {
  return frum(new URLSearchParams(url).entries())
    .map(([k, v]) => [v, k])
    .args()
    .fromPairs();
}

function Object2URL(value) {
  return toPairs(value)
    .map((v, k) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .concatenate('&');
}

function json2value(json) {
  try {
    return JSON.parse(json);
  } catch (e) {
    throw error(`Can not parse json:\n{{json|indent}}`, { json }, e);
  }
}

function prettyJSON(json, maxDepth) {
  if (maxDepth < 0) {
    throw error('json is too deep');
  }

  try {
    if (Array.isArray(json)) {
      try {
        const singleLine = JSON.stringify(json);

        if (singleLine.length < 60) return singleLine;
      } catch (e) {
        warning('Problem turning array to json:', e);
      }

      if (json.length === 0) return '[]';

      if (json.length === 1) return `[${prettyJSON(json[0], maxDepth - 1)}]`;

      return `[\n${json
        .map(v => {
          if (v === undefined) return 'undefined';

          return strings.indent(prettyJSON(v, maxDepth - 1), 1);
        })
        .join(',\n')}\n]`;
    }

    if (isFunction(json)) {
      return 'undefined';
      // } else if (json instanceof Duration) {
      //   return convert.String2Quote(json.toString());
      // } else if (json instanceof Date) {
      //   return convert.String2Quote(json.format("dd-NNN-yyyy HH:mm:ss"));
    }

    if (isObject(json)) {
      try {
        const singleLine = JSON.stringify(json);

        if (singleLine.length < 60) return singleLine;
      } catch (e) {
        warning('Problem turning object to json:', e);
      }

      const keys = Object.keys(json);

      if (keys.length === 0) return '{}';

      if (keys.length === 1)
        return `{"${keys[0]}":${prettyJSON(
          json[keys[0]],
          maxDepth - 1
        ).trim()}}`;

      let output = '{\n\t';

      toPairs(json).forEach((v, k) => {
        if (v !== undefined) {
          if (output.length > 3) output += ',\n\t';
          output += `"${k}":${strings
            .indent(prettyJSON(v, maxDepth - 1), 1)
            .trim()}`;
        }
      });

      return `${output}\n}`;
    }

    return JSON.stringify(json);
  } catch (e) {
    throw error('Problem with jsonification', e);
  }
} // function

function value2json(json) {
  return prettyJSON(json, 30);
}

export { URL2Object, Object2URL, value2json, json2value };
