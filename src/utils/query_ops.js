
import lodashGroupBy from 'lodash/groupBy';
import map from 'lodash/map';
import flatten from 'lodash/flatten';
import filter from 'lodash/filter';
import toPairs from 'lodash/toPairs';
import chunk from 'lodash/chunk';
import unzip from 'lodash/unzip';
import sortBy from 'lodash/sortBy';
import fromPairs from 'lodash/fromPairs';

class Wrapper {
  constructor(list) {
    this.list = list;
  }

  value() {
    return this.list;
  }
}


// Add a chainable method to Wrapper
const extend_wrapper = (methods) => {
  toPairs(methods).forEach(([name, method]) => {
    // USE function(){} DECLARATION TO BIND this AT CALL TIME
    Wrapper.prototype[name] = function anonymous(...args) {
      this.list = method(this.list, ...args);
      return this;
    };
  });
};


const frum = (list) => {
  return new Wrapper(list);
};


extend_wrapper({
  map: map,
  filter: filter,
  flatten: flatten,
  toPairs: toPairs,
  chunk: chunk,
  unzip: unzip,
  sortBy: sortBy,
  fromPairs: fromPairs,
  lodashGroupBy: lodashGroupBy,
});


const listwrap = (value) => {
  if (Array.isArray(value)) {
    return value;
  } if (value == null) {
    return [];
  }
    return [value];
};

// Groupby one, or many, columns by name
extend_wrapper({
  groupBy: function groupBy(list, columns) {
    const cs = frum(listwrap(columns))
      .map((col_name) => {
        if (typeof col_name === 'string') {
          return [[col_name, row => row[col_name]]];
        }
        return toPairs(col_name);
      })
      .flatten()
      .sortBy(([col_name]) => col_name)
      .value();

    const output = {};
    let i = 0;
    list.forEach((row) => {
      const key = fromPairs(cs.map(([name, func]) => [name, func(row)]));
      const skey = JSON.stringify(key);

      let pair = output[skey];
      if (!pair) {
        pair = [[], key, i];
        i += 1;
        output[skey] = pair;
      }
      pair[0].push(row);
    });
    return Object.values(output);
  },
});


// SELECT a.*, b.* FROM listA a LEFT JOIN listB b ON a.propA = b.propB
extend_wrapper({
  join: function join(listA, propA, listB, propB) {
    const lookup = frum(listB)
      .lodashGroupBy(rowB => rowB[propB])
      .value();

    return frum(listA)
      .map(rowA => lookup[rowA[propA]].map((rowB) => { return { ...rowB, ...rowA }; }))
      .flatten()
      .value();
  },
});

export { frum };
