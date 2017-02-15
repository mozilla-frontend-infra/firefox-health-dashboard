import Telemetry from 'telemetry-next-node';

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

export async function getEvolution(metric, version, channel = 'release', filter = {}, useSubmissionDate = false) {
  await init();
  return new Promise((resolve) => {
    Telemetry.getEvolution(
      channel,
      String(parseInt(version, 10)),
      metric,
      filter,
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

export async function getSummary(metric, version, channel = 'release', filter = {}) {
  let evolution = null;
  if (!Array.isArray(metric)) {
    metric = [metric];
  }
  for (const entry of metric) {
    evolution = await getEvolution(entry, version, channel, filter);
    if (evolution) {
      break;
    }
  }
  if (!evolution) {
    return null;
  }
  const hist = evolution.histogram();
  return {
    mean: hist.mean(),
    90: hist.percentile(90),
    95: hist.percentile(95),
    99: hist.percentile(99),
  };
}
