/* eslint-disable no-restricted-syntax */
import chunk from 'lodash/chunk';
import unzip from 'lodash/unzip';
import sortBy from 'lodash/sortBy';
import {
  concatField,
  exists,
  first,
  isArray,
  isObject,
  isString,
  last,
  literalField,
  missing,
  toArray,
} from './utils';
import { sum } from './math';
import Data from './Data';

let internalFrum = null;
let internalToPairs = null;

function preSelector(columnName) {
  // convert to an array of [selector(), name] pairs
  if (isArray(columnName)) {
    // select many columns
    return internalFrum(columnName)
      .map(preSelector)
      .flatten()
      .sortBy(([, b]) => b);
  }

  if (typeof columnName === 'object') {
    return internalToPairs(columnName)
      .map((value, name) => [row => Data.get(row, value), name])
      .sortBy(([, b]) => b);
  }

  if (isString(columnName)) {
    return [[row => Data.get(row, columnName), columnName]];
  }
}

function selector(columnName) {
  /*
     var row = { a: 1, b: '2', c: 3 };

     convert string into function that selects property from row
         selector('b')(row) === '2'

     convert array of strings into function that extracts properties from a row
         selector(['a', 'c'])(row) === {a: 1, c: 3}

     convert an object into function that renames properties of a row
         selector({x: 'a', y: 'b'})(row) === {x: 1, y: '2'}

   */
  if (isObject(columnName) || isArray(columnName)) {
    // select many columns
    const cs = preSelector(columnName).args();

    return row => cs.map(func => func(row)).fromPairs();
  }

  if (isString(columnName)) {
    return row => Data.get(row, columnName);
  }

  return columnName;
}

class Wrapper {
  // Represent an iterable set of function arguments
  constructor(argsGen) {
    this.argsGen = argsGen;
  }

  *[Symbol.iterator]() {
    for (const [a] of this.argslist) {
      yield a;
    }
  }

  get argslist() {
    return this.argsGen();
  }

  // ///////////////////////////////////////////////////////////////////////////
  // CHAINABLE METHODS
  // ///////////////////////////////////////////////////////////////////////////

  map(func) {
    // map the value, do not touch the other args
    function* output(argslist) {
      let i = 0;

      for (const [value, ...args] of argslist) {
        yield [func(value, ...args), ...args, i];
        i += 1;
      }
    }

    return new Wrapper(() => output(this.argslist));
  }

  select(selectors) {
    // run selector on all rows
    return this.map(selector(selectors));
  }

  forEach(func) {
    // execute func for each element, do not change this
    let i = 0;

    for (const args of this.argslist) {
      func(...args, i);
      i += 1;
    }

    return this;
  }

  enumerate() {
    // append extra index parameter to args
    function* output(argslist) {
      let i = 0;

      for (const args of argslist) {
        yield [...args, i];
        i += 1;
      }
    }

    return new Wrapper(() => output(this.argslist));
  }

  args() {
    // Convert value into args
    function* output(list) {
      for (const args of list) yield args[0];
    }

    return new Wrapper(() => output(this.argslist));
  }

  filter(func) {
    function* output(argslist) {
      for (const [value, ...args] of argslist)
        if (func(value, ...args)) yield [value];
    }

    return new Wrapper(() => output(this.argslist));
  }

  limit(max) {
    function* output(argslist) {
      let i = 0;

      for (const args of argslist) {
        if (i >= max) break;
        yield args;
        i += 1;
      }
    }

    return new Wrapper(() => output(this.argslist));
  }

  where(expression) {
    // Expecting a object of {columnName: value} form to use as a filter
    // return only matching rows
    const func = row => {
      for (const [name, value] of Object.entries(expression)) {
        if (isArray(value)) {
          if (!value.includes(Data.get(row, name))) return false;
        } else if (exists(value)) {
          if (Data.get(row, name) !== value) return false;
        }
      }

      return true;
    };

    return this.filter(func);
  }

  exists(columns = null) {
    // Expect a list of column names that must exist
    let func = null;

    if (missing(columns)) {
      func = exists;
    } else {
      const selects = toArray(columns).map(selector);

      func = row => {
        for (const s of selects) if (missing(s(row))) return false;

        return true;
      };
    }

    return this.filter(func);
  }

  missing(columns = null) {
    // Expect a list of column names that must be missing
    let func = null;

    if (missing(columns)) {
      func = missing;
    } else {
      const selects = toArray(columns).map(selector);

      func = row => {
        for (const s of selects) if (exists(s(row))) return false;

        return true;
      };
    }

    return this.filter(func);
  }

  flatten() {
    // assume this is an array of lists, return array of all elements
    // append extra index parameter to args
    function* output(argslist) {
      for (const [values] of argslist)
        for (const value of values) yield [value];
    }

    return new Wrapper(() => output(this.argslist));
  }

