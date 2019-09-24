/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */

import unzip from 'lodash/unzip';
import lodashSortBy from 'lodash/sortBy';
import {
  coalesce,
  concatField,
  Data,
  exists,
  first,
  isArray,
  isData,
  isFunction,
  isString,
  last,
  literalField,
  MANY_TYPES,
  missing,
  reverse,
  toArray,
} from './utils';
import {
  average, geomean, max, min, sum, count,
} from './math';
import { Log } from './logs';
import jx from './jx/expressions';

const DEBUG = false;
let internalFrom = null;
let internalToPairs = null;
let internalLeaves = null;
const getI = i => m => m[i];

function preSelector(columnName) {
  // Return an array of [selector(), name] pairs

  if (isArray(columnName)) {
    // select many columns
    return internalFrom(columnName)
      .sort()
      .map((select) => {
        if (isString(select)) {
          const selector = jx(select);

          return [[selector, select]];
        }

        return preSelector(select);
      })
      .flatten();
  }

  if (isData(columnName)) {
    return internalLeaves(columnName)
      .sort((selector, path) => path)
      .map((selector, path) => preSelector(selector).map(([s, n]) => [s, concatField(path, n)]))
      .flatten();
  }

  return [[jx(columnName), '.']];
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
    return jx(columnName);
  }

  return columnName;
}

function* runCounter(self, argsGen) {
  if (self.emitted > 10000) {
    Log.warning('Too many reruns {{emitted}} emitted over {{runs}} runs', {
      ...self,
    });
  }

  self.runs += 1;

  for (const args of argsGen()) {
    yield args;
    self.emitted += 1;
  }
}

class ArrayWrapper {
  // Provide a fluent interface to Array, with some extra functions
  // https://en.wikipedia.org/wiki/Fluent_interface

  // Represent an iterable set of function arguments
  // argsGen a function, that returns an argument generator
  constructor(argsGen, ops = { debug: DEBUG }) {
    if (ops.debug) {
      this.runs = 0;
      this.emitted = 0;
      this.argsGen = () => runCounter(this, argsGen);
    } else {
      this.argsGen = argsGen;
    }
  }

