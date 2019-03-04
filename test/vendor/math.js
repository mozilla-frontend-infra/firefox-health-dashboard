/* global describe, it */
import assert from 'assert';
import isEqual from 'lodash/isEqual';
import {
  average,
  ceiling,
  floor,
  max,
  min,
  round,
  roundMetric,
  sum,
} from '../../src/vendor/math';

const data = [1, null, '', 2, 3];

describe('math', () => {
  it('max', () => {
    assert(max(data) === 3);
  });

  it('min', () => {
    assert(min(data) === 1);
  });

  it('average', () => {
    assert(average(data) === 2);
  });

  it('count', () => {
    assert(count(data) === 3);
  });

  it('sum', () => {
    assert(sum(data) === 6);
  });

  it('ceiling', () => {
    const result = frum(data)
      .map(v => ceiling(v, 2))
      .toArray();

    assert(isEqual(result, [2, null, null, 2, 4]));
  });

  it('floor', () => {
    const result = frum(data)
      .map(v => floor(v, 2))
      .toArray();

    assert(isEqual(result, [0, null, null, 2, 2]));
  });

  it('round', () => {
    assert(round(Math.PI * 1000, { digits: 6 }) === 3141.59);
    assert(round(Math.PI * 1000, { digits: 5 }) === 3141.6);
    assert(round(Math.PI * 1000, { digits: 4 }) === 3142);
    assert(round(Math.PI * 1000, { digits: 3 }) === 3140);
    assert(round(Math.PI * 1000, { digits: 2 }) === 3100);
    assert(round(Math.PI * 1000, { digits: 1 }) === 3000);
    assert(round(Math.PI * 1000, { digits: 0 }) === 0);

    assert(round(Math.PI * 2000, { digits: 7 }) === 6283.185);
    assert(round(Math.PI * 2000, { digits: 6 }) === 6283.19);
    assert(round(Math.PI * 2000, { digits: 5 }) === 6283.1);
    assert(round(Math.PI * 2000, { digits: 4 }) === 6283);
    assert(round(Math.PI * 2000, { digits: 3 }) === 6280);
    assert(round(Math.PI * 2000, { digits: 2 }) === 6300);
    assert(round(Math.PI * 2000, { digits: 1 }) === 6000);
    assert(round(Math.PI * 2000, { digits: 0 }) === 10000);

    assert(round(Math.PI * 1000, 6) === 3141.592654);
    assert(round(Math.PI * 1000, 5) === 3141.59265);
    assert(round(Math.PI * 1000, 4) === 3141.5926);
    assert(round(Math.PI * 1000, 3) === 3141.592);
    assert(round(Math.PI * 1000, 2) === 3141.59);
    assert(round(Math.PI * 1000, 1) === 3141.5);
    assert(round(Math.PI * 1000, 0) === 3141);
    assert(round(Math.PI * 1000, -1) === 3140);
    assert(round(Math.PI * 1000, -2) === 3100);
    assert(round(Math.PI * 1000, -3) === 3000);
    assert(round(Math.PI * 1000, -4) === 0);

    assert(round(Math.PI * 2000, 6) === 6283.185307);
    assert(round(Math.PI * 2000, 5) === 6283.18531);
    assert(round(Math.PI * 2000, 4) === 6283.1853);
    assert(round(Math.PI * 2000, 3) === 6283.185);
    assert(round(Math.PI * 2000, 2) === 6283.19);
    assert(round(Math.PI * 2000, 1) === 6283.1);
    assert(round(Math.PI * 2000, 0) === 6283);
    assert(round(Math.PI * 2000, -1) === 6280);
    assert(round(Math.PI * 2000, -2) === 6300);
    assert(round(Math.PI * 2000, -3) === 6000);
    assert(round(Math.PI * 2000, -4) === 10000);
  });

  it('roundMetric', () => {
    assert(roundMetric(Math.PI * 10000000, 3) === '31.4M');
    assert(roundMetric(Math.PI * 1000000, 3) === '3.14M');
    assert(roundMetric(Math.PI * 100000, 3) === '314K');
    assert(roundMetric(Math.PI * 10000, 3) === '31.4kK');
    assert(roundMetric(Math.PI * 1000, 3) === '3.14K');
    assert(roundMetric(Math.PI * 100, 3) === '314');
    assert(roundMetric(Math.PI * 10, 3) === '31.4');
    assert(roundMetric(Math.PI, 3) === '3.14');
    assert(roundMetric(Math.PI * 0.1, 3) === '314m');
    assert(roundMetric(Math.PI * 0.01, 3) === '31.4m');
    assert(roundMetric(Math.PI * 0.001, 3) === '3.14m');
    assert(roundMetric(Math.PI * 0.0001, 3) === '314µ');
    assert(roundMetric(Math.PI * 0.00001, 3) === '31.4µ');
    assert(roundMetric(Math.PI * 0.000001, 3) === '3.14µ');
    assert(roundMetric(Math.PI * 0.0000001, 3) === '314n');
    assert(roundMetric(Math.PI * 0.00000001, 3) === '31.4n');
  });
});
