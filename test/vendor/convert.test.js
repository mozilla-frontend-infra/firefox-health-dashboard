/* global describe, it */
import {
  json2value,
  value2json,
  escapeRegEx,
  bytesToBase64URL,
  base64URLToBytes,
} from '../../src/vendor/convert';

describe('convert', () => {
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
      }),
    ).toBe(
      '{\n    "thisisalongnametoensuremultiline":1,\n    "b":2,\n    "c":3,\n    "d":4,\n    "e":5\n}',
    );
    expect(value2json([])).toBe('[]');
    expect(value2json([3])).toBe('[3]');
    expect(value2json('v')).toBe('"v"');
    expect(value2json([{ a: 2 }])).toBe('[{"a":2}]');
    expect(
      value2json([
        null,
        undefined,
        { thisisalongnametoensuremultiline: 1 },
        { b: 2 },
      ]),
    ).toBe(
      '[\n    null,\n    {"thisisalongnametoensuremultiline":1},\n    {"b":2}\n]',
    );
  });

  it('json2value', () => {
    expect(() => json2value("'''")).toThrow();
    expect(json2value('"text"')).toEqual('text');
    expect(json2value('{"b": 2}')).toEqual({ b: 2 });
  });

  it('escapeRegEx', () => {
    expect(escapeRegEx('q2W#e.[{]}')).toBe('q2W#e\\.\\[\\{\\]\\}');
    expect(escapeRegEx('./:loiep*&')).toBe('\\./:loiep\\*&');
  });

  it('bytesToBase64URL', () => {
    const spy = jest.spyOn(global.console, 'error');

    expect(bytesToBase64URL(1)).toBe('AA');
    expect(bytesToBase64URL(2)).toBe('AAA');
    expect(bytesToBase64URL(3)).toBe('AAAA');
    expect(bytesToBase64URL([1])).toBe('AQ');
    expect(bytesToBase64URL([1, 0, 1])).toBe('AQAB');
    expect(bytesToBase64URL([0, 1, 1, 0])).toBe('AAEBAA');

    expect(spy).not.toHaveBeenCalled();
    bytesToBase64URL('test');
    expect(spy).toHaveBeenCalled();
  });

  it('base64URLToBytes', () => {
    expect(base64URLToBytes('aHR0cHM6Ly9nb29nbGUuY29t')).toBe('https://google.com');
    expect(base64URLToBytes('aHR0cHM6Ly93d3cubW96aWxsYS5vcmc=')).toBe('https://www.mozilla.org');
  });
});
