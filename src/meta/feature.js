import browserslist from 'browserslist';

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

export function resolveCategory(test) {
  for (let i = 0; i < mapCategory.length; i += 1) {
    const alts = mapCategory[i].alts;
    for (let j = 0; j < alts.length; j += 1) {
      if (alts[j].test(test.toLowerCase())) {
        return mapCategory[i].status;
      }
    }
  }
  return mapCategory[0].status;
}

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

export function resolveStatus(test) {
  if (!test) {
    return mapStatus[0].status;
  }
  for (let i = 0; i < mapStatus.length; i += 1) {
    const alts = mapStatus[i].alts;
    for (let j = 0; j < alts.length; j += 1) {
      if (alts[j].test(test.toLowerCase())) {
        return mapStatus[i].status;
      }
    }
  }
  return mapStatus[0].status;
}

export function extractLatestPlatforms() {
  return browserslist("> 1%, last 1 version").reduce((result, str) => {
    const [platform, version] = str.split(/\s+/);
    result[platform] = +version;
    return result;
  }, {});
}

export const latestPlatforms = extractLatestPlatforms();

export const platforms = ['firefox', 'chrome', 'ie', 'safari'];

export function scoreFeature(feature) {
  feature.completeness = 0;
  feature.recency = 0;
  platforms.forEach((platform) => {
    const factor = /firefox|chrome/.test(platform) ? 3 : 0;
    const entry = feature[platform];
    const latest = latestPlatforms[platform];
    const diff = latest - entry.version;
    switch (entry.status) {
      case 'shipped':
        if (entry.version) {
          if (diff <= factor) {
            if (factor) {
              feature.recency += factor / (factor - diff) || 0;
            } else {
              feature.recency += 1;
            }
          }
        }
        feature.completeness += 1;
        break;
      case 'in-development':
        feature.recency += diff < 0 ? 1 : 0;
        feature.completeness += 0.5;
        break;
      case 'under-consideration':
        feature.completeness += 0.25;
        break;
      default:
    }
  });
  return feature;
}
