/* global fetch */
import { parse } from 'query-string';
import {
  sleep, exists, isArray, isString, toArray, missing,
} from './utils';
import { Data } from './datas';
import { Duration } from './durations';
import { GMTDate as Date } from './dates';
import strings from './strings';
import { Log } from './logs';
import { leaves, toPairs } from './vectors';
import { KVStore } from './db_cache';

/*
Parse a query string into an object. Leading ? or # are ignored, so you can
pass location.search or location.hash directly. Also, hanldes inner and nested
objects

see also https://github.com/sindresorhus/query-string#parsestring-options
 */
function fromQueryString(query) {
  const decode = (v) => {
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
  const encode = (v, k) => toArray(v)
    .filter(exists)
    .map((vv) => {
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

const requestCache = new KVStore('heath.graphics cache');
const jsonHeaders = {
  Accept: 'application/json',
};
const fetchJson = async (url, options = {}) => {
  const { expire } = options;
  const expires = missing(expire)
    ? null
    : Date.now().add(Duration.newInstance(expire));

  if (expire) {
    const oldData = await requestCache.get(url);

    (async () => {
      // Launch promise chain to fill cache with fresh data
      try {
        await sleep(10000); // wait 10sec so others can make requests
        Log.note('refesh cache for {{url}}', { url });
        const response = await fetch(url, jsonHeaders);

        if (!response || !response.ok) {
          await requestCache.set(url, null);
        }

        const content = await response.text();

        await requestCache.set(url, { url, content, expires });
      } catch (error) {
        Log.warning('Problem refreshing cache of {{url}}', { url }, error);
      }
    })();

    if (oldData && oldData.expires >= Date.now()) {
      return JSON.parse(oldData.content);
    }
  }

  try {
    const response = await fetch(url, jsonHeaders);

    if (!response) {
      return null;
    }

    if (!response.ok) {
      Log.error('{{status}} when calling {{url}}', {
        url,
        status: response.status,
      });
    }

    const content = await response.text();

    try {
      if (expire) {
        await requestCache.set(url, { url, content, expires });
      }

      return JSON.parse(content);
    } catch (error) {
      Log.error('Problem parsing {{text}}', { text: response.text() }, error);
    }
  } catch (error) {
    throw Log.error('Problem fetching {{url}}', { url }, error);
  }
};

const URL = ({ path, query, fragment }) => {
  const paths = toArray(path);
  const last = path.length - 1;
  const fullPath = last === 0
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

export {
  fetchJson, fromQueryString, toQueryString, URL,
};
