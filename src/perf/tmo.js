import Telemetry from 'telemetry-next-node';
import getVersions from '../release/versions';
import fetchJson from '../fetch/json';

Telemetry.getJSON = async (url, callback) => {
  const response = await fetchJson(url, { ttl: 'day' });
  callback(response);
};

let nextTelemetry = 0;
let initResolve = null;
function init() {
  if (Date.now() < nextTelemetry) {
    return Promise.resolve();
  }
  if (!initResolve) {
    console.log('Requesting init');
    initResolve = new Promise((resolve) => {
      Telemetry.init(() => {
        console.log('Init');
        initResolve = null;
        nextTelemetry = Date.now() + 3600;
        resolve();
      });
    });
  }
  return initResolve;
}

export async function getEvolution(query) {
  const {
    metric,
    channel = 'release',
    useSubmissionDate = true,
  } = query;
  let {
    version,
  } = query;
  delete query.metric;
  delete query.version;
  delete query.channel;
  delete query.useSubmissionDate;
  if (!version) {
    const versions = await getVersions();
    version = versions[channel];
  }
  await init();
  return new Promise((resolve) => {
    console.log(channel, version, metric, query);
    Telemetry.getEvolution(
      channel,
      String(parseInt(version, 10)),
      metric,
      query,
      useSubmissionDate,
      (evolutionMap) => {
        const keys = Object.keys(evolutionMap);
        if (keys.length > 1) {
          resolve(keys.map((key) => {
            console.log(key);
            return {
              key: key,
              evolution: evolutionMap[key].sanitized(),
            };
          }));
        } else if (evolutionMap['']) {
          resolve(evolutionMap[''].sanitized());
        } else {
          resolve(null);
        }
      });
  });
}

export async function getSummary(query) {
  const evolution = await getEvolution(query);
  const hist = evolution.histogram();
  return {
    mean: hist.mean(),
    median: hist.percentile(50),
    90: hist.percentile(90),
    95: hist.percentile(95),
    99: hist.percentile(99),
  };
}
