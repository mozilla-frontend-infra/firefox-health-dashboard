/* global describe, it */
import { fromQueryString, toQueryString } from '../../src/vendor/requests';

describe('requests', () => {
  const reversable = [
    { a: '{}' },
    { a: '[]' },
    { a: '\\' },
    { a: '"' },
    { a: '%' },
    { a: '+' },
    { a: '=' },
    { a: '=a' },
    { a: 'null' },
    { a: false },
    { a: 'false' },
    { a: true },
    { a: 'true' },
    { a: 42 },
    { a: '42' },
    { a: ' ' },
    { a: '  ' },
    { a: 'blue+light blue' },
    { a: '{"test":42}' },
    { a: { test: 42 } },
    { a: [1, 2, 3] },
    { a: { b: { c: 42 } } },
    { a: 'test' },
    { a: 'a b' },
    { a: 'a b c d' },
    { a: 'ståle' },
    { '/jobs': true },
    { '/jobs?': true },
  ];

  it('reversable', () => {
    reversable.forEach((obj) => expect(
      (() => {
        const qs = toQueryString(obj);

        return fromQueryString(qs);
      })(),
    ).toEqual(obj));
  });

  const toQuery = [
    [{ a: null }, ''],
    [{ a: [1, null, ''] }, 'a=1'],
    [{ a: ' ' }, 'a=+'],
    [{ a: '  ' }, 'a=++'],
  ];

  it('toQueryString', () => {
    toQuery.forEach(([obj, url]) => expect(toQueryString(obj)).toEqual(url));
  });

  const nonStandardQueryStrings = [
    [{ a: ' ' }, 'a=%20'],
    [{ a: '  ' }, 'a=%20%20'],
    [{ a: 'blue+light blue' }, 'a=blue%2Blight%20blue'],
    [{}, ''],
    [{ a: true }, 'a=true'],
    [{ a: null }, 'a=null'],
    [{ a: '%' }, 'a=%'],
    [{ a: '%%%%' }, 'a=%%25%%'],
    [{ a: '%abåle%' }, 'a=%ab%C3%A5le%'],
    [{ a: 'å%able%' }, 'a=%C3%A5%able%'],
    [{ a: '{%ab|%de}' }, 'a=%7B%ab%7C%de%7D'],
    [{ a: '{%ab%|%de%}' }, 'a=%7B%ab%%7C%de%%7D'],
    [{ a: '%7 B%ab%|%de%%7 D' }, 'a=%7 B%ab%%7C%de%%7 D'],
    [{ a: '%ab' }, 'a=%ab'],
    [{ a: '%ab%ab%ab' }, 'a=%ab%ab%ab'],
    [{ a: 'a MM' }, 'a=%61+%4d%4D'],
    [{ a: 'ståle%' }, 'a=st%C3%A5le%'],
    [{ a: '%ståle%' }, 'a=%st%C3%A5le%'],
    [{ a: '%{ståle}%' }, 'a=%%7Bst%C3%A5le%7D%'],
    [{ a: '\uFEFFtest' }, 'a=%EF%BB%BFtest'],
    [{ a: '\uFEFF' }, 'a=%EF%BB%BF'],
    [{ a: '†' }, 'a=†'],
    [{ a: '\uFFFD' }, 'a=%C2'],
    [{ a: '\uFFFDx' }, 'a=%C2x'],
    [{ a: 'µ' }, 'a=%C2%B5'],
    [{ a: 'µ%' }, 'a=%C2%B5%'],
    [{ a: '%µ%' }, 'a=%%C2%B5%'],
    [{ a: '\uFEFFtest' }, 'a=\uFEFFtest'],
    [{ a: true }, 'a=\uFEFF'],
    [{ a: '\uFFFD\uFFFD' }, 'a=%FE%FF'],
    [{ a: '\uFFFD\uFFFD' }, 'a=%FF%FE'],
  ];

  it('AcceptNonStandardQueryStrings', () => {
    nonStandardQueryStrings.forEach(([obj, url]) => expect(fromQueryString(url)).toEqual(obj));
  });

  it('KeyWithoutValueIsTruthy', () => {
    expect(fromQueryString('a').a).toBeTruthy();
    expect(fromQueryString('/jobs?')['/jobs?']).toBeTruthy();
  });
});
