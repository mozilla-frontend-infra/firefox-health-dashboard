const mapStatus = [
  {
    status: 'nope',
    alts: [/^no/, /signal/, /unknown/],
  },
  {
    status: 'shipped',
    alts: [/^enabled/, /^shipped/, /^done/, /^prefix/, /^partial/],
  },
  {
    status: 'in-development',
    alts: [/develop/, /experiment/, /preview/, /behind/, /propos/],
  },
  {
    status: 'concerns',
    alts: [/concern/, /mixed/],
  },
  {
    status: 'under-consideration',
    alts: [/consider/, /support/],
  },
];

export default function resolve(test) {
  for (let i = 0; i < mapStatus.length; i++) {
    const alts = mapStatus[i].alts;
    for (let j = 0; j < alts.length; j++) {
      if (alts[j].test(test.toLowerCase())) {
        return mapStatus[i].status;
      }
    }
  }
  return mapStatus[0].status;
}
