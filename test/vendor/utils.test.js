/* global describe, it */
import { Data, isData } from '../../src/vendor/datas';
import {
  array,
  isInteger,
  isNumeric,
  literalField,
  missing,
  splitField,
  toArray,
  first,
  last,
  isFunction,
  exists,
  coalesce,
  isString,
  joinField,
  concatField,
  zip,
  isMany,
  reverse,
} from '../../src/vendor/utils';
import { selectFrom } from '../../src/vendor/vectors';
import { GMTDate as Date } from '../../src/vendor/dates';
import { Duration } from '../../src/vendor/durations';

describe('utils', () => {
  it('isInteger', () => {
    expect(isInteger(0)).toBe(true);
    expect(isInteger('0')).toBe(true);
    expect(isInteger('-0')).toBe(true);
    expect(isInteger('+0')).toBe(true);
    expect(isInteger('0.00')).toBe(true);
    expect(isInteger('3.0')).toBe(true);
    expect(isInteger(0.5)).toBe(false);
    expect(isInteger('55begin')).toBe(false);
    expect(isInteger('begin55')).toBe(false);
    expect(isInteger('')).toBe(false);
    expect(isInteger('3.14')).toBe(false);
    expect(isInteger('inf')).toBe(false);
    expect(isInteger('Nan')).toBe(false);
    expect(isInteger('10.00e+10')).toBe(true);
    expect(isInteger('10e100')).toBe(true);
    expect(isInteger('10e-100')).toBe(false);
  });

  it('isNumeric', () => {
    expect(isNumeric(0)).toBe(true);
    expect(isNumeric('0')).toBe(true);
    expect(isNumeric('-0')).toBe(true);
    expect(isNumeric('+0')).toBe(true);
    expect(isNumeric('0.00')).toBe(true);
    expect(isNumeric('3.0')).toBe(true);
    expect(isNumeric(0.5)).toBe(true);
    expect(isNumeric('55begin')).toBe(false);
    expect(isNumeric('begin55')).toBe(false);
    expect(isNumeric('')).toBe(false);
    expect(isNumeric('3.14')).toBe(true);
    expect(isNumeric('inf')).toBe(false);
    expect(isNumeric('Nan')).toBe(false);
    expect(isNumeric('10.00e+10')).toBe(true);
    expect(isNumeric('10e100')).toBe(true);
    expect(isNumeric('10e-100')).toBe(true);
  });

  it('literalField', () => {
    expect(literalField('a.b.c')).toEqual('a\\.b\\.c');
  });

  it('splitField', () => {
    expect(splitField('a.b\\.c\\.html.d')).toEqual(['a', 'b.c.html', 'd']);
  });

  it('broken js: new Array.map()', () => {
    // EXPECT a.map(func) TO PRODUCE AN ARRAY WHERE
    // EVERY ELEMENT CONTAINS SOMETHING FROM func's CODOMAIN
    // DO NOT EXPECT map() TO BA A NO-OP
    expect(new Array(6).map(() => 1)[2]).toBeUndefined();
  });

  it('broken js: new Array.forEach()', () => {
    // EXPECT a.forEach(func) TO RUN FUNCTION ONCE FOR EACH ELEMENT
    // DO NOT EXPECT forEach() TO SOMETIMES BE IGNORED
    let count = 0;

    new Array(6).forEach(() => {
      count += 1;
    });
    expect(count).toEqual(0);
  });

  it('broken js: new Array', () => {
    // EXPECT IDENTICAL ARRAYS TO BEHAVE IDENTICALLY UNDER map()
    // DO NOT EXPECT EACH ARRAY TO BE A SPECIAL SNOWFLAKE
    const A = array(2).map(() => 1);
    const B = new Array(2);

    A[0] = undefined;
    B[1] = 1;

    expect(A).toEqual(B); // ARRAYS ARE EQUAL

    // NOT EXPECTING DIFFERENCE
    expect(A.map(() => 2)[0]).toBe(2);
    expect(B.map(() => 2)[0]).toBeUndefined();
  });

  it('fixed array', () => {
    expect(array(6).map(() => 1)[2]).toEqual(1);
  });

  it('toArray', () => {
    expect(toArray(null)).toEqual([]);
    expect(toArray(undefined)).toEqual([]);
    expect(toArray(0)).toEqual([0]);
    expect(toArray('')).toEqual(['']);
    expect(toArray('test')).toEqual(['test']);
    expect(toArray(true)).toEqual([true]);
    expect(toArray(false)).toEqual([false]);
    expect(toArray({})).toEqual([{}]);
    expect(toArray(selectFrom([]))).toEqual([]);
  });

  it('isData', () => {
    expect(isData({})).toBe(true);
    expect(isData({ test: 42 })).toBe(true);
    expect(isData({ test: { test: 42 } }.test)).toBe(true);
    expect(isData(new Data())).toBe(true);
    expect(isData(undefined)).toBe(false);
    expect(isData(null)).toBe(false);
    expect(isData(true)).toBe(false);
    expect(isData(false)).toBe(false);
    expect(isData(42)).toBe(false);
    expect(isData('')).toBe(false);
    expect(isData('test')).toBe(false);
    expect(isData([])).toBe(false);
    expect(isData([42])).toBe(false);
    expect(isData(selectFrom([]))).toBe(false);
    expect(isData(() => 0)).toBe(false);
    expect(isData(Date.now())).toBe(false);
    expect(isData(new Duration())).toBe(false);
    expect(isData(new Map().keys())).toBe(false);
  });

  it('missing', () => {
    expect(missing(Number.POSITIVE_INFINITY)).toBe(true);
    expect(missing(Number.NEGATIVE_INFINITY)).toBe(true);
    expect(missing(Number.NaN)).toBe(true);
    expect(missing(null)).toBe(true);
    expect(missing(undefined)).toBe(true);
    expect(missing('')).toBe(true);
    expect(missing([])).toBe(true);
    expect(missing(selectFrom([]))).toBe(true);
    expect(missing(toArray(null))).toBe(true);
    expect(missing(false)).toBe(false);
    expect(missing(true)).toBe(false);
    expect(missing(0)).toBe(false);
    expect(missing({})).toBe(false);
  });

  it('first', () => {
    expect(first('test')).toBe('t');
    expect(first('jest')).toBe('j');
    expect(first(['11', '22', '33'])).toBe('11');
    expect(first('')).toBe(null);
  });

  it('last', () => {
    expect(last('west')).toBe('t');
    expect(last('foobar')).toBe('r');
    expect(last(['11', '22', '33'])).toBe('33');
    expect(last('')).toBe(null);
  });

  it('isFunction', () => {
    const emptyFunc = function empty() {};
    expect(isFunction(emptyFunc)).toBe(true);
    expect(isFunction('string')).toBe(false);
    expect(isFunction(true)).toBe(false);
    expect(isFunction([])).toBe(false);
    expect(isFunction(null)).toBe(false);
    expect(isFunction(undefined)).toBe(false);
  });

  it('exists', () => {
    expect(exists(Number.POSITIVE_INFINITY)).toBe(false);
    expect(exists(Number.NEGATIVE_INFINITY)).toBe(false);
    expect(exists(Number.NaN)).toBe(false);
    expect(exists(null)).toBe(false);
    expect(exists(undefined)).toBe(false);
    expect(exists('')).toBe(false);
    expect(exists([])).toBe(false);
    expect(exists(selectFrom([]))).toBe(false);
    expect(exists(toArray(null))).toBe(false);
    expect(exists(false)).toBe(true);
    expect(exists(true)).toBe(true);
    expect(exists(0)).toBe(true);
    expect(exists({})).toBe(true);
  });

  it('coalesce', () => {
    expect(coalesce('a', 'b', 'c')).toBe('a');
    expect(coalesce(3, 2, 1)).toBe(3);
    expect(coalesce('string')).toBe('string');
    expect(coalesce('')).toBe(null);
  });

  it('isString', () => {
    expect(isString('string')).toBe(true);
    expect(isString(true)).toBe(false);
    expect(isString([])).toBe(false);
    expect(isString(null)).toBe(false);
    expect(isString(undefined)).toBe(false);
  });

  it('joinField', () => {
    expect(joinField(['1', '2', '3'])).toBe('1.2.3');
    expect(joinField(['3', '2', '1'])).toBe('3.2.1');
  });

  it('concatField', () => {
    expect(concatField(1, 2, 3)).toBe('1.2.3');
    expect(concatField('1.2,3', 1, 2, 3)).toBe('1.2,3.1.2.3');
    expect(concatField('1.2,3', 1, 2, [3, '1,2'])).toBe('1.2,3.1.2.3,1,2');
  });

  it('zip', () => {
    expect(zip([1, 2], [1, 2])).toStrictEqual([[1, 1], [2, 2]]);
    expect(zip([1, 2, 3], [1, 2])).toStrictEqual([[1, 1], [2, 2], [3, undefined]]);
  });

  it('isMany', () => {
    expect(isMany([])).toBe(true);
    expect(isMany('')).toBe(false);
    expect(isMany(null)).toBe(false);
    expect(isMany({})).toBe(false);
  });

  it('reverse', () => {
    expect(reverse([3, 2, 1])).toStrictEqual([1, 2, 3]);
    expect(reverse([1])).toStrictEqual([1]);
    expect(reverse(['t', 's', 'e', 'j'])).toStrictEqual(['j', 'e', 's', 't']);
  });
});
