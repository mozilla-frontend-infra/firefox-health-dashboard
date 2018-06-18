const klarTargets = {
  abcnews: 7.036363636,
  wikiaFandom: 4.461818182,
  buzzfeed: 6.087272727,
  yelp: 5.836363636,
  eurosport: 8.236363636,
  ranker: 3.610909091,
};

const graphDefaults = {
  api: 'android/klar',
  legend: ['focus (WV)', 'klar (GV)'],
  target: 'GV within 20% of WV',
  width: 600,
  height: 300,
  keys: ['focus', 'klar'],
  checkStatus: true,
  targetLine: 'klar',
};

const configuration = {
  abcnews: {
    ...graphDefaults,
    query: { site: 'abcnews.go.com' },
    title: 'abcnews.go.com',
    baselines: [{ value: klarTargets.abcnews, label: '+20%' }],
    targetValue: klarTargets.abcnews,
  },
  wikiaFandom: {
    ...graphDefaults,
    query: { site: 'wikia-fandom' },
    title: 'wikia/fandom',
    baselines: [{ value: klarTargets.wikiaFandom, label: '+20%' }],
    targetValue: klarTargets.wikiaFandom,
  },
  buzzfeed: {
    ...graphDefaults,
    query: { site: 'buzzfeed' },
    title: 'buzzfeed',
    baselines: [{ value: klarTargets.buzzfeed, label: '+20%' }],
    targetValue: klarTargets.buzzfeed,
  },
  yelp: {
    ...graphDefaults,
    query: { site: 'yelp.de' },
    title: 'yelp.de',
    baselines: [{ value: klarTargets.yelp, label: '+20%' }],
    targetValue: klarTargets.yelp,
  },
  eurosport: {
    ...graphDefaults,
    query: { site: 'eurosport.eu' },
    title: 'eurosport.eu',
    baselines: [{ value: klarTargets.eurosport, label: '+20%' }],
    targetValue: klarTargets.eurosport,
  },
  ranker: {
    ...graphDefaults,
    query: { site: 'm.ranker.com' },
    title: 'm.ranker.com',
    baselines: [{ value: klarTargets.ranker, label: '+20%' }],
    targetValue: klarTargets.ranker,
  },
};

export default configuration;
