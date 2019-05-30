/* global describe, it */
import { Log } from '../../src/vendor/logs';

describe('logs', () => {
  it('error', () => {
    expect(() => Log.error('problem')).toThrow();
  });

  it('warning', () => {
    let result = null;

    try {
      Log.error('problem');
    } catch (e) {
      result = e.toData();
    }

    expect(result.template).toEqual('problem');
    expect(result.props).toEqual(null);
    expect(result.cause).toEqual(null);
    expect(result.trace[0].fileName).toEndWith('logs.test.js');
  });
});
