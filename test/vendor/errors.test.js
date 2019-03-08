/* eslint-disable linebreak-style */
/* global describe, it */

describe('errors', () => {
  it('error', () => {
    expect(() => throw new Error('problem')).toThrow();
  });

  it('warning', () => {
    let result = null;

    try {
      throw new Error('problem');
    } catch (e) {
      result = e.toData();
    }

    expect(result.template).toEqual('problem');
    expect(result.props).toEqual(null);
    expect(result.cause).toEqual(null);
    expect(result.trace[0].fileName.endsWith('errors.jsx')).toBe(true);
  });
});
