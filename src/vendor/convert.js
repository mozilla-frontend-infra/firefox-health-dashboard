import { frum, toPairs, leaves, length } from './queryOps';
import { Log } from './errors';
import { isFunction, isObject, isArray, isNumeric } from './utils';
import strings from './strings';

function URL2Object(url) {

  return frum(new URLSearchParams(url).entries())
    .map(([k, v])=>[isNumeric(v)? Number.parseFloat(v) : v, k])
    .args()
    .fromLeaves();
}

function Object2URL(value) {
  return leaves(value)
    .map((v, k) => {
      if (isArray(v)){
        return frum(v).map(vv => `${encodeURIComponent(k)}=${encodeURIComponent(vv)}`).concatenate("&");
      }else {
        return `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
      }
    })
    .concatenate('&');
}

function json2value(json) {
  try {
    return JSON.parse(json);
  } catch (e) {
    Log.error(`Can not parse json:\n{{json|indent}}`, { json }, e);
  }
}

function prettyJSON(json, maxDepth) {
  if (maxDepth < 0) {
    Log.error('json is too deep');
  }

  try {
    if (Array.isArray(json)) {
      const output = frum(json)
        .map(v => {
          if (v === undefined) return;

          return prettyJSON(v, maxDepth - 1);
        })
        .exists();

      if (output.length === 0) return '[]';

      if (output.length === 1) return `[${prettyJSON(json[0], maxDepth - 1)}]`;

      const lengths = output.map(length);

      if (lengths.filter(v => v > 30).first() || lengths.sum() > 60) {
        return `[\n${strings.indent(output.concatenate(',\n'), 1)}\n]`;
      }

      return `[${output.concatenate(',')}]`;
    }

    if (isFunction(json)) {
      return 'undefined';
      // } else if (json instanceof Duration) {
      //   return convert.String2Quote(json.toString());
      // } else if (json instanceof Date) {
      //   return convert.String2Quote(json.format("dd-NNN-yyyy HH:mm:ss"));
    }

    if (isObject(json)) {
      const output = toPairs(json)
        .map((v, k) => {
          if (v === undefined) return;

          return `"${k}":${prettyJSON(v, maxDepth - 1)}`;
        })
        .exists();

      if (output.length === 0) return '{}';

      if (output.length === 1) return `{${output.first()}}`;

      const lengths = output.map(length);

      if (lengths.filter(v => v > 30).first() || lengths.sum() > 60) {
        return `{\n${strings.indent(output.concatenate(',\n'), 1)}\n}`;
      }

      return `{${output.concatenate(',')}}`;
    }

    return JSON.stringify(json);
  } catch (e) {
    Log.error('Problem with jsonification', e);
  }
}

function value2json(json) {
  return prettyJSON(json, 30);
}

export { URL2Object, Object2URL, value2json, json2value };
