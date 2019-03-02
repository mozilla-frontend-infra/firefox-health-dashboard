import { missing } from './utils';

function sign(n) {
  if (n == null) return null;

  if (n > 0.0) return 1.0;

  if (n < 0.0) return -1.0;

  return 0.0;
}

function abs(n) {
  if (n == null) return null;

  return Math.abs(n);
}

function log10(v) {
  return Math.log(v) / Math.log(10);
}

function floor(value, mod) {
  if (value == null) {
    return null;
  }

  if (mod === undefined) {
    return value - (value % 1);
  }

  if (mod == null) {
    return null;
  }

  return value - (value % mod);
}

function ceiling(value, rounding) {
  if (value == null) {
    return null;
  }

  if (rounding === undefined) {
    return Math.ceil(value);
  }

  if (rounding == null) {
    return null;
  }

  if (value === 0) {
    return 0.0;
  }

  const { digits } = rounding;
  let d = null;

  if (digits !== undefined) {
    d = 10 ** (rounding.digits - ceiling(log10(value)));
  } else {
    d = 10 ** rounding;
  }

  return Math.ceil(value * d) / d;
}

function round(value, rounding) {
  if (rounding === undefined) return Math.round(value);

  if (missing(value)) {
    return null;
  }

  if (value === 0) {
    return 0.0;
  }

  const { digits } = rounding;
  let d = null;

  if (digits !== undefined) {
    d = 10 ** (digits - ceiling(log10(value)));
  } else {
    d = 10 ** rounding;
  }

  return Math.round(value * d) / d;
}

function roundMetric(value, rounding) {
  const order = floor(Math.log10(value) / 3);
  const prefix = round(value / 10 ** (order * 3), rounding);
  const units = ['nano', 'micro', 'milli', '', 'kilo', 'mega', 'giga', 'tera'][
    order + 3
  ];

  return prefix + units;
}

function sum(values) {
  let sum = null;

  values.forEach(v => {
    if (v == null) return;

    if (sum == null) sum = v;
    else sum += v;
  });

  return sum;
}

function average(values) {
  let total = 0.0;
  let count = 0;

  values.forEach(v => {
    if (missing(v)) return;
    total += v;
    count += 1;
  });

  if (count === 0) return null;

  return total / count;
}

function max(values) {
  let max = null;

  values.forEach(v => {
    if (missing(v)) return;

    if (max == null || max < v) max = v;
  });

  return max;
}

function min(values) {
  let min = null;

  values.forEach(v => {
    if (missing(v)) return;

    if (min == null || min > v) min = v;
  });

  return min;
}

function mod(value, mod) {
  if (value == null) {
    return null;
  }

  if (mod === undefined) {
    return value % 1;
  }

  if (mod == null) {
    return null;
  }

  return value % mod;
}

export {
  ceiling,
  floor,
  round,
  roundMetric,
  sign,
  abs,
  max,
  min,
  mod,
  sum,
  average,
  log10,
};
