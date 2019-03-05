/* global describe, it */
import { isInteger, literalField, splitField } from '../../src/vendor/utils';

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
  });

  it('literalField', () => {
    expect(literalField('a.b.c')).toEqual('a\\.b\\.c');
  });

  it('splitField', () => {
    expect(splitField('a.b\\.c\\.html.d')).toEqual(['a', 'b.c.html', 'd']);
  });
});