  groupBy(columns) {
    // Groupby one, or many, columns by name or by {name: selector} pairs
    // return array of [rows, key, index] tuples
    const func = selector(columns);
    const output = {};

    if (isArray(columns)) {
      let g = 0;

      for (const args of this.argslist) {
        const key = func(...args);
        const skey = JSON.stringify(key);
        let triple = output[skey];

        if (!triple) {
          triple = [[], key, g];
          g += 1;
          output[skey] = triple;
        }

        triple[0].push(args[0]);
      }
    } else {
      // single-column groupby is faster
      let g = 0;

      for (const args of this.argslist) {
        const key = func(...args);
        let triple = output[key];

        if (!triple) {
          triple = [[], key, g];
          g += 1;
          output[key] = triple;
        }

        triple[0].push(args[0]);
      }
    }

    return new Wrapper(function* outputGen() {
      for (const v of Object.values(output)) yield v;
    });
  }

  // ///////////////////////////////////////////////////////////////////////////
  // TERMINAL METHODS
  // ///////////////////////////////////////////////////////////////////////////

  toArray() {
    return Array.from(this);
  }

  fromPairs() {
    // return an object from (value, key) pairs
    const output = {};

    for (const [v, k] of this.argslist) output[k] = v;

    return output;
  }

  fromLeaves() {
    // return an object from (value, path) pairs
    const output = {};

    for (const [v, k] of this.argslist) Data.add(output, k, v);

    return output;
  }

  first() {
    // return first element
    return first(this);
  }

  last() {
    // return last element
    return last(this);
  }

  sum() {
    return sum(this);
  }

  get length() {
    let count = 0;

    /* eslint-disable-next-line no-unused-vars */
    for (const _ of this.argslist) count += 1;

    return count;
  }

  concatenate(separator) {
    return Array.from(this).join(separator);
  }

  findIndex(func) {
    // return index of first element where func returns true
    // return null if not found
    let i = 0;

    for (const args of this.argslist) {
      if (func(...args)) return i;
      i += 1;
    }

    return null;
  }

  index(column) {
    // Return an object indexed on `column`
    // We assume the key is unique
    const output = {};

    for (const [row] of this.argslist) {
      const key = Data.get(row, column);

      if (!(key in output)) {
        output[key] = row;
      } else {
        throw new Error('expecting index to be unique');
      }
    }

    return output;
  }
}

function frum(list) {
  if (list instanceof Wrapper) {
    return list;
  }

  return new Wrapper(function* outputGen() {
    for (const v of list) yield [v];
  });
}

internalFrum = frum;

function toPairs(obj) {
  // convert Object (or Data) into [value, key] pairs
  // notice the **value is first**
  if (missing(obj)) return new Wrapper(() => []);

  if (obj instanceof Map) {
    return new Wrapper(function* outputGen() {
      for (const [k, v] of obj.entries()) yield [v, k];
    });
  }

  return new Wrapper(function* outputGen() {
    for (const [k, v] of Object.entries(obj)) yield [v, k];
  });
}

internalToPairs = toPairs;

function leaves(obj) {
  // Convert Object into list of [value, path] pairs
  // where path is dot delimited path deep into object
  function* leafGen(map, prefix) {
    for (const [val, key] of toPairs(map).argsGen()) {
      const path = concatField(prefix, literalField(key));

      if (isObject(val)) {
        for (const pair of leafGen(val, path)) yield pair;
      } else {
        yield [val, path];
      }
    }
  }

  return new Wrapper(() => leafGen(obj, '.'));
}

function length(list) {
  // return length of this list
  if (list instanceof Wrapper) return list.length;

  return list.length;
}

function extendWrapper(methods) {
  // Add a chainable method to Wrapper
  internalToPairs(methods).forEach((method, name) => {
    // USE function(){} DECLARATION TO BIND this AT CALL TIME
    Wrapper.prototype[name] = function anonymous(...args) {
      return internalFrum(method(this.toArray(), ...args));
    };
  });
}

// Add Lodash functions
extendWrapper({
  chunk,
  unzip,
  zip: unzip,
  sort: sortBy,
  sortBy,

  // SELECT a.*, b.* FROM listA a LEFT JOIN listB b on b[propB]=a[propA]
  // Return Cartesian product of listA and listB,
  // where each element has properties; from one of each list: { ...a, ...b }
  // but only include elements where b[propB]==a[propA] (b ∈ listB, a ∈ listA)
  join: function join(listA, propA, listB, propB) {
    const lookup = internalFrum(listB)
      .groupBy(propB)
      .fromPairs();

    return internalFrum(listA)
      .map(rowA => lookup[rowA[propA]].map(rowB => ({ ...rowA, ...rowB })))
      .flatten();
  },

  append: function append(list, value) {
    return [...list, value];
  },

  reverse: function reverse(list) {
    return list.reverse();
  },
});

export { frum, toPairs, leaves, first, last, length };
