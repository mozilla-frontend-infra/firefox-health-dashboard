/* eslint-disable no-restricted-syntax */
import unzip from 'lodash/unzip';
import lodashSortBy from 'lodash/sortBy';
import { Data, isData } from './Data';
import {
  concatField,
  exists,
  first,
  isArray,
  isFunction,
  isString,
  last,
  literalField,
  missing,
  toArray,
} from './utils';
import { average, geomean, max, min, sum } from './math';
import { Log } from './logs';
import { jx } from './jx/expressions';

let internalselectFrom = null;
let internalToPairs = null;
const getI = i => m => m[i];

function preSelector(columnName) {
  // Return an array of [selector(), name] pairs

  if (isArray(columnName)) {
    // select many columns
    return internalselectFrom(columnName)
      .sortBy()
      .map(name => {
        if (isString(name)) return [[row => Data.get(row, name), name]];

        return preSelector(name).map(([s, n]) => [s, concatField(name, n)]);
      })
      .flatten();
  }

  if (typeof columnName === 'object') {
    return internalToPairs(columnName)
      .sortBy((selectors, name) => name)
      .map((selector, name) =>
        preSelector(selector).map(([s, n]) => [s, concatField(name, n)])
      )
      .flatten();
  }

  if (isString(columnName)) {
    return [[row => Data.get(row, columnName), '.']];
  }
}

function selector(columnName) {
  /*
     const row = { a: 1, b: '2', c: 3 };

     convert string into function that extracts property from row
         selector('b')(row) === '2'

     convert array of strings into function that extracts properties from a row
         selector(['a', 'c'])(row) === {a: 1, c: 3}

     convert an object into function that renames properties of a row
         selector({x: 'a', y: 'b'})(row) === {x: 1, y: '2'}

   */
  if (isData(columnName) || isArray(columnName)) {
    // select many columns
    const cs = preSelector(columnName).args();

    return row => cs.map(func => func(row)).fromLeaves();
  }

  if (isString(columnName)) {
    return row => Data.get(row, columnName);
  }

  return columnName;
}

class ArrayWrapper {
  // Provide a fluent interface to Array, with some extra functions
  // https://en.wikipedia.org/wiki/Fluent_interface

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

    return new ArrayWrapper(() => output(this.argslist));
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

    return new ArrayWrapper(() => output(this.argslist));
  }

  args() {
    // Convert value into args
    function* output(list) {
      for (const args of list) yield args[0];
    }

    return new ArrayWrapper(() => output(this.argslist));
  }

  slice(start) {
    // restrict to just rows with index >= start
    function* output(argslist) {
      let i = 0;

      for (const args of argslist) {
        if (i >= start) yield args;
        i += 1;
      }
    }

    return new ArrayWrapper(() => output(this.argslist));
  }

  filter(func) {
    // restrict to rows where `func()` is truthy
    function* output(argslist) {
      for (const [value, ...args] of argslist)
        if (func(value, ...args)) yield [value];
    }

    return new ArrayWrapper(() => output(this.argslist));
  }

  limit(max) {
    // restrict to rows with index < max
    function* output(argslist) {
      let i = 0;

      for (const args of argslist) {
        if (i >= max) break;
        yield args;
        i += 1;
      }
    }

    return new ArrayWrapper(() => output(this.argslist));
  }

  where(expression) {
    // Expecting a object of {columnName: value} form to use as a filter
    // return only matching rows
    return this.filter(jx({ eq: expression }));
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

  chunk(size) {
    // return rows containing arrays of length `size`
    function* output(argslist) {
      let count = 0;
      let acc = [];

      for (const [value] of argslist) {
        if (acc.length === size) {
          yield [internalselectFrom(acc), count];
          count += 1;
          acc = [];
        }

        acc.push(value);
      }

      if (acc.length > 0) yield [internalselectFrom(acc), count];
    }

    return new ArrayWrapper(() => output(this.argslist));
  }

  flatten() {
    // assume this is an array of lists, return array of all elements
    // append extra index parameter to args
    function* output(argslist) {
      for (const [values] of argslist)
        for (const value of values) yield [value];
    }

    return new ArrayWrapper(() => output(this.argslist));
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

    return new ArrayWrapper(function* outputGen() {
      for (const v of Object.values(output)) yield v;
    });
  }

  sortBy(selectors) {
    const func = toArray(selectors).map(selector => {
      if (missing(selector)) {
        return ([arg]) => arg;
      }

      if (isFunction(selector)) {
        return args => selector(...args);
      }

      const func = jx(selector);

      return ([arg]) => func(arg);
    });
    const sorted = lodashSortBy(Array.from(this.argsGen()), func);

    return new ArrayWrapper(function* outputGen() {
      for (const args of sorted) yield args;
    });
  }

  // ///////////////////////////////////////////////////////////////////////////
  // TERMINAL METHODS
  // ///////////////////////////////////////////////////////////////////////////

  toArray() {
    return Array.from(this);
  }

  raw() {
    // return args list (fro debugging)
    return Array.from(this.argslist);
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

  average() {
    return average(this);
  }

  geomean() {
    return geomean(this);
  }

  max() {
    return max(this);
  }

  min() {
    return min(this);
  }

  some(func) {
    // return true if func(...args) returns true for some args
    for (const args of this.argslist) {
      if (func(...args)) return true;
    }

    return false;
  }

  every(func) {
    // return true if func(...args) returns true for every args
    for (const args of this.argslist) {
      if (!func(...args)) return false;
    }

    return true;
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
        Log.error('expecting index to be unique');
      }
    }

    return output;
  }
}

