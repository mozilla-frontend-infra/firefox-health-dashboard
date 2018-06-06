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

// [qf:f61] whiteboard tags to be replaced with [qf:f64] with firefox 61's release
export const flowGraphProps = {
  api: 'bz/burnup',
  customClass: 'wide-content',
  title: 'Quantum Flow P1 Bugs Data',
  legend: ['Total', 'Closed', 'Needs-analysis', 'Analyzed'],
  target: 'Fix P1 Bugs',
  width: 950,
  height: 300,
  query: { whiteboard: '[qf:f61],[qf:p1]' },
  keys: ['total', 'closed', 'needsAnalysis', 'analyzed'],
};
