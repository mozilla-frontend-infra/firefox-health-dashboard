/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/* eslint-disable no-use-before-define */

import {
  array, exists, isString, missing, toArray, zip,
} from '../utils';
import { ArrayWrapper, selectFrom, toPairs } from '../vectors';
import { Log } from '../logs';
import { NULL } from './domains';
import Matrix from './Matrix';
import Edge from './Edge';

const DEBUG = false;
const UNLIKELY_PROPERTY_NAME = '*';
const subtractEdges = (a, b) => a.filter(v => b.every(w => w.name !== v.name));

function getEdgeByName(cubes, edgeName) {
  if (DEBUG && !(cubes instanceof ArrayWrapper)) {
    Log.error('expecting ArrayWrapper for cubes');
  }

  return cubes
    .map(({ edges }) => {
      if (missing(edges.find)) {
        Log.error('not expected');
      }

      return edges.find(e => e.name === edgeName);
    })
    .coalesce();
}

/*
 * Matrix with named edge access
 * elements are accessed via Objects, called combinations
 * https://blog.acolyer.org/2019/06/28/machine-learning-systems-are-stuck-in-a-rut/
 */
class Cube {
  constructor(edges, matrix) {
    this.edges = edges;
    this.matrix = matrix;
  }

  getValue() {
    return this.matrix.value;
  }

  /*
   * Expecting combination object with {edge: value} pairs
   * return a (reduced dimension) cube
   */
  where(combination) {
    const coords = this.edges.map((e) => {
      const value = combination[e.name];

      if (missing(value)) {
        return null;
      }

      return e.domain.valueToIndex(value);
    });

    return new Cube(
      this.edges.filter(e => missing(combination[e.name])),
      this.matrix.get(coords),
    );
  }

  /*
   * pick one edge which you can perform more chained vector operations
   * function argument will be a cube of lesser dimension
   */
  along(edge, options = {}) {
    const { nulls = false } = options;
    const self = this;
    const cubes = new ArrayWrapper(function* output() {
      yield [self, UNLIKELY_PROPERTY_NAME];
    });

    return new ArrayWrapper(function* output() {
      for (const [cs, coord] of sequence(
        cubes,
        toArray(getEdgeByName(cubes, edge)),
        {
          nulls,
        },
      )) {
        const self = cs[UNLIKELY_PROPERTY_NAME];

        Object.entries(cs).forEach(([k, v]) => {
          if (k !== UNLIKELY_PROPERTY_NAME) {
            self[k] = v;
          }
        });
        yield [self, coord];
      }
    });
  }
}

/*
zero - constant or function to fill cube with
 */
Cube.newInstance = ({ edges, zero }) => {
  const normalizedEdges = toArray(edges).map(Edge.newInstance);

  return new Cube(
    normalizedEdges,
    new Matrix({
      dims: normalizedEdges.map(e => e.domain.partitions.length),
      zero,
    }),
  );
};

/*
Represent some number of cubes in a bundle so we can treat them
as a single hypercube
 */
class HyperCube {
  constructor(values) {
    this._values = toPairs(values);
    Object.entries(values).forEach(([key, value]) => {
      this[key] = value;
    });
  }

  /*
   * Expecting combination object with {edge: value} pairs
   * return a (reduced dimension) cube
   */
  where(combination) {
    const selections = toPairs(combination)
      .map((value, edgeName) => getEdgeByName(this._values, edgeName).domain.partitions.findIndex(
        p => p.value === value,
      ))
      .fromPairs();
    const values = this._values
      .map(
        ({ edges, matrix }) => new Cube(
          edges.filter(e => missing(combination[e.name])),
          matrix.get(edges.map(e => selections[e.name])),
        ),
      )
      .fromPairs();

    return new HyperCube(values);
  }

  /*
   * pick one edge which you can perform more chained vector operations
   * function argument will be data to cubes of lesser dimension
   */
  along(edge, options = {}) {
    const { nulls = false } = options;
    const values = this._values;
    const edges = toArray(getEdgeByName(values, edge));

    return new ArrayWrapper(function* output() {
      for (const [cs, coord] of sequence(values, edges, { nulls })) {
        yield [new HyperCube(cs), coord];
      }
    });
  }
}

/*
 * Ensure `cube` conforms to edges in `cubes`
 */
function align(cubes, cube) {
  if (DEBUG && !(cubes instanceof ArrayWrapper)) {
    Log.error('expecting ArrayWrapper for cubes');
  }

  // VERIFY EDGES ARE IDENTICAL
  let different = false;
  const [newEdges, ordering, dims] = selectFrom(cube.edges)
    .map((foreignEdge) => {
      const foreignParts = foreignEdge.domain.partitions;
      const selfEdge = getEdgeByName(cubes, foreignEdge.name);

      if (missing(selfEdge) || selfEdge === foreignEdge) {
        return [
          foreignEdge,
          foreignParts.map((v, i) => i),
          foreignParts.length,
        ];
      }

      const selfParts = selfEdge.domain.partitions;
      // MAP foreignEdge PARTS TO selfEdge parts
      const nameToIndex = selectFrom(selfParts)
        .enumerate()
        .map((p, i) => [i, p.value])
        .args()
        .fromPairs();
      const newPart = selectFrom(foreignParts)
        .select('value')
        .filter(p => missing(nameToIndex[p]))
        .toArray();
      const mapping = foreignParts.map(p => nameToIndex[p.value]);

      if (newPart.length > 0) {
        different = true;

        if (DEBUG) {
          Log.warning(
            'right edge {{name|quote}} has more parts ({{newPart|json}}) than the left',
            {
              newPart,
              name: foreignEdge.name,
            },
          );
        }
      }

      if (mapping.some((v, i) => v !== i)) {
        different = true;
      }

      return [selfEdge, mapping, selfParts.length];
    })
    .zip()
    .toArray();

  if (different) {
    return new Cube(newEdges, cube.matrix.reorder(dims, ordering));
  }

  return cube;
}

