/* global describe, it */
import { Data } from '../../src/vendor/datas';
import { toPairs } from '../../src/vendor/vectors';

// eslint-disable-next-line no-unused-vars
const _ = toPairs; // `datas` does not work without `vectors`
const data = { a: { b: { c: { d: 42 } } } };
const dataArray = {
  a: { b: [{ c: 1 }, { c: 2 }, { c: 3 }, { c: 4 }, { c: null }] },
};

describe('Data', () => {
  it('zip', () => {
    expect(Data.zip([['a', 3], ['b', 4]])).toEqual({ a: 3, b: 4 });
  });

  it('copy', () => {
    expect(Data.copy({ a: 3, b: 4, c: null })).toEqual({ a: 3, b: 4 });
  });

  it('setDefault', () => {
    expect(
      Data.setDefault(
        { a: 3, b: { c: 5 }, c: null },
        { a: null, c: null },
        { b: { d: 0 }, c: 7 },
      ),
    ).toEqual({ a: 3, b: { c: 5, d: 0 }, c: 7 });
  });

  it('get', () => {
    expect(Data.get(data, '.')).toEqual({ a: { b: { c: { d: 42 } } } });
    expect(Data.get(data, 'a')).toEqual({ b: { c: { d: 42 } } });
    expect(Data.get(data, 'a.b')).toEqual({ c: { d: 42 } });
    expect(Data.get(data, 'a.b.c')).toEqual({ d: 42 });
    expect(Data.get(data, 'a.b.c.d')).toEqual(42);

    expect(Data.get(dataArray, 'a.b.c')).toEqual([1, 2, 3, 4, null]);
    expect(Data.get(dataArray, 'a.b.c.2')).toEqual(3);
  });

  it('set error', () => {
    expect(() => Data.set(null, 'a.b.c', 42)).toThrow();
  });

  it('set ok', () => {
    expect(Data.set({}, 'a.b.c', 42)).toEqual({ a: { b: { c: 42 } } });
  });

  /*
  below tests snagged from
  https://github.com/jonschlinkert/set-value/blob/df46cc6b7bb0983b124f958b1a838bc1dcddf338/test.js
  */
  it('should return non-objects', () => {
    expect(() => {
      Data.set('foo', 'a.b', 'c');
    }).toThrow();
    expect(() => {
      Data.set(null, 'a.b', 'c');
    }).toThrow();
  });

  it('should create a nested property if it does not already exist', () => {
    expect(Data.set({}, 'a.b', 'c')).toEqual({ a: { b: 'c' } });
  });

  it('should merge an existing value with the given value', () => {
    const o = { a: { b: { c: 'd' } } };

    Data.setDefault(Data.get(o, 'a.b'), { y: 'z' });
    expect(o).toEqual({ a: { b: { c: 'd', y: 'z' } } });
  });

  it('should update an object value', () => {
    const o = {};

    Data.set(o, 'a', { b: 'c' });
    Data.set(o, 'a', { c: 'd' });
    expect(o).toEqual({ a: { c: 'd' } });
    Data.set(o, 'a', 'b');
    expect(o).toEqual({ a: 'b' });
  });

  it('should extend an array', () => {
    const o = { a: [] };

    Data.set(o, 'a.0', { y: 'z' });
    expect(o).toEqual({ a: [{ y: 'z' }] });
  });

  it('should extend a function', () => {
    function log() {}
    const warning = () => {};
    const o = {};

    Data.set(o, 'helpers.foo', log);
    Data.set(o, 'helpers.foo.warning', warning);
    expect(typeof o.helpers.foo).toEqual('function');
    expect(typeof o.helpers.foo.warning).toEqual('function');
  });

  it('should extend an object in an array', () => {
    const o = { a: [{}, {}, {}] };

    Data.set(o, 'a.0.a', { y: 'z' });
    Data.set(o, 'a.1.b', { y: 'z' });
    Data.set(o, 'a.2.c', { y: 'z' });
    expect(o).toEqual({
      a: [{ a: { y: 'z' } }, { b: { y: 'z' } }, { c: { y: 'z' } }],
    });
  });

  it('should create a deeply nested property if it does not already exist', () => {
    const o = {};

    Data.set(o, 'a.b.c.d.e', 'c');
    expect(o).toEqual({ a: { b: { c: { d: { e: 'c' } } } } });
  });

  it('should not create a nested property if it does already exist', () => {
    const o = { a: { name: 'Halle' } };

    Data.set(o, 'a.b', 'c');
    expect(o).toEqual({ a: { name: 'Halle', b: 'c' } });
  });

  it('should support immediate properties', () => {
    const o = {};

    Data.set(o, 'a', 'b');
    expect(o).toEqual({ a: 'b' });
  });

  it('should use property paths to set nested values from the source object.', () => {
    const o = {};

    Data.set(o, 'a.locals.name', { first: 'Brian' });
    Data.set(o, 'b.locals.name', { last: 'Woodward' });
    Data.set(o, 'b.locals.name.last', 'Woodward');
    expect(o).toEqual({
      a: { locals: { name: { first: 'Brian' } } },
      b: { locals: { name: { last: 'Woodward' } } },
    });
  });

  it('should add the property even if a value is not defined', () => {
    const o = {};

    expect(Data.set(o, 'a.locals.name')).toEqual({
      a: { locals: { name: undefined } },
    });
    expect(Data.set(o, 'b.locals.name')).toEqual({
      b: { locals: { name: undefined } },
      a: { locals: { name: undefined } },
    });
  });

  it('should set the specified property.', () => {
    expect(Data.set({ a: 'aaa', b: 'b' }, 'a', 'bbb')).toEqual({
      a: 'bbb',
      b: 'b',
    });
  });

  it('should support passing an array as the key', () => {
    const actual = Data.set({ a: 'a', b: { c: 'd' } }, ['b', 'c', 'd'], 'eee');

    expect(actual).toEqual({ a: 'a', b: { c: { d: 'eee' } } });
  });

  it('should set a deeply nested value.', () => {
    const actual = Data.set({ a: 'a', b: { c: 'd' } }, 'b.c.d', 'eee');

    expect(actual).toEqual({ a: 'a', b: { c: { d: 'eee' } } });
  });

  it('should return the entire object if no property is passed.', () => {
    expect(() => {
      Data.set({ a: 'a', b: { c: 'd' } });
    }).toThrow();
  });

  it('should set a value only.', () => {
    expect(Data.set({ a: 'a', b: { c: 'd' } }, 'b.c')).toEqual({
      a: 'a',
      b: { c: undefined },
    });
  });

  it('should not split escaped dots', () => {
    const o = {};

    Data.set(o, 'a\\.b.c.d.e', 'c');
    expect(o).toEqual({ 'a.b': { c: { d: { e: 'c' } } } });
  });

  it('should work with multiple escaped dots', () => {
    const o1 = {};

    Data.set(o1, 'e\\.f\\.g', 1);
    expect(o1).toEqual({ 'e.f.g': 1 });

    const o2 = {};

    Data.set(o2, 'e\\.f.g\\.h\\.i.j', 1, { escape: true });
    expect(o2).toEqual({ 'e.f': { 'g.h.i': { j: 1 } } });
  });

  /*
  above tests snagged from
  https://github.com/jonschlinkert/set-value/blob/df46cc6b7bb0983b124f958b1a838bc1dcddf338/test.js
  */
});
