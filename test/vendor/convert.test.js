/* eslint-disable linebreak-style */
/* global describe, it */
import {
  value2json,
  json2value,
  ToQueryString,
  FromQueryString,
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
    [{ a: false }, 'a=false'],

    // https://www.w3.org/Addressing/URL/uri-spec.html#z5
    // https://tools.ietf.org/html/rfc3986#section-3.4
    // https://www.google.com/search?q=query+string+with+spaces
    [{ a: ' ' }, 'a=+'],
    [{ a: '  ' }, 'a=++'],
    [{ a: 'blue+light blue' }, 'a=blue%2Blight+blue'],
    [{ a: '{"test":42}' }, 'a=%7B%22test%22%3A42%7D'],
    [{ a: {"test":42} }, 'a.test=42'],
    [{ a: [1, 2, 3] }, 'a=1&a=2&a=3'],
    [{ a: { b: { c: 42 } } }, 'a.b.c=42'],
  ];

  it('ToQueryString1', () => {
    URLS.forEach(([obj, url]) => expect(ToQueryString(obj)).toEqual(url));
  });

  const  toQuery = [
    [{ a: true }, 'a'],
    [{ a: null}, ''],
  ];

  it('ToQueryString2', () => {
    toQuery.forEach(([obj, url]) => expect(ToQueryString(obj)).toEqual(url));
  });


  it('FromQueryString1', () => {
    URLS.forEach(([obj, url]) => expect(FromQueryString(url)).toEqual(obj));
  });

  const fromQuery = [
    [{ a: ' ' }, 'a=%20'],
    [{ a: '  ' }, 'a=%20%20'],
    [{ a: 'blue+light blue' }, 'a=blue%2Blight%20blue'],
    [{}, ''],
    [{ a: true }, 'a'],
    [{ a: true }, 'a=true'],
    [{ a: null}, 'a=null'],
  ];

  it('FromQueryString2', () => {
    fromQuery.forEach(([obj, url]) => expect(FromQueryString(url)).toEqual(obj));
  });
});
