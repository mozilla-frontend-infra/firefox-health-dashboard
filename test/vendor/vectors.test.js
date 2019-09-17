/* global describe, it */
import { selectFrom, leaves, toPairs } from '../../src/vendor/vectors';
import jx from '../../src/vendor/jx/expressions';

const data = [
  { a: 1 },
  { a: { b: 0, c: 1 }, d: 3 },
  { a: null, e: 3 },
  { d: 3 },
  null,
];

describe('vectors', () => {
  it('select Array', () => {
    expect(
      selectFrom(data)
        .select(['a', 'd'])
        .toArray(),
    ).toEqual([
      { a: 1, d: null },
      { a: { b: 0, c: 1 }, d: 3 },
      { a: null, d: null },
      { a: null, d: 3 },
      { a: null, d: null },
    ]);
  });

  it('select rename', () => {
    expect(
      selectFrom(data)
        .select({ x: 'a', y: 'd', z: 20 })
        .toArray(),
    ).toEqual([
      { x: 1, y: null, z: 20 },
      { x: { b: 0, c: 1 }, y: 3, z: 20 },
      { x: null, y: null, z: 20 },
      { x: null, y: 3, z: 20 },
      { x: null, y: null, z: 20 },
    ]);
  });

  it('select deep array', () => {
    expect(
      selectFrom(data)
        .select({ x: ['a', 'd'] })
        .toArray(),
    ).toEqual([
      { x: { a: 1, d: null } },
      { x: { a: { b: 0, c: 1 }, d: 3 } },
      { x: { a: null, d: null } },
      { x: { a: null, d: 3 } },
      { x: { a: null, d: null } },
    ]);
  });

  it('select value', () => {
    expect(
      selectFrom(data)
        .select('a')
        .toArray(),
    ).toEqual([1, { b: 0, c: 1 }, null, null, null]);
  });

  it('enumerate', () => {
    expect(
      selectFrom(data)
        .enumerate()
        .map((v, i) => i)
        .toArray(),
    ).toEqual([0, 1, 2, 3, 4]);
  });

  it('limit', () => {
    expect(
      selectFrom(data)
        .limit(2)
        .toArray(),
    ).toEqual([{ a: 1 }, { a: { b: 0, c: 1 }, d: 3 }]);
  });

  it('where', () => {
    expect(
      selectFrom(data)
        .where({ d: 3 })
        .toArray(),
    ).toEqual([{ a: { b: 0, c: 1 }, d: 3 }, { d: 3 }]);
  });

  it('missing', () => {
    expect(
      selectFrom(data)
        .missing('d')
        .toArray(),
    ).toEqual([{ a: 1 }, { a: null, e: 3 }, null]);
  });

  it('filter null', () => {
    expect(
      selectFrom([{ a: 1 }, null])
        .filter(() => null)
        .toArray(),
    ).toEqual([]);
  });

  it('filter true', () => {
    expect(
      selectFrom([{ a: 1 }, null])
        .filter(() => true)
        .toArray(),
    ).toEqual([{ a: 1 }, null]);
  });

  it('filter 0', () => {
    expect(
      selectFrom([{ a: 1 }, null])
        .filter(() => 0)
        .toArray(),
    ).toEqual([{ a: 1 }, null]);
  });


  it('groupBy 2', () => {
    expect(
      selectFrom(data)
        .groupBy(['d', 'e'])
        .map((v, g) => [v, g])
        .toArray(),
    ).toEqual([
      [[{ a: 1 }, null], { d: null, e: null }],
      [[{ a: { b: 0, c: 1 }, d: 3 }, { d: 3 }], { d: 3, e: null }],
      [[{ a: null, e: 3 }], { d: null, e: 3 }],
    ]);
  });

  it('groupBy lessThan function', () => {
    expect(
      selectFrom([
        { a: 0 },
        { a: 3 },
        { a: 10 },
        { a: 11 },
        { a: 7 },
        { a: 0.5 },
        {},
        { a: null },
      ])
        .groupBy(({ a }) => a < 5)
        .map((v, g) => [v, g])
        .toArray(),
    ).toEqual([
      [[{ a: 0 }, { a: 3 }, { a: 0.5 }, { a: null }], true],
      [[{ a: 10 }, { a: 11 }, { a: 7 }, {}], false],
    ]);
  });

  it('groupBy jx', () => {
    expect(
      selectFrom([
        { a: 0 },
        { a: 3 },
        { a: 10 },
        { a: 11 },
        { a: 7 },
        { a: 0.5 },
        {},
        { a: null },
      ])
        .groupBy(jx({ lt: { a: 5 } }))
        .map((v, g) => [v, g])
        .toArray(),
    ).toEqual([
      [[{ a: 0 }, { a: 3 }, { a: 0.5 }], true],
      [[{ a: 10 }, { a: 11 }, { a: 7 }, {}, { a: null }], false],
    ]);
  });

  it('index ok', () => {
    expect(
      selectFrom(data)
        .exists('a')
        .index('d'),
    ).toEqual({
      3: { a: { b: 0, c: 1 }, d: 3 },
      null: { a: 1 },
    });
  });

  it('index error', () => {
    expect(() => selectFrom(data).index('d')).toThrow();
  });

  it('leaves', () => {
    expect(leaves({ a: { b: 0, c: 1 }, d: 3 }).fromPairs()).toEqual({
      'a.b': 0,
      'a.c': 1,
      d: 3,
    });
  });

  it('toPairs', () => {
    expect(toPairs({}).length).toEqual(0);
    expect(toPairs({}).exists().length).toEqual(0);
  });

  it('reverse', () => {
    const a = selectFrom([1, 2, 3]);

    expect(a.reverse().toArray()).toEqual([3, 2, 1]);
    expect(a.toArray()).toEqual([1, 2, 3]);
  });

  it('select flatten', () => {
    const a = selectFrom([
      { a: [] },
      { a: [1] },
      { a: [2, 3] },
      { a: null },
      {},
    ]);

    expect(
      a
        .select('a')
        .flatten()
        .toArray(),
    ).toEqual([1, 2, 3]);
  });
});
