/* eslint-disable no-restricted-syntax */
import lodashGroupBy from 'lodash/groupBy';
import map from 'lodash/map';
import flatten from 'lodash/flatten';
import lodashFilter from 'lodash/filter';
import lodashToPairs from 'lodash/toPairs';
import chunk from 'lodash/chunk';
import unzip from 'lodash/unzip';
import sortBy from 'lodash/sortBy';
import lodashTake from 'lodash/take';
import lodashFromPairs from 'lodash/fromPairs';

const last = list => {
  if (list.length === 0) return null;

  return list[list.length - 1];
};

const first = list => {
  if (list.length === 0) return null;

  return list[0];
};

const index = (list, column) => {
  // Return object indexed on column
  // We assume the key is unique
  const output = {};

  list.forEach(row => {
    const key = row[column];
    const value = output[key];

    if (value === undefined) {
      // TODO: simplify
      output[key] = row;
    } else {
      throw new Error('expecting index to be unique');
    }
  });

  return output;
};

class Wrapper {
  constructor(list) {
    this.list = list;
  }

  toArray() {
    return this.list;
  }

  fromPairs() {
    return lodashFromPairs(this.list);
  }

  last() {
    return last(this.list);
  }

  first() {
    return first(this.list);
  }

  index(column) {
    // Return object indexed on column
    // We assume the key is unique
    const output = {};

    this.list.forEach(row => {
      const key = row[column];
      const value = output[key];

      if (value === undefined) {
        // TODO: simplify
        output[key] = row;
      } else {
        throw new Error('expecting index to be unique');
      }
    });

    return output;
  }
}

const toPairs = obj => new Wrapper(lodashToPairs(obj));
const frum = list => new Wrapper(list);
// Add a chainable method to Wrapper
const extendWrapper = methods => {
  lodashToPairs(methods).forEach(([name, method]) => {
    // USE function(){} DECLARATION TO BIND this AT CALL TIME
    Wrapper.prototype[name] = function anonymous(...args) {
      this.list = method(this.list, ...args);

      return this;
    };
  });
};

// Add Lodash functions
extendWrapper({
  map,
  filter: lodashFilter,
  flatten,
  toPairs: lodashToPairs,
  chunk,
  unzip,
  zip: unzip,
  sortBy,
  sort: sortBy,
  lodashGroupBy,
  limit: lodashTake,
});

const toArray = value => {
  if (Array.isArray(value)) {
    return value;
  }

  if (value == null) {
    return [];
  }

  return [value];
};

// convert string into function that selects column from row
const selector = columnName => {
  if (typeof columnName === 'string') {
    return row => row[columnName];
  }

  return columnName;
};

extendWrapper({
  groupBy: function groupBy(list, columns) {
    // Groupby one, or many, columns by name or by {name: selector} pairs
    // return array of [rows, key, index] tuples

    const cs = frum(toArray(columns))
      .map(colName => {
        if (typeof colName === 'string') {
          return [[colName, selector(colName)]];
        }

        return lodashToPairs(colName).map(([name, value]) => [
          name,
          selector(value),
        ]);
      })
      .flatten()
      .sortBy(([colName]) => colName)
      .toArray();
    const output = {};
    let i = 0;

    list.forEach(row => {
      const key = lodashFromPairs(cs.map(([name, func]) => [name, func(row)]));
      const skey = JSON.stringify(key);
      let triple = output[skey];

      if (!triple) {
        triple = [[], key, i];
        i += 1;
        output[skey] = triple;
      }

      triple[0].push(row);
    });

    return Object.values(output);
  },

  // SELECT a.*, b.* FROM listA a LEFT JOIN listB b on b[propB]=a[propA]
  join: function join(listA, propA, listB, propB) {
    const lookup = frum(listB)
      .lodashGroupBy(rowB => rowB[propB])
      .toArray();

    return frum(listA)
      .map(rowA => lookup[rowA[propA]].map(rowB => ({ ...rowB, ...rowA })))
      .flatten()
      .toArray();
  },

  where: function where(list, expression) {
    // Expecting a object of {columnName: value} form to use as a filter
    // return only matching rows
    const func = row => {
      for (const [name, value] of lodashToPairs(expression)) {
        if (row[name] !== value) return false;
      }

      return true;
    };

    return lodashFilter(list, func);
  },

  exists: function exists(list, columns = null) {
    // Expect a list of column names that must exist
    let func = null;

    if (columns == null) {
      func = row => row != null;
    } else {
      const cols = toArray(columns);

      func = row => {
        for (const name of cols) {
          const v = row[name];

          if (v == null || Number.isNaN(v)) return false; // TODO: simplify
        }

        return true;
      };
    }

    return lodashFilter(list, func);
  },

  append: function append(list, value) {
    return [...list, value];
  },

  reverse: function reverse(list) {
    return list.reverse();
  },
});

export { frum, toPairs, first, last, index };
