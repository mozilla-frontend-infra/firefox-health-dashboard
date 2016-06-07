
const invalid = {
  full: null,
  major: 0,
  minor: 0,
  patch: 0,
  channel: null,
  candidate: 0,
  isMajor: false,
};

export function sanitize(version) {
  if (/^\d+$/.test(version)) {
    return `${version}.0`;
  }
  return version;
}

export function parse(input) {
  const bits = sanitize(input)
    .match(/^(\d+)\.(\d+)(?:\.(\d+)|\.(\d+)(esr)|(a|b)(\d*))?$/);
  if (!bits) {
    return invalid;
  }
  let channel = bits[5] || 'release';
  if (bits[6]) {
    channel = (bits[6] === 'b') ? 'beta' : 'aurora';
  }
  if (channel === 'release' && +bits[2]) {
    channel = 'esr';
  }
  const result = {
    full: input,
    major: +bits[1],
    minor: +bits[2] || 0,
    patch: +bits[3] || +bits[4] || 0,
    channel: channel,
    candidate: +bits[7] || 0,
    isMajor: channel === 'release' && !+bits[3],
  };
  const clean = [result.major, '.', result.minor];
  if (channel === 'beta') {
    clean.push('b', result.candidate);
  } else if (result.patch) {
    clean.push('.', result.patch);
    if (channel === 'esr') {
      clean.push('esr');
    }
  }
  result.clean = clean.join('');
  return result;
}

// export function sort(a, b) {
//   const parseA = parse(a);
//   const parseB = parse(b);
// }
