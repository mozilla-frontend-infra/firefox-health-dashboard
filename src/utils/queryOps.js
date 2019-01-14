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

}

const toPairs = (obj) => {
  return new Wrapper(lodashToPairs(obj));
};

const frum = (list) => {
  return new Wrapper(list);
};


// Add a chainable method to Wrapper
const extend_wrapper = (methods) => {
  lodashToPairs(methods).forEach(([name, method]) => {
    // USE function(){} DECLARATION TO BIND this AT CALL TIME
    Wrapper.prototype[name] = function anonymous(...args) {
      this.list = method(this.list, ...args);
      return this;
    };
  });
};


// Add Lodash functions
extend_wrapper({
  map: map,
  lodashFilter: lodashFilter,
  flatten: flatten,
  toPairs: lodashToPairs,
  chunk: chunk,
  unzip: unzip,
  sortBy: sortBy,
  lodashGroupBy: lodashGroupBy,
  limit: lodashTake,
});


const toArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  } if (value == null) {
    return [];
  }
    return [value];
};

// convert string into function that selects column from row
const selector = (column_name) => {
  if (typeof column_name === 'string') {
    return row => row[column_name];
  }
    return column_name;

};


extend_wrapper({
  // Groupby one, or many, columns by name or by {name: selector} pairs
  // return array of [rows, key, index] tuples
  groupBy: function groupBy(list, columns) {
    const cs = frum(toArray(columns))
      .map((col_name) => {
        if (typeof col_name === 'string') {
          return [[col_name, selector(col_name)]];
        }
        return lodashToPairs(col_name).map(([name, value]) => [name, selector(value)]);
      })
      .flatten()
      .sortBy(([col_name]) => col_name)
      .toArray();

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
  },

  // SELECT a.*, b.* FROM listA a LEFT JOIN listB b on b[propB]=a[propA]
  join: function join(listA, propA, listB, propB) {
    const lookup = frum(listB)
      .lodashGroupBy(rowB => rowB[propB])
      .toArray();

    return frum(listA)
      .map(rowA => lookup[rowA[propA]].map((rowB) => { return { ...rowB, ...rowA }; }))
      .flatten()
      .toArray();
  },

  // Expecting a object of {column_name: value} form to use as a filter
  // return only matching rows
  filter: function filter(list, expression) {
    const func = (row) => {
      for (const [name, value] of lodashToPairs(expression)) {
        if (row[name] !== value) return false;
      }
      return true;
    };

    return lodashFilter(list, func);
  },


});

export { frum, toPairs };
