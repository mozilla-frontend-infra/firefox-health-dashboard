
const invalid = {
  full: null,
  major: 0,
  minor: 0,
  patch: 0,
  channel: null,
  candidate: 0,
  isMajor: false,
  isDot: false
};

export function parse(input) {
  const bits = input.match(/^(\d+)\.\d+(?:\.(\d+)|\.(\d+)(esr)|(a|b)(\d*))?$/);
  if (!bits) {
    return invalid;
  }
  let channel = bits[4] || 'release';
  if (bits[5]) {
    channel = (bits[5] === 'b') ? 'beta' : 'aurora';
  }
  return {
    full: input,
    major: +bits[1],
    minor: +bits[2] || 0,
    patch: +bits[3] || 0,
    channel: channel,
    candidate: +bits[6] || 0,
    isMajor: !(bits[2] || bits[3]),
    isDot: channel === 'release' && bits[2]
  };
}

// export function sort(a, b) {
//   const parseA = parse(a);
//   const parseB = parse(b);
// }