  * [Symbol.iterator]() {
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
    // apply func to args
    // return same args but with first value replaced with func result
    function* output(argslist) {
      for (const [value, ...args] of argslist) yield [func(value, ...args), ...args];
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

  /*
  append index to args
   */
  enumerate() {
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

  filter(func) {
    // restrict to rows where `func()` is truthy
    function* output(argslist) {
      for (const args of argslist) {
        const v = func(...args);
        if (v !== false && exists(v)) yield args;
      }
    }

    return new ArrayWrapper(() => output(this.argslist));
  }

  /*
  restrict to just rows with index >= start
   */
  slice(start) {
    function* output(argslist) {
      let i = 0;

      for (const args of argslist) {
        if (i >= start) {
          yield args;
        }

        i += 1;
      }
    }

    return new ArrayWrapper(() => output(this.argslist));
  }

  /*
  restrict to rows with index < max
  */
  limit(max) {
    function* output(argslist) {
      let i = 0;

      for (const args of argslist) {
        if (i >= max) {
          break;
        }

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

      func = (row) => {
        for (const s of selects) {
          if (missing(s(row))) {
            return false;
          }
        }

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

      func = (row) => {
        for (const s of selects) {
          if (exists(s(row))) {
            return false;
          }
        }

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
          yield [internalFrom(acc), count];
          count += 1;
          acc = [];
        }

        acc.push(value);
      }

      if (acc.length > 0) {
        yield [internalFrom(acc), count];
      }
    }

    return new ArrayWrapper(() => output(this.argslist));
  }

  flatten() {
    // assume this is an array of lists, return array of all elements
    // append extra index parameter to args
    function* output(argslist) {
      for (const [values] of argslist) {
        if (exists(values)) {
          for (const value of values) {
            yield [value];
          }
        }
      }
    }

    return new ArrayWrapper(() => output(this.argslist));
  }

  edges(...args) {
    if (!ArrayWrapper.edges) {
      Log.error('import ./jx/cubes.js to use this method');
    }

    return ArrayWrapper.edges(this, ...args);
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

  sort(selectors) {
    if (missing(selectors)) {
      const simpleSorted = lodashSortBy(Array.from(this.argsGen()), [
        ([arg]) => arg,
      ]);

      return new ArrayWrapper(
        function* outputGen() {
          for (const args of simpleSorted) yield args;
        },
        { debug: false },
      );
    }

    const func = toArray(selectors).map((selector) => {
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

    return new ArrayWrapper(
      function* outputGen() {
        for (const args of sorted) yield args;
      },
      { debug: false },
    );
  }

  /*
  return just the unique values
   */
  union() {
    const result = new Set([...this]);

    return new ArrayWrapper(
      function* outputGen() {
        for (const arg of result) yield [arg];
      },
      { debug: false },
    );
  }

  append(...values) {
    // restrict to rows where `func()` is truthy
    function* output(argslist) {
      for (const args of argslist) yield args;

      for (const arg of values) yield [arg];
    }

    return new ArrayWrapper(() => output(this.argslist));
  }

  // ///////////////////////////////////////////////////////////////////////////
  // TERMINAL METHODS
  // ///////////////////////////////////////////////////////////////////////////

  toArray() {
    return Array.from(this);
  }

  /*
  execute eagerly
   */
  materialize() {
    const list = this.raw();

    return new ArrayWrapper(
      function* outputGen() {
        for (const args of list) yield args;
      },
      { debug: false },
    );
  }

  /*
  return args list (for debugging)
   */
  raw() {
    return Array.from(this.argslist);
  }

  /*
  return an object from (value, key) pairs
   */
  fromPairs() {
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

  last(defaultValue = null) {
    // return last element, or defaultValue
    return coalesce(last(this), defaultValue);
  }

  /*
  return first not-missing value
   */
  coalesce() {
    return coalesce(...this);
  }

  count() {
    return count(this);
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

  /*
  return true if func(...args) returns true for some args
   */
  some(func) {
    for (const args of this.argslist) {
      if (func(...args)) {
        return true;
      }
    }

    return false;
  }

  /*
   return true if func(...args) returns true for every args
    */
  every(func) {
    for (const args of this.argslist) {
      if (!func(...args)) {
        return false;
      }
    }

    return true;
  }

  /*
  return true if value is in this list
   */
  includes(value) {
    for (const [arg] of this.argslist) {
      if (arg === value) {
        return true;
      }
    }

    return false;
  }

  /*
  return number of slots in this list
   */
  get length() {
    let count = 0;

    /* eslint-disable-next-line no-unused-vars */
    for (const _ of this.argslist) count += 1;

    return count;
  }

  /*
  return true if this list is empty
   */
  isEmpty() {
    /* eslint-disable-next-line no-unused-vars */
    for (const _ of this.argslist) return false;

    return true;
  }

  join(separator) {
    return Array.from(this).join(separator);
  }

  /*
  return first matching row
   */
  find(func) {
    return this.filter(func).first();
  }

  /*
  return index of first row where func returns true
  return null if not found
  */
  findIndex(func) {
    let i = 0;

    for (const args of this.argslist) {
      if (func(...args)) {
        return i;
      }

      i += 1;
    }

    return null;
  }

  index(column) {
    // Return an object indexed on `column`
    // We assume the key is unique
    const output = {};
    const selector = jx(column);

    for (const [row] of this.argslist) {
      const key = selector(row);

      if (!(key in output)) {
        output[key] = row;
      } else {
        Log.error('expecting index to be unique');
      }
    }

    return output;
  }
}

MANY_TYPES.push(ArrayWrapper);

function selectFrom(list, ...more) {
  if (list instanceof ArrayWrapper) {
    return list;
  }

  if (more.length) {
    return new ArrayWrapper(
      function* outputGen() {
        let i = 0;

        for (const v of list) {
          yield [v, ...more.map(getI(i))];
          i += 1;
        }
      },
      { debug: false },
    );
  }

  return new ArrayWrapper(
    function* outputGen() {
      for (const v of list) yield [v];
    },
    { debug: false },
  );
}

internalFrom = selectFrom;

/*
 * convert Object (or Data) into [value, key] pairs
 * notice the **value is first**
 */
function toPairs(obj) {
  if (missing(obj)) {
    return new ArrayWrapper(() => []);
  }

  if (obj instanceof Map) {
    return new ArrayWrapper(
      function* outputGen() {
        for (const [k, v] of obj.entries()) yield [v, k];
      },
      { debug: false },
    );
  }

  return new ArrayWrapper(
    function* outputGen() {
      for (const [k, v] of Object.entries(obj)) yield [v, k];
    },
    { debug: false },
  );
}

function* internalCombos(first, ...rest) {
  if (rest.length === 0) {
    for (const f of first) {
      yield [f];
    }
    return;
  }

  for (const f of first) {
    for (const [...r] of internalCombos(...rest)) {
      yield [f, ...r];
    }
  }
}

/*
 * return every combination, one from each array
 */
function combos(...many) {
  return new ArrayWrapper(
    function* outputGen() {
      for (const t of internalCombos(...many)) yield [t];
    },
    { debug: false },
  );
}

ArrayWrapper.prototype.all = ArrayWrapper.prototype.every;
ArrayWrapper.prototype.any = ArrayWrapper.prototype.some;

internalToPairs = toPairs;

/*
 * Convert Object into list of [value, path] pairs
 * where path is dot delimited path deep into object
 * formal===false will allow dots in property names to refer to path
 * formal===true will escape the dots, making them literal
 */
function leaves(obj, formal = true) {
  const field = formal ? literalField : k => k;

  function* leafGen(map, prefix) {
    for (const [val, key] of toPairs(map).argsGen()) {
      const path = concatField(prefix, field(key));

      if (isData(val)) {
        for (const pair of leafGen(val, path)) yield pair;
      } else {
        yield [val, path];
      }
    }
  }

  return new ArrayWrapper(() => leafGen(obj, '.'));
}

internalLeaves = leaves;

function length(list) {
  // return length of this list
  if (list instanceof ArrayWrapper) {
    return list.length;
  }

  return list.length;
}

function extendWrapper(methods) {
  // Add a chainable method to Wrapper
  internalToPairs(methods).forEach((method, name) => {
    // USE function(){} DECLARATION TO BIND this AT CALL TIME
    ArrayWrapper.prototype[name] = function anonymous(...args) {
      return internalFrom(method(this.toArray(), ...args));
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
    const lookup = internalFrom(listB)
      .groupBy(propB)
      .fromPairs();
    const getterA = jx(propA);

    return internalFrom(listA)
      .map((rowA) => {
        const b = lookup[getterA(rowA)];
        if (missing(b)) return [{ ...rowA }];
        return b.map(rowB => (
          { ...rowA, ...rowB }
        ));
      })
      .flatten();
  },

  reverse,
});

// ASSIGN USEFUL FUNCTIONS TO Data
Data.fromConfig = obj => internalLeaves(obj, false).fromLeaves();
Data.toPairs = toPairs;
Data.selectFrom = selectFrom;

export {
  selectFrom,
  toPairs,
  combos,
  leaves,
  first,
  last,
  length,
  ArrayWrapper,
  selector,
};
