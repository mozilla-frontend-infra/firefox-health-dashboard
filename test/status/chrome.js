/* global describe, it*/
import assert from 'assert';
import { getChromePopular } from '../../src/status/chrome';

describe('getChromePopular', () => {
  it('should return an array', async () => {
    const data = await getChromePopular();
    assert(Array.isArray(data));
    assert(data.length > 1);
  });
});
