/* global describe, it */
import Data from '../../src/vendor/Data';


const data = {a: {b: {c:{ d: 42}}}};

const dataArray = {a: {b: [{c: 1}, {c:2}, {c:3}, {c:4}, {c:null}]}};


describe('Data', () => {
  it('new error', () => {
    expect(() => Data(null, 3)).toThrow();
  });

  it('new ok', () => {
    expect(Data("a", 3)).toEqual({a: 3});
  });

  it('zip', () => {
    expect(Data.zip([["a", 3], ["b", 4]])).toEqual({a: 3, b:4});
  });

  it('copy', () => {
    expect(Data.copy({a: 3, b: 4, c: null})).toEqual({a: 3, b:4});
  });


  it('setDefault', () => {
    expect(Data.setDefault(
      {a: 3, b: {c: 5}, c: null},
      {a: null, c: null},
      {b: {d: 0}, c: 7},
      )
    ).toEqual({a: 3, b: {c: 5, d: 0}, c: 7});
  })
  ;


  it('get', () => {
    expect(Data.get(data, ".")).toEqual({a: {b: {c: {d: 42}}}});
    expect(Data.get(data, "a")).toEqual({b: {c: {d: 42}}});
    expect(Data.get(data, "a.b")).toEqual({c: {d: 42}});
    expect(Data.get(data, "a.b.c")).toEqual({d: 42});
    expect(Data.get(data, "a.b.c.d")).toEqual(42);

    expect(Data.get(dataArray, "a.b.c")).toEqual([1, 2, 3, 4, null]);
    expect(Data.get(dataArray, "a.b.c.2")).toEqual(3);

  });


  it('set error', () => {
    expect(() => Data.set(null, "a.b.c", 42)).toThrow();
  });

  it('set ok', () => {
    expect(Data.set({}, "a.b.c", 42)).toEqual({a: {b: {c: 42}}});
  });









});
