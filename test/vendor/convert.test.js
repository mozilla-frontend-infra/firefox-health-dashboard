/* eslint-disable linebreak-style */
/* global describe, it */
import { value2json } from '../../src/vendor/convert';

describe('math', () => {
  it('value2json', () => {
    expect(value2json({})).toBe('{}');
    expect(value2json({ a: 2 })).toBe('{"a":2}');
    expect(
      value2json({
        thisisalongnametoensuremultiline: 1,
        b: 2,
        c: 3,
        d: 4,
        e: 5,
      })
    ).toBe(
      '{\n\t"thisisalongnametoensuremultiline":1,\n\t"b":2,\n\t"c":3,\n\t"d":4,\n\t"e":5\n}'
    );
    expect(value2json([])).toBe('[]');
    expect(value2json([3])).toBe('[3]');
    expect(value2json('v')).toBe('"v"');
  });
});
