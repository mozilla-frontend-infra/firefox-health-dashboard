import { coalesce, isString, missing } from './utils';
import { toPairs } from './queryOps';
import { value2json } from './convert';
import { error, warning } from './errors';
import Map from './Map';
import strings from './strings';

let expandAny = null;

function expandArray(arr, namespaces) {
  // AN ARRAY OF TEMPLATES IS SIMPLY CONCATENATED
  return arr.map(t => expandAny(t, namespaces)).join('');
}

function expandLoop(loop, namespaces) {
  const { from, template, separator } = loop;

  if (!isString(from)) throw error('expecting from clause to be string');

  return Map.get(namespaces[0], loop.from)
    .map(m => {
      const ns = Map.copy(namespaces[0]);

      ns['.'] = m;

      if (m instanceof Object && !(m instanceof Array)) {
        toPairs(m).forEach((v, k) => {
          ns[k.toLowerCase()] = v;
        });
      }

      namespaces.forEach((n, i) => {
        ns[Array(i + 3).join('.')] = n;
      });

      return expandAny(template, namespaces.copy().prepend(ns));
    })
    .join(coalesce(separator, ''));
}

/*
 LOOP THROUGH THEN key:value PAIRS OF THE OBJECT
 */
function expandItems(loop, namespaces) {
  Map.expecting(loop, ['from_items', 'template']);

  if (typeof loop.from_items !== 'string') {
    throw error('expecting `from_items` clause to be string');
  }

  return Map.map(Map.get(namespaces[0], loop.from_items), (name, value) => {
    const map = Map.copy(namespaces[0]);

    map.name = name;
    map.value = value;

    if (value instanceof Object && !(value instanceof Array)) {
      toPairs(value).forEach((v, k) => {
        map[k.toLowerCase()] = v;
      });
    }

    namespaces.forEach((n, i) => {
      map[Array(i + 3).join('.')] = n;
    });

    return expandAny(loop.template, namespaces.copy().prepend(map));
  }).join(loop.separator === undefined ? '' : loop.separator);
}

function expandText(template, namespaces) {
  // namespaces IS AN ARRAY OBJECTS FOR VARIABLE NAME LOOKUP
  // CASE INSENSITIVE VARIABLE REPLACEMENT

  // COPY VALUES, BUT WITH lowerCase KEYS
  const map = namespaces[0];
  const [aString, ...varStringPairs] = template.split('{{');
  const acc = [aString];

  return [
    acc,
    ...varStringPairs.map(vsp => {
      const [variable, suffixString] = vsp.split('}}', 2);
      const [key, ...path] = variable.split('|');
      let val = Map.get(map, key.toLowerCase());

      path.forEach(step => {
        const [func, rest] = step.split('(', 2);

        if (strings[func] === undefined) {
          throw error(
            `{{func}} is an unknown string function for template expansion`,
            { func }
          );
        }

        if (missing(rest)) {
          val = strings[func](val);
        } else {
          try {
            // eslint-disable-next-line no-eval
            val = eval(`strings[func](val, ${rest}`);
          } catch (f) {
            warning(`Can not evaluate {{variable|json}}`, { variable }, f);
          }
        }
      });

      if (val === undefined) {
        return `undefined${suffixString}`;
      }

      if (val == null) {
        // NULL IS NOTHING
        return suffixString;
      }

      if (typeof val === 'string') {
        return val + suffixString;
      }

      if (val.toString) {
        return val.toString() + suffixString;
      }

      return `${val}${suffixString}`;
    }),
  ].join('');
}

expandAny = (template, namespaces) => {
  if (missing(template)) {
    return '';
  }

  if (Array.isArray(template)) {
    return expandArray(template, namespaces);
  }

  if (isString(template)) {
    return expandText(template, namespaces);
  }

  if (template.from_items) {
    return expandItems(template, namespaces);
  }

  if (template.from) {
    return expandLoop(template, namespaces);
  }

  throw error('Not recognized {{template|json}}', { template });
};

function expand(template, values) {
  if (values === undefined) {
    return template;
  }

  function lower(v) {
    if (v == null) {
      return v;
    }

    if (
      typeof v === 'object' &&
      !(v instanceof Array) &&
      !(v instanceof Date)
      // !(v instanceof Duration)
    ) {
      return toPairs(v)
        .map((v, k) => [lower(v), k.toLowerCase()])
        .args()
        .fromPairs();
    }

    return v;
  } // function

  const map = lower(values);

  return expandAny(template, [map]);
}

class Template {
  constructor(template) {
    this.template = template;
  }

  expand(values) {
    expand(this.template, values);
  }

  toString(value) {
    if (isString(value)) return value;

    return value2json(value);
  } // function
}

export { Template, expand };
