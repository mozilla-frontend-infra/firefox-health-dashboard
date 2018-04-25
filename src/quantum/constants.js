export const quantum32QueryParams = {
  // 32 bit
  architecture: 'x86',
};

export const quantum64QueryParams = {
  // 64 bit
  architecture: 'x86-64',
};

export const architecture = {
  32: 'x86',
  64: 'x86-64',
};

// [qf:f61] to be updated to [qf:f64] with firefox 61's release
export const flowWhiteboardTags = {
  whiteboard: '[qf:p1][qf:f61]',
};

export const getBugUrl = function getBugUrl(id) {
  return `https://bugzilla.mozilla.org/show_bug.cgi?id=${id}`;
};

export const statusLabels = new Map([
  ['red', 'at risk and not within target'],
  ['yellow', 'on track but not within target'],
  ['green', 'within target'],
  ['blue', 'signed off'],
  ['secondary', 'regression criteria at risk'],
]);
