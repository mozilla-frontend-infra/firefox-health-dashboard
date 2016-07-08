/* global describe, it*/
import assert from 'assert';
import { getInDevelopment } from '../../src/status/caniuse';

describe('getInDevelopment', () => {
  it('should return an array', async () => {
    const data = await getInDevelopment();
    assert(Array.isArray(data));
    assert(data.length > 1);
  });
});
