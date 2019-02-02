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


const first = (list) => {
  if (list.length === 0) return null;
  return list[0];
};

const last = (list) => {
  if (list.length === 0) return null;
  return list[list.length - 1];
};


const toArray = (value) => {
  // return a list
  if (Array.isArray(value)) {
    return value;
  } if (value == null) {
    return [];
  }
    return [value];
};

const selector = (column_name) => {
  // convert string into function that selects column from row
  if (typeof column_name === 'string') {
    return row => row[column_name];
  } return column_name;
};


class Wrapper {
  constructor(list) {
    this.list = list;
  }

  // ///////////////////////////////////////////////////////////////////////////
  // TERMINAL METHODS
  // ///////////////////////////////////////////////////////////////////////////

  toArray() {
    return this.list;
  }

  fromPairs() {
    // return an object from (value, key) pairs
    const output = {};
    for (const [v, k] of this.args) {
      output[k] = v;
    }
    return output;
  }

  first() {
    // return first element
    return first(this.list);
  }

  last() {
    // return last element
    return last(this.list);
  }

  index(column) {
    // Return an object indexed on `column`
    // We assume the key is unique
    const output = {};
    this.list.forEach((row) => {
      const key = row[column];
      const value = output[key];
      if (value === undefined) {
        output[key] = row;
      } else {
        throw new Error('expecting index to be unique');
      }
    });
    return output;
  }

  * [Symbol.iterator]() {
    for (const v of this.list) {
      yield v;
    }
  }

}

const toPairs = (obj) => {
  return new Wrapper(lodashToPairs(obj));
};

const frum = (list) => {
  if (list instanceof Wrapper) {
    return list;
  } if (Array.isArray(list)) {
    return new Wrapper(list);
  }
    return new Wrapper(Array.from(list));

};


// Add a chainable method to Wrapper
const extend_wrapper = (methods) => {
  lodashToPairs(methods).forEach(([name, method]) => {
    // USE function(){} DECLARATION TO BIND this AT CALL TIME
    Wrapper.prototype[name] = function anonymous(...args) {
      return frum(method(this.list, ...args));
    };
  });
};


// Add Lodash functions
extend_wrapper({
  map: map,
  filter: lodashFilter,
  flatten: flatten,
  toPairs: lodashToPairs,
  chunk: chunk,
  unzip: unzip,
  zip: unzip,
  sortBy: sortBy,
  sort: sortBy,
  limit: lodashTake,
});


extend_wrapper({
  groupBy: function groupBy(list, columns) {
    // Groupby one, or many, columns by name or by {name: selector} pairs
    // return array of [rows, key, index] tuples

    if (Array.isArray(columns)) {
      const cs = frum(columns)
        .map((col_name) => {
          if (typeof col_name === 'string') {
            return [[col_name, selector(col_name)]];
          }
          return lodashToPairs(col_name).map(([name, value]) => [name, selector(value)]);
        })
        .flatten()
        .sortBy(([col_name]) => col_name);

      const output = {};
      let i = 0;
      list.forEach((row) => {
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

    }
      // single-column groupby is faster
      const func = selector(columns);
      const output = {};
      let i = 0;
      for (const row of list) {
        const key = func(row);

        let triple = output[key];
        if (!triple) {
          triple = [[], key, i];
          i += 1;
          output[key] = triple;
        }
        triple[0].push(row);
      }
      return Object.values(output);

  },

  // SELECT a.*, b.* FROM listA a LEFT JOIN listB b on b[propB]=a[propA]
  join: function join(listA, propA, listB, propB) {
    const lookup = lodashGroupBy(listB, rowB => rowB[propB]);

    return frum(listA)
      .map(rowA => lookup[rowA[propA]].map((rowB) => { return { ...rowB, ...rowA }; }))
      .flatten();
  },

  where: function where(list, expression) {
  // Expecting a object of {column_name: value} form to use as a filter
  // return only matching rows
    const func = (row) => {
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
      func = (row) => {
        for (const name of cols) {
          const v = row[name];
          if (v == null || Number.isNaN(v)) return false;
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

export { frum, toPairs, first, last };
