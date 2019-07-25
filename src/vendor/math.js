import { coalesce, missing, exists } from './utils';

function sign(n) {
  if (missing(n)) {
    return null;
  }

  if (n > 0.0) {
    return 1.0;
  }

  if (n < 0.0) {
    return -1.0;
  }

  return 0.0;
}

function abs(n) {
  if (missing(n)) {
    return null;
  }

  return Math.abs(n);
}

function log10(v) {
  if (missing(v) || v <= 0) {
    return null;
  }

  return Math.log(v) / Math.log(10);
}

function mod(value, mod) {
  if (missing(value)) {
    return null;
  }

  const m = coalesce(mod, 1);

  if (value < 0) {
    return (m + (value % m)) % m;
  }

  return value % m;
}

function floor(value, modulo) {
  if (missing(value)) {
    return null;
  }

  return value - mod(value, modulo);
}

function ceiling(value, mod) {
  if (missing(value)) {
    return null;
  }

  const d = coalesce(mod, 1);

  return Math.ceil(value / d) * d;
}

function round(value, rounding) {
  if (missing(value)) {
    return null;
  }

  if (rounding === undefined) {
    return Math.round(value);
  }

  if (value === 0) {
    return 0.0;
  }

  const { digits, places } = rounding;
  const dig = coalesce(digits, places);
  let d = null;

  if (exists(dig)) {
    if (dig <= 0) {
      return 10 ** Math.round(log10(value));
    }

    d = 10 ** (dig - ceiling(log10(value)));
  } else {
    d = 10 ** rounding;
  }

  return Math.round(value * d) / d;
}

function roundMetric(value, rounding) {
  const order = floor(Math.log10(value) / 3);
  const prefix = round(value / 10 ** (order * 3), rounding);
  const units = ['n', 'µ', 'm', '', 'K', 'M', 'G', 'T'][order + 3];

  return prefix + units;
}

function count(values) {
  let output = 0;

  values.forEach((v) => {
    if (missing(v)) {
      return;
    }

    output += 1;
  });

  return output;
}

function sum(values) {
  let sum = null;

  values.forEach((v) => {
    if (missing(v)) {
      return;
    }

    if (missing(sum)) {
      sum = v;
    } else sum += v;
  });

  return sum;
}

function average(values) {
  let total = 0.0;
  let count = 0;

  values.forEach((v) => {
    if (missing(v)) {
      return;
    }

    total += v;
    count += 1;
  });

  if (count === 0) {
    return null;
  }

  return total / count;
}

function exp(value) {
  if (missing(value)) {
    return null;
  }

  return Math.exp(value);
}

function geomean(values) {
  return exp(average(values.map(Math.log)));
}

function max(values) {
  let max = null;

  values.forEach((v) => {
    if (missing(v)) {
      return;
    }

    if (missing(max) || max < v) {
      max = v;
    }
  });

  return max;
}

function min(values) {
  let min = null;

  values.forEach((v) => {
    if (missing(v)) {
      return;
    }

    if (missing(min) || min > v) {
      min = v;
    }
  });

  return min;
}

function div(a, b) {
  if (missing(a) || missing(b) || b === 0) {
    return null;
  }

  return a / b;
}

function add(a, b) {
  if (missing(a) || missing(b)) {
    return null;
  }

  return a + b;
}

function mul(a, b) {
  if (missing(a) || missing(b)) {
    return null;
  }

  return a * b;
}

export {
  div,
  add,
  mul,
  ceiling,
  floor,
  round,
  roundMetric,
  sign,
  abs,
  max,
  min,
  mod,
  count,
  sum,
  average,
  geomean,
  log10,
  exp,
};
