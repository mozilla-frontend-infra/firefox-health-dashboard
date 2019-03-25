/* global describe, it */
import {
  value2json,
  json2value,
  Object2URL,
  URL2Object,
} from '../../src/vendor/convert';

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
      '{\n    "thisisalongnametoensuremultiline":1,\n    "b":2,\n    "c":3,\n    "d":4,\n    "e":5\n}'
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
      ])
    ).toBe(
      '[\n    null,\n    {"thisisalongnametoensuremultiline":1},\n    {"b":2}\n]'
    );
  });

  it('json2value', () => {
    expect(() => json2value("'''")).toThrow();
    expect(json2value('"text"')).toEqual('text');
    expect(json2value('{"b": 2}')).toEqual({ b: 2 });
  });

  const URLS = [
    [{ a: '{}' }, 'a=%7B%7D'],
    [{ a: '=' }, 'a=%3D'],
    [{ a: '+' }, 'a=%2B'],
    [{ a: ' ' }, 'a=%20'],
    [{ a: '  ' }, 'a=%20%20'],
    [{ a: '{"test":42}' }, 'a=%7B%22test%22%3A42%7D'],
    [{ a: [1, 2, 3] }, 'a=1&a=2&a=3'],
    [{ a: { b: { c: 42 } } }, 'a.b.c=42'],
  ];

  it('Object2URL', () => {
    URLS.forEach(([obj, url]) => expect(Object2URL(obj)).toEqual(url));
  });

  it('URL2Object', () => {
    URLS.forEach(([obj, url]) => expect(URL2Object(url)).toEqual(obj));
  });
});
