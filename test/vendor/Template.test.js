/* eslint-disable linebreak-style */
/* global describe, it */
import { expand } from '../../src/vendor/Template';
import strings from '../../src/vendor/strings';

describe('Template', () => {
  it('expand', () => {
    const value = 42;
    const result = expand('{{value}}', { value });

    expect(result).toBe('42');
  });

  it('comma', () => {
    const value = 1000000;
    const result = expand('{{value|comma}}', { value });

    expect(result).toBe('1,000,000');
  });

  it('indent', () => {
    const value = 'test value\n';
    const result = expand('example:\n{{value|indent}}', { value });

    expect(result).toBe('example:\n    test value\n');
  });

  it('quote', () => {
    const value = 'test value\n';
    const result = expand('{{value|quote}}', { value });

    expect(result).toBe('"test value\\n"');
  });

  it('left 1', () => {
    const value = 'string';
    const result = expand('{{value|left(3)}}', { value });

    expect(result).toBe('str');
  });

  it('left 2', () => {
    const value = 'string';
    const result = expand('{{value|left(-3)}}', { value });

    expect(result).toBe('');
  });

  it('right 1', () => {
    const value = 'string';
    const result = expand('{{value|right(3)}}', { value });

    expect(result).toBe('ing');
  });

  it('right 2', () => {
    const value = 'string';
    const result = expand('{{value|right(-1)}}', { value });

    expect(result).toBe('');
  });

  it('leftBut', () => {
    const value = 'string';
    const result = expand('{{value|leftBut(2)}}', { value });

    expect(result).toBe('stri');
  });

  it('rightBut', () => {
    const value = 'string';
    const result = expand('{{value|rightBut(2)}}', { value });

    expect(result).toBe('ring');
  });

  it('json', () => {
    const value = { a: 'v', b: 2 };
    const result = expand('example:\n{{value|json|indent}}', { value });

    expect(result).toBe('example:\n    {"a":"v","b":2}');
  });

  it('round', () => {
    const value = 42;
    const result = expand('{{value|round(1)}}', { value });

    expect(result).toBe('40');
  });

  it('metric', () => {
    const value = 42000;
    const result = expand('{{value|metric}}', { value });

    expect(result).toBe('42K');
  });

  it('format', () => {
    const value = 1551730631.234;
    const result = expand('{{value|format}}', { value });

    expect(result).toBe('2019-03-04 20:17:11');
  });

  it('unix', () => {
    const value = 1551730631.234;
    const result = expand('{{value|unix}}', { value });

    expect(result).toBe('1551730631');
  });

  it('loop', () => {
    const data = [
      { a: 10, b: 21 },
      { a: 11, b: 22 },
      { a: 12, b: 23 },
      { a: 13, b: 24 },
      { a: 14, b: 25 },
    ];
    const result = expand(
      { from: 'data', template: 'test: {{a}}, {{b}}', separator: '\n' },
      { data }
    );

    expect(result).toBe(
      'test: 10, 21\ntest: 11, 22\ntest: 12, 23\ntest: 13, 24\ntest: 14, 25'
    );
  });
});

describe('strings', () => {
  it('left', () => {
    expect(strings.left('string', 3)).toBe('str');
  });

  it('round', () => {
    expect(strings.round(42, 1)).toBe('40');
  });
});
