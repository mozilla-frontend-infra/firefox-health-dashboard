/* eslint-disable linebreak-style */
/* global describe, it */
import strings from '../../src/vendor/strings';

describe('strings', () => {
  it('left', () => {
    expect(strings.left('string', 3)).toBe('str');
  });

  it('round', () => {
    expect(strings.round(42, 1)).toBe('40');
  });

  it('trimLeft space', () => {
    expect(strings.trimLeft(' \t\ntest\n\t ')).toBe('test\n\t ');
  });

  it('trimLeft', () => {
    expect(strings.trimLeft(' \t\ntest\n\t ', ' ')).toBe('\t\ntest\n\t ');
  });

  it('trimRight space', () => {
    expect(strings.trimRight(' \t\ntest\n\t ')).toBe(' \t\ntest');
  });

  it('trimRight', () => {
    expect(strings.trimRight(' \t\ntest\n\t ', ' ')).toBe(' \t\ntest\n\t');
  });

  it('upper', () => {
    expect(strings.upper('ThisTEST')).toBe('THISTEST');
  });

  it('upper json', () => {
    expect(strings.upper({ ThisTEST: 42 })).toBe('{"THISTEST":42}');
  });

  it('lower', () => {
    expect(strings.lower('ThisTEST')).toBe('thistest');
  });

  it('lower json', () => {
    expect(strings.lower({ ThisTEST: 42 })).toBe('{"thistest":42}');
  });
});