/*
 * return a generator over all parts of all given edges
 * generator returns [cube, coord] pairs
 */
function sequence(cubes, requestedEdges, options = {}) {
  if (DEBUG && !(cubes instanceof ArrayWrapper)) {
    Log.error('expecting ArrayWrapper for cubes');
  }

  const { nulls = true } = options;

  if (requestedEdges.some(isString)) {
    Log.error('sequence() requires edge objects');
  }

  // MAP FROM name TO (requested dimension TO matrix dimension)
  const maps = cubes
    .map(({ edges }) => requestedEdges
      .map(e => edges.findIndex(f => f.name === e.name))
      .map(i => (i === -1 ? null : i)))
    .fromPairs();
  // MAP FROM name TO NOT-REQUESTED EDGES
  const residue = cubes
    .map(({ edges }) => subtractEdges(edges, requestedEdges))
    .fromPairs();
  const coord = array(requestedEdges.length);

  function* _sequence(depth, edges, result) {
    if (edges.length === 0) {
      const output = result;

      cubes.forEach(({ matrix }, name) => {
        const selfCoord = array(matrix.dims.length);
        const map = maps[name];

        coord.forEach((c, i) => {
          const d = map[i];

          if (exists(d)) {
            selfCoord[d] = c;
          }
        });
        output[name] = new Cube(residue[name], matrix.get(selfCoord));
      });
      yield [output, coord.slice()];

      return;
    }

    const first = edges[0];
    const rest = edges.slice(1);
    let i = 0;

    for (const p of first.domain.partitions) {
      if (!nulls && p === NULL) {
        // eslint-disable-next-line no-continue
        continue;
      }

      coord[depth] = i;

      for (const s of _sequence(depth + 1, rest, {
        ...result,
        [first.name]: new Cube([], new Matrix({ dims: [], data: p.value })),
      })) {
        yield s;
      }

      i += 1;
    }
  }

  // map from given edges to each name's edges
  return _sequence(0, requestedEdges, {});
}

/*
 * group by `edges`, then for each group
 * run `value(row, coord, rows)` over all edge combinations
 * `along` is the edge to sort by. If used, then `coord` and `rows` will be available.
 * `row` is an object with properties from `cube` and from `edges`, pointing to cubes and combos respectfully
 */
function window(cubes, { value, edges: edgeNames, along }) {
  const flat = toPairs(cubes);
  const alignedCubes = flat
    .exists()
    .enumerate()
    .map((cube, name, i) => {
      if (i === 0) {
        return cube;
      }

      return align(flat.limit(i), cube);
    })
    .materialize();
  const innerNames = toArray(along);

  if (innerNames.length > 1) {
    Log.error('can only handle zero/one dimension');
  }

  const outerEdges = toArray(edgeNames)
    .map(n => getEdgeByName(alignedCubes, n))
    .filter(exists);
  const innerEdges = innerNames
    .map(n => getEdgeByName(alignedCubes, n))
    .filter(exists);
  const outerDims = outerEdges
    .map(e => e.domain.partitions.length)
    .filter(exists);
  const innerDims = innerEdges
    .map(e => e.domain.partitions.length)
    .filter(exists);
  const outerMatrix = new Matrix({
    dims: outerDims,
    zero: () => null,
  });

  for (const [outerRow, outerCoord] of sequence(alignedCubes, outerEdges)) {
    // WE PEAL BACK ALL THE WRAPPING FOR THE value() FUNCTION TO OPERATE ON
    if (innerNames.length === 0) {
      const v = value(
        toPairs(outerRow)
          .map(d => d.matrix.data)
          .fromLeaves(),
      );

      outerMatrix.set(outerCoord, v);
    } else {
      const innerMatrix = new Matrix({
        dims: innerDims,
        zero: () => null,
      });

      for (const [innerRow, innerCoord] of sequence(
        toPairs(outerRow),
        innerEdges,
      )) {
        const v = value(
          toPairs(innerRow)
            .map(d => d.matrix.data)
            .fromLeaves(),
          innerCoord[0],
          innerMatrix.data,
        );

        innerMatrix.set(innerCoord, v);
      }

      outerMatrix.set(outerCoord, innerMatrix.data);
    }
  }

  return new Cube(
    outerEdges.concat(innerEdges),
    new Matrix({
      dims: outerDims.concat(innerDims),
      data: outerMatrix.data,
    }),
  );
}

/*
Groupby, but with all combinations of all columns grouped.
The result is s a cube of lists, where the lists are elements from `self`
edges.value is used to determine what part of each edge a record belongs
For 2 dimensions this is a pivot table, for more dimensions it is a "cube".
Google "sql group by cube" for more information
 */
ArrayWrapper.edges = (self, edges, zero = array) => {
  const normalizedEdges = edges.map(Edge.newInstance);
  const dims = normalizedEdges.map(e => e.domain.partitions.length);
  const matrix = new Matrix({ dims, zero });

  self.forEach((row) => {
    const coord = normalizedEdges.map(e => e.domain.valueToIndex(e.value(row)));

    zip(dims, normalizedEdges).forEach(([d, e], i) => {
      if (e.domain.type === 'value' && d < e.domain.partitions.length) {
        // last element of value domain is NULL, ensure it is still last
        matrix.insertPart(i, d - 1);
        dims[i] = d + 1;
      }
    });

    matrix.add(coord, row);
  });

  normalizedEdges.forEach(e => e.domain.lock());

  return new Cube(normalizedEdges, matrix);
};

export { Cube, HyperCube, window };
