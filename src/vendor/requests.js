/* global fetch */
import { parse } from 'query-string';
import { leaves, toPairs } from './vectors';
import { Log } from './logs';
import { Data } from './Data';
import { exists, isArray, isString, toArray } from './utils';
import strings from './strings';

/*
Parse a query string into an object. Leading ? or # are ignored, so you can
pass location.search or location.hash directly. Also, hanldes inner and nested
objects

see also https://github.com/sindresorhus/query-string#parsestring-options
 */
function fromQueryString(query) {
  const decode = v => {
    if (isArray(v)) {
      return v.map(decode);
    }

    if (v === null || v === '') {
      return true;
    }

    try {
      return JSON.parse(v);
    } catch (e) {
      return v;
    }
  };

  return toPairs(parse(query))
    .map(decode)
    .fromLeaves();
}

/*
Convert a JSON object into a query string
 */
function toQueryString(value) {
  const e = vv => encodeURIComponent(vv).replace(/[%]20/g, '+');
  const encode = (v, k) =>
    toArray(v)
      .filter(exists)
      .map(vv => {
        if (vv === true) {
          return e(k);
        }

        if (isString(vv)) {
          try {
            JSON.parse(vv);

            return `${e(k)}=${e(JSON.stringify(vv))}`;
          } catch (e) {
            // USE STANDARD ENCODING
          }
        }

        return `${e(k)}=${e(vv)}`;
      })
      .join('&');

  return leaves(value)
    .map(encode)
    .join('&');
}

const jsonHeaders = {
  Accept: 'application/json',
};
const fetchJson = async url => {
  const response = await fetch(url, jsonHeaders);

  if (!response) {
    return null;
  }

  if (response.status !== 200) {
    Log.error('{{status}} when calling {{url}}', {
      url,
      status: response.status,
    });
  }

  try {
    return response.json();
  } catch (error) {
    Log.error('Problem parsing {{text}}', { text: response.text() });
  }
};

const URL = ({ path, query, fragment }) => {
  const paths = toArray(path);
  const last = path.length - 1;
  const fullPath =
    last === 0
      ? paths[0]
      : paths
          .map((p, i) => {
            let output = p;

            if (i !== 0) {
              output = strings.trimLeft(output, '/');
            }

            if (i !== last) {
              output = strings.trimRight(output, '/');
            }

            return output;
          })
          .join('/');

  return [
    fullPath,
    Data.isEmpty(query) ? '' : `?${toQueryString(query)}`,
    Data.isEmpty(fragment) ? '' : `#${toQueryString(fragment)}`,
  ].join('');
};

export { fetchJson, fromQueryString, toQueryString, URL };
