/* global describe, it */
import {
  average,
  ceiling,
  count,
  floor,
  max,
  min,
  mod,
  round,
  roundMetric,
  sum,
} from '../../src/vendor/math';
import { frum } from '../../src/vendor/queryOps';

const data = [1, null, '', 2, 3];

describe('math', () => {
  it('max', () => {
    expect(max(data)).toBe(3);
  });

  it('min', () => {
    expect(min(data)).toBe(1);
  });

  it('average', () => {
    expect(average(data)).toBe(2);
  });

  it('count', () => {
    expect(count(data)).toBe(3);
  });

  it('sum', () => {
    expect(sum(data)).toBe(6);
  });

  it('ceiling', () => {
    const result = frum(data)
      .map(v => ceiling(v, 2))
      .toArray();

    expect(result).toEqual([2, null, null, 2, 4]);
  });

  it('mod', () => {
    expect(mod(7, 6)).toBe(1);
    expect(mod(6, 6)).toBe(0);
    expect(mod(5, 6)).toBe(5);
    expect(mod(4, 6)).toBe(4);
    expect(mod(3, 6)).toBe(3);
    expect(mod(2, 6)).toBe(2);
    expect(mod(1, 6)).toBe(1);
    expect(mod(0, 6)).toBe(0);
    expect(mod(-1, 6)).toBe(5);
    expect(mod(-2, 6)).toBe(4);
    expect(mod(-3, 6)).toBe(3);
    expect(mod(-4, 6)).toBe(2);
    expect(mod(-5, 6)).toBe(1);
    expect(mod(-6, 6)).toBe(0);
    expect(mod(-7, 6)).toBe(5);

    expect(mod(7 / 6, 1)).toBeCloseTo(1 / 6);
    expect(mod(6 / 6, 1)).toBeCloseTo(0 / 6);
    expect(mod(5 / 6, 1)).toBeCloseTo(5 / 6);
    expect(mod(4 / 6, 1)).toBeCloseTo(4 / 6);
    expect(mod(3 / 6, 1)).toBeCloseTo(3 / 6);
    expect(mod(2 / 6, 1)).toBeCloseTo(2 / 6);
    expect(mod(1 / 6, 1)).toBeCloseTo(1 / 6);
    expect(mod(0 / 6, 1)).toBeCloseTo(0 / 6);
    expect(mod(-1 / 6, 1)).toBeCloseTo(5 / 6);
    expect(mod(-2 / 6, 1)).toBeCloseTo(4 / 6);
    expect(mod(-3 / 6, 1)).toBeCloseTo(3 / 6);
    expect(mod(-4 / 6, 1)).toBeCloseTo(2 / 6);
    expect(mod(-5 / 6, 1)).toBeCloseTo(1 / 6);
    expect(mod(-6 / 6, 1)).toBeCloseTo(0 / 6);
    expect(mod(-7 / 6, 1)).toBeCloseTo(5 / 6);
  });

  it('floor', () => {
    const result = frum(data)
      .map(v => floor(v, 2))
      .toArray();

    expect(result).toEqual([0, null, null, 2, 2]);

    expect(floor(-1 / 3)).toBe(-1);
  });

  it('round', () => {
    expect(round(Math.PI * 1000, { digits: 6 })).toBe(3141.59);
    expect(round(Math.PI * 1000, { digits: 5 })).toBe(3141.6);
    expect(round(Math.PI * 1000, { digits: 4 })).toBe(3142);
    expect(round(Math.PI * 1000, { digits: 3 })).toBe(3140);
    expect(round(Math.PI * 1000, { digits: 2 })).toBe(3100);
    expect(round(Math.PI * 1000, { digits: 1 })).toBe(3000);
    expect(round(Math.PI * 1000, { digits: 0 })).toBe(1000);

    expect(round(Math.PI * 2000, { digits: 7 })).toBe(6283.185);
    expect(round(Math.PI * 2000, { digits: 6 })).toBe(6283.19);
    expect(round(Math.PI * 2000, { digits: 5 })).toBe(6283.2);
    expect(round(Math.PI * 2000, { digits: 4 })).toBe(6283);
    expect(round(Math.PI * 2000, { digits: 3 })).toBe(6280);
    expect(round(Math.PI * 2000, { digits: 2 })).toBe(6300);
    expect(round(Math.PI * 2000, { digits: 1 })).toBe(6000);
    expect(round(Math.PI * 2000, { digits: 0 })).toBe(10000);

    expect(round(Math.PI * 1000, 6)).toBe(3141.592654);
    expect(round(Math.PI * 1000, 5)).toBe(3141.59265);
    expect(round(Math.PI * 1000, 4)).toBe(3141.5927);
    expect(round(Math.PI * 1000, 3)).toBe(3141.593);
    expect(round(Math.PI * 1000, 2)).toBe(3141.59);
    expect(round(Math.PI * 1000, 1)).toBe(3141.6);
    expect(round(Math.PI * 1000, 0)).toBe(3142);
    expect(round(Math.PI * 1000, -1)).toBe(3140);
    expect(round(Math.PI * 1000, -2)).toBe(3100);
    expect(round(Math.PI * 1000, -3)).toBe(3000);
    expect(round(Math.PI * 1000, -4)).toBe(0);

    expect(round(Math.PI * 2000, 6)).toBe(6283.185307);
    expect(round(Math.PI * 2000, 5)).toBe(6283.18531);
    expect(round(Math.PI * 2000, 4)).toBe(6283.1853);
    expect(round(Math.PI * 2000, 3)).toBe(6283.185);
    expect(round(Math.PI * 2000, 2)).toBe(6283.19);
    expect(round(Math.PI * 2000, 1)).toBe(6283.2);
    expect(round(Math.PI * 2000, 0)).toBe(6283);
    expect(round(Math.PI * 2000, -1)).toBe(6280);
    expect(round(Math.PI * 2000, -2)).toBe(6300);
    expect(round(Math.PI * 2000, -3)).toBe(6000);
    expect(round(Math.PI * 2000, -4)).toBe(10000);

    expect(round(42, -1)).toBe(40);
    expect(round(42, { digits: 0 })).toBe(100);
    expect(round(42, { digits: 1 })).toBe(40);
    expect(round(42, { digits: 2 })).toBe(42);

    // expect(round(1.005, { digits: 2 })).toBe(1.01);
  });

  it('roundMetric', () => {
    expect(roundMetric(Math.PI * 10000000, { digits: 3 })).toBe('31.4M');
    expect(roundMetric(Math.PI * 1000000, { digits: 3 })).toBe('3.14M');
    expect(roundMetric(Math.PI * 100000, { digits: 3 })).toBe('314K');
    expect(roundMetric(Math.PI * 10000, { digits: 3 })).toBe('31.4K');
    expect(roundMetric(Math.PI * 1000, { digits: 3 })).toBe('3.14K');
    expect(roundMetric(Math.PI * 100, { digits: 3 })).toBe('314');
    expect(roundMetric(Math.PI * 10, { digits: 3 })).toBe('31.4');
    expect(roundMetric(Math.PI, { digits: 3 })).toBe('3.14');
    expect(roundMetric(Math.PI * 0.1, { digits: 3 })).toBe('314m');
    expect(roundMetric(Math.PI * 0.01, { digits: 3 })).toBe('31.4m');
    expect(roundMetric(Math.PI * 0.001, { digits: 3 })).toBe('3.14m');
    expect(roundMetric(Math.PI * 0.0001, { digits: 3 })).toBe('314µ');
    expect(roundMetric(Math.PI * 0.00001, { digits: 3 })).toBe('31.4µ');
    expect(roundMetric(Math.PI * 0.000001, { digits: 3 })).toBe('3.14µ');
    expect(roundMetric(Math.PI * 0.0000001, { digits: 3 })).toBe('314n');
    expect(roundMetric(Math.PI * 0.00000001, { digits: 3 })).toBe('31.4n');
  });
});
