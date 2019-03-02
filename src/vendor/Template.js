import { coalesce, isString, missing } from './utils';
import { toPairs } from './queryOps';
import { value2json } from './convert';
import { round, roundMetric } from './math';
import { Exception, warning } from './errors';

// /////////////////////////////////////////////////////////////////////////
// DEFINE TEMPLATE FUNCTIONS HERE
// /////////////////////////////////////////////////////////////////////////
const FUNC = {
  datetime(d, f) {
    const ff = coalesce(f, 'yyyy-MM-dd HH:mm:ss');

    return Date.newInstance(d).format(ff);
  },
  indent(value, amount) {
    return toString(value).indent(amount);
  },
  left(value, amount) {
    return toString(value).left(amount);
  },

  deformat(value) {
    return toString(value).deformat();
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
let expandAny = null;

function expandArray(arr, namespaces) {
  // AN ARRAY OF TEMPLATES IS SIMPLY CONCATENATED
  return arr.map(t => expandAny(t, namespaces)).join('');
}

function expandLoop(loop, namespaces) {
  const { from, template, separator } = loop;

  if (!isString(from))
    throw new Exception('expecting from clause to be string');

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
    throw new Exception('expecting `from_items` clause to be string');
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

        if (FUNC[func] === undefined) {
          throw new Exception(
            `${func} is an unknown string function for template expansion`
          );
        }

        if (rest.length === 0) {
          val = FUNC[func](val);
        } else {
          try {
            // eslint-disable-next-line no-eval
            val = eval(`FUNC[func](val, ${rest}`);
          } catch (f) {
            warning(`Can not evaluate ${value2json(variable)}`, f);
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

  throw new Exception('Not recognized {{template|json}}', { template });
};

const expand = expandAny;

class Template {
  constructor(template) {
    this.template = template;
  }

  expand(values) {
    if (values === undefined) {
      return this.template;
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

    return expand(this.template, [map]);
  }

  toString(value) {
    if (isString(value)) return value;

    return value2json(value);
  } // function
}

export { Template, expand };
