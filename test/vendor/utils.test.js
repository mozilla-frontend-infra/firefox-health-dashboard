/* global describe, it */
import {
  isInteger,
  isNumeric,
  literalField,
  splitField,
} from '../../src/vendor/utils';

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
});