function selectFrom(list, ...more) {
  if (list instanceof ArrayWrapper) {
    return list;
  }

  if (more.length) {
    return new ArrayWrapper(function* outputGen() {
      let i = 0;

      for (const v of list) {
        yield [v, ...more.map(getI(i))];
        i += 1;
      }
    });
  }

  return new ArrayWrapper(function* outputGen() {
    for (const v of list) yield [v];
  });
}

internalselectFrom = selectFrom;

/*
 * convert Object (or Data) into [value, key] pairs
 * notice the **value is first**
 */
function toPairs(obj) {
  if (missing(obj)) return new ArrayWrapper(() => []);

  if (obj instanceof Map) {
    return new ArrayWrapper(function* outputGen() {
      for (const [k, v] of obj.entries()) yield [v, k];
    });
  }

  return new ArrayWrapper(function* outputGen() {
    for (const [k, v] of Object.entries(obj)) yield [v, k];
  });
}

ArrayWrapper.prototype.all = ArrayWrapper.prototype.every;
ArrayWrapper.prototype.any = ArrayWrapper.prototype.some;

internalToPairs = toPairs;

/*
 * Convert Object into list of [value, path] pairs
 * where path is dot delimited path deep into object
 */
function leaves(obj) {
  function* leafGen(map, prefix) {
    for (const [val, key] of toPairs(map).argsGen()) {
      const path = concatField(prefix, literalField(key));

      if (isData(val)) {
        for (const pair of leafGen(val, path)) yield pair;
      } else {
        yield [val, path];
      }
    }
  }

  return new ArrayWrapper(() => leafGen(obj, '.'));
}

function length(list) {
  // return length of this list
  if (list instanceof ArrayWrapper) return list.length;

  return list.length;
}

function extendWrapper(methods) {
  // Add a chainable method to Wrapper
  internalToPairs(methods).forEach((method, name) => {
    // USE function(){} DECLARATION TO BIND this AT CALL TIME
    ArrayWrapper.prototype[name] = function anonymous(...args) {
      return internalselectFrom(method(this.toArray(), ...args));
    };
  });
}

// Add Lodash functions
extendWrapper({
  unzip,
  zip: unzip,

  // SELECT a.*, b.* FROM listA a LEFT JOIN listB b on b[propB]=a[propA]
  // Return Cartesian product of listA and listB,
  // where each element has properties; from one of each list: { ...a, ...b }
  // but only include elements where b[propB]==a[propA] (b ∈ listB, a ∈ listA)
  leftJoin: function leftJoin(listA, propA, listB, propB) {
    const lookup = internalselectFrom(listB)
      .groupBy(propB)
      .fromPairs();
    const getterA = jx(propA);

    return internalselectFrom(listA)
      .map(rowA => lookup[getterA(rowA)].map(rowB => ({ ...rowA, ...rowB })))
      .flatten();
  },

  append: function append(list, value) {
    return [...list, value];
  },

  reverse: function reverse(list) {
    return list.slice().reverse();
  },
});

export { selectFrom, toPairs, leaves, first, last, length, ArrayWrapper };
