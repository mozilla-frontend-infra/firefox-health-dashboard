
const invalid = {
  full: null,
  major: 0,
  minor: 0,
  patch: 0,
  channel: null,
  candidate: 0,
  isMajor: false,
};

export function parse(input) {
  const bits = input.match(/^(\d+)\.(\d+)(?:\.(\d+)|\.(\d+)(esr)|(a|b)(\d*))?$/);
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
  return {
    full: input,
    major: +bits[1],
    minor: +bits[2] || 0,
    patch: +bits[3] || +bits[4] || 0,
    channel: channel,
    candidate: +bits[7] || 0,
    isMajor: channel === 'release' && !+bits[3],
  };
}

// export function sort(a, b) {
//   const parseA = parse(a);
//   const parseB = parse(b);
// }
