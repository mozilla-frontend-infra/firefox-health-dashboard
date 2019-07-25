import {
  array, coalesce, isArray, isString, missing,
} from './utils';
import { Data, isData } from './datas';
import strings from './strings';

let expandAny = null;

class Template {
  constructor(template) {
    this.template = template;
  }
}

function expandArray(arr, namespaces) {
  // AN ARRAY OF TEMPLATES IS SIMPLY CONCATENATED
  return arr.map(t => expandAny(t, namespaces)).join('');
}

function expandLoop(loop, namespaces) {
  const { from, template, separator } = loop;

  if (!isString(from)) {
    Template.log.error('expecting from clause to be string');
  }

  return Data.get(namespaces[0], loop.from)
    .map((m) => {
      const ns = Data.copy(namespaces[0]);

      if (isData(m)) {
        Object.entries(m).forEach(([k, v]) => {
          ns[k.toLowerCase()] = v;
        });
      }

      namespaces.forEach((n, i) => {
        ns[array(i + 3).join('.')] = n;
      });

      const nns = namespaces.slice();

      nns.unshift(ns);

      return expandAny(template, nns);
    })
    .join(coalesce(separator, ''));
}

function run(method, val, rest) {
  // eslint-disable-next-line no-eval
  return eval(`method(val, ${rest}`);
}

function expandText(template, namespaces) {
  // namespaces IS AN ARRAY OBJECTS FOR VARIABLE NAME LOOKUP
  // CASE INSENSITIVE VARIABLE REPLACEMENT

  // COPY VALUES, BUT WITH lowerCase KEYS
  const ns = namespaces[0];
  const [aString, ...varStringPairs] = template.split('{{');
  const acc = [aString];

  return [
    acc,
    ...varStringPairs.map((vsp) => {
      const [variable, suffixString] = vsp.split('}}', 2);
      const [accessor, ...postProcessing] = variable.split('|');
      let val = Data.get(ns, accessor.toLowerCase());

      postProcessing.forEach((step) => {
        const [func, rest] = step.split('(', 2);

        if (strings[func] === undefined) {
          Template.log.error(
            '{{func}} is an unknown string function for template expansion',
            { func },
          );
        }

        const method = strings[func];

        if (missing(rest)) {
          val = method(val);
        } else {
          try {
            val = run(method, val, rest);
          } catch (f) {
            Template.log.warning(
              'Can not evaluate {{variable|json}}',
              { variable },
              f,
            );
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

      if (isString(val)) {
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

  if (isArray(template)) {
    return expandArray(template, namespaces);
  }

  if (isString(template)) {
    return expandText(template, namespaces);
  }

  if (template.from) {
    return expandLoop(template, namespaces);
  }

  throw Template.log.error('Not recognized {{template|json}}', { template });
};

function expando(template, parameters) {
  if (parameters === undefined) {
    if (isString(template)) {
      return template;
    }

    Template.log.error('Must have parameters');
  }

  function lower(v) {
    if (v == null) {
      return v;
    }

    if (isData(v)) {
      const output = {};

      Object.entries(v).forEach(([k, v]) => {
        output[k.toLowerCase()] = lower(v);
      });

      return output;
    }

    return v;
  }

  const map = lower(parameters);

  return expandAny(template, [map]);
}

Template.expand = expando;

Template.prototype.expand = function expand(values) {
  return expando(this.template, values);
};

export { Template }; // eslint-disable-line import/prefer-default-export
