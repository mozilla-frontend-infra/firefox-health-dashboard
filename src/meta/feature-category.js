const mapCategory = [
  {
    status: 'misc',
    alts: [/misc/, /other/],
  },
  {
    status: 'dom',
    alts: [/^dom/, /custom/],
  },
  {
    status: 'media',
    alts: [/media/, /realtime/],
  },
  {
    status: 'input',
    alts: [/input/],
  },
  {
    status: 'graphic',
    alts: [/graphic/, /svg/, /canvas/],
  },
  {
    status: 'js',
    alts: [/script$/, /^js/],
  },
  {
    status: 'sec',
    alts: [/security/],
  },
  {
    status: 'net',
    alts: [/network/, /connect/],
  },
  {
    status: 'css',
    alts: [/^css/, /style/],
  },
  {
    status: 'storage',
    alts: [/offline/, /storage/, /file/],
  },
  {
    status: 'perf',
    alts: [/performance/],
  },
  {
    status: 'input',
    alts: [/^dom/, /html5/],
  },
];

export default function resolve(test) {
  for (let i = 0; i < mapCategory.length; i++) {
    const alts = mapCategory[i].alts;
    for (let j = 0; j < alts.length; j++) {
      if (alts[j].test(test.toLowerCase())) {
        return mapCategory[i].status;
      }
    }
  }
  return mapCategory[0].status;
}
