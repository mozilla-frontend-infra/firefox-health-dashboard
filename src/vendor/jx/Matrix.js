/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */

import { array, missing, exists } from '../utils';
import { Log } from '../logs';

/*
return an array of arrays
dims - an array of integers; number of part along each dimension
zero - a function the will be used to create an element in the multiarray
 */
function newMultiArray(dims, zero) {
  if (dims.length === 0) {
    return zero();
  }

  const length = dims[0];
  const rest = dims.slice(1);

  return array(length).map(() => newMultiArray(rest, zero));
}

/*
A multidimensional array

elements are accessed via integer arrays, called coordinates.
dims - array of integers to indicate dimensionality
data - optional data to fill the matrix with
zero - function to generate initial value
 */
class Matrix {
  constructor({ dims, data, zero = array }) {
    this.dims = dims;
    this.data = data !== undefined ? data : newMultiArray(dims, zero);
    this.zero = zero;
  }

  /*
  assume elements are arrays, add value to that element
   */
  add(coord, value) {
    const rows = this.get(coord).value;

    if (this.zero === array) {
      rows.push(value);
    } else if (exists(rows)) {
      Log.error('duplicate value at {{coord}}', { coord });
    }
  }

  /*
  get value for element at given coordinates
  missing coordinates will return all of dimension
  returns Matrix
   */
  get(coord) {
    function _iter(coord, data) {
      if (coord.length === 0) {
        return data;
      }

      const c = coord[0];

      if (missing(c)) {
        return data.map(sub => _iter(coord.slice(1), sub));
      }

      return _iter(coord.slice(1), data[c]);
    }

    const newDims = this.dims.filter((c, i) => missing(coord[i]));

    return new Matrix({ dims: newDims, data: _iter(coord, this.data) });
  }

  /*
  set value of element at given coordinates
   */
  set(coord, value) {
    function _iter(coord, data) {
      const c = coord[0];

      if (coord.length === 1) {
        // eslint-disable-next-line no-param-reassign
        data[c] = value;
      } else {
        const sub = data[c];

        return _iter(coord.slice(1), sub);
      }
    }

    return _iter(coord, this.data);
  }

  get value() {
    if (this.dims.length > 0) {
      Log.error('this matrix still has {{num}} dimensions', {
        num: this.dims.length,
      });
    }

    return this.data;
  }

  /*
  insert a new port along a single edge, expanding the cube
  and inserting zero()s everywhere.
  insert at `position` along `dimension`
   */
  insertPart(dimension, position) {
    const subDims = this.dims.slice(dimension + 1);
    const _insert = (dim, data) => {
      if (dim === 0) {
        data.splice(position, 0, newMultiArray(subDims, this.zero));
      } else {
        data.forEach((d) => {
          _insert(dim - 1, d);
        });
      }
    };

    _insert(dimension, this.data);
  }

  /*
  Emit new matrix with each coordinate reordered
   */
  reorder(dims, ordering) {
    const output = new Matrix({ dims, zero: () => null });

    for (const [v, coord] of this) {
      const n = coord.map((c, i) => ordering[i][c]);

      if (n.every(n => exists(n))) {
        output.set(n, v);
      }
    }

    return output;
  }

  /*
  return a generator of [value, coordinate] pairs
   */
  * [Symbol.iterator]() {
    function* _iter(depth, data) {
      if (depth === 1) {
        let i = 0;

        for (const v of data) {
          yield [v, [i]];
          i += 1;
        }
      } else {
        let i = 0;

        for (const d of data) {
          for (const [v, c] of _iter(depth - 1, d)) yield [v, [i, ...c]];
          i += 1;
        }
      }
    }

    for (const v of _iter(this.dims.length, this.data)) yield v;
  }
}

export default Matrix;
