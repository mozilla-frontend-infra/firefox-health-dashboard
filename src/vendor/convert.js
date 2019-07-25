import { length, selectFrom, toPairs } from './vectors';
import { Log } from './logs';
import { isData } from './datas';
import { isArray, isFunction } from './utils';
import strings from './strings';

function json2value(json) {
  try {
    return JSON.parse(json);
  } catch (e) {
    throw Log.error('Can not parse json:\n{{json|indent}}', { json }, e);
  }
}

function prettyJSON(json, maxDepth) {
  if (maxDepth < 0) {
    Log.error('json is too deep');
  }

  try {
    if (isArray(json)) {
      const output = selectFrom(json)
        .map((v) => {
          if (v === undefined) {
            return;
          }

          return prettyJSON(v, maxDepth - 1);
        })
        .exists();

      if (output.length === 0) {
        return '[]';
      }

      if (output.length === 1) {
        return `[${prettyJSON(json[0], maxDepth - 1)}]`;
      }

      const lengths = output.map(length);

      if (lengths.filter(v => v > 30).first() || lengths.sum() > 60) {
        return `[\n${strings.indent(output.join(',\n'), 1)}\n]`;
      }

      return `[${output.join(',')}]`;
    }

    if (isFunction(json)) {
      return 'undefined';
      // } else if (json instanceof Duration) {
      //   return convert.String2Quote(json.toString());
      // } else if (json instanceof Date) {
      //   return convert.String2Quote(json.format("dd-NNN-yyyy HH:mm:ss"));
    }

    if (isData(json)) {
      const output = toPairs(json)
        .map((v, k) => {
          if (v === undefined) {
            return;
          }

          return `"${k}":${prettyJSON(v, maxDepth - 1)}`;
        })
        .exists();

      if (output.length === 0) {
        return '{}';
      }

      if (output.length === 1) {
        return `{${output.first()}}`;
      }

      const lengths = output.map(length);

      if (lengths.filter(v => v > 30).first() || lengths.sum() > 60) {
        return `{\n${strings.indent(output.join(',\n'), 1)}\n}`;
      }

      return `{${output.join(',')}}`;
    }

    return JSON.stringify(json);
  } catch (e) {
    throw Log.error('Problem with jsonification', e);
  }
}

function value2json(json) {
  return prettyJSON(json, 30);
}

// deal with cyclic imports
strings.json = value2json;

function escapeRegEx(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export { value2json, json2value, escapeRegEx };
