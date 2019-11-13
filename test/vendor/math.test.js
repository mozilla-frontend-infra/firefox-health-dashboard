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
  geomean,
  exp,
  div,
} from '../../src/vendor/math';
import { selectFrom } from '../../src/vendor/vectors';

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
    const result = selectFrom(data)
      .map((v) => ceiling(v, 2))
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

  it('broken js: % (modulo)', () => {
    // Javascript modulo arithmetic is broken: It can return
    // negative numbers, which causes arithmetic problems
    const m = 6; // OUR MODULO FOR TESTING
    const someValues = [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6];
    const negZero = ((v) => -1 * v)(0);

    // WE EXPECT mod(k, m) TO HAVE A CODOMAIN OF m DIFFERENT VALUES
    // WRONG
    expect([...new Set(someValues.map((v) => v % m))].length).toBe(11);
    // CORRECT
    expect([...new Set(someValues.map((v) => mod(v, m)))].length).toBe(6);

    // WE EXPECT ZERO TO BE ZERO
    expect(-6 % m).toBe(negZero); //  WRONG
    expect(mod(-6, m)).toBe(0); // CORRECT

    // WE EXPECT mod(a+b, m) == mod(a, m) + mod(b, m) (modulo m)
    // EXPECT 3, NOT SOME OTHER VALUE
    expect((2 + -5) % m).toBe(-3); // WRONG
    expect(mod(2 + -5, m)).toBe(3); // CORRECT
    // WE EXPECT THE SAME AS BEFORE
    expect((2 % m) + (-5 % m)).toBe(-3); // WRONG
    expect(mod(2, m) + mod(-5, m)).toBe(3); // CORRECT

    // WE EXPECT FERMAT'S THEOREM TO WORK
    // mod(a**(p-1), p) == 1, where p is prime
    const prime = 2;

    expect((-5) ** (prime - 1) % prime).toBe(-1); // WRONG
    expect(mod((-5) ** (prime - 1), prime)).toBe(1); // CORRECT

    // WE EXPECT mod(a, m) == mod(a-k*m, m)  for any k
    const k = 20;

    expect((4 - k * m) % m).toBe(-2); // WRONG
    expect(mod(4 - k * m, m)).toBe(4); // CORRECT
  });

  it('floor', () => {
    const result = selectFrom(data)
      .map((v) => floor(v, 2))
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
    expect(round(null, { digits: 2 })).toBe(null);
    expect(round(null)).toBe(null);

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

  it('broken js: division', () => {
    // WE EXPECT THIS CALCUALTION TO FAIL, OR RETURN NOTHING
    // WE DO NOT EXPECT A LEGITIMATE VALUE
    expect(null / 1).toBe(0);
  });

  it('broken js: exp', () => {
    // WE EXPECT THIS CALCULATION TO FAIL, OR RETURN NOTHING
    // WE DO NOT EXPECT A LEGITIMATE VALUE
    expect(Math.exp(null)).toBe(1); // BAD
    expect(Math.exp(undefined)).toBe(NaN); // GOOD
  });

  it('broken js: lt', () => {
    // WE EXPECT THIS COMPARISON TO:
    // 1. THROW ERROR - aka STRICT
    // 2. RETURN false - aka DECISIVE
    // 3. RETURN NOTHING - aka CONSERVATIVE
    // WE DO NOT EXPECT null TO BE ON THE NUMBER LINE
    expect(null < 5).toBe(true); // BAD
    expect(null >= 5).toBe(false); // GOOD
    // eslint-disable-next-line eqeqeq
    expect(null == 0).toBe(false); // GOOD
    expect(null === 0).toBe(false); // GOOD

    expect(undefined < 5).toBe(false); // GOOD
    expect(undefined >= 5).toBe(false); // GOOD
    // eslint-disable-next-line eqeqeq
    expect(undefined == 0).toBe(false); // GOOD
    expect(undefined === 0).toBe(false); // GOOD
  });

  it('exp', () => {
    expect(exp(null)).toBe(null);
  });

  it('division', () => {
    expect(div(null, 1)).toBe(null);
    expect(div(0, 0)).toBe(null);
    expect(div(1, 0)).toBe(null);
    expect(div(null, 0)).toBe(null);
  });

  it('geomean', () => {
    expect(geomean([null])).toBe(null);
    expect(geomean([])).toBe(null);
    expect(geomean([undefined])).toBe(null);
    expect(geomean([0])).toBe(null);
    expect(geomean([0, 10])).toBeCloseTo(10);
    expect(geomean([5 * 5, 3 * 3])).toBeCloseTo(5 * 3);
  });
});
