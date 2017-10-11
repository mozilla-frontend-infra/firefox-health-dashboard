// Module with partial logic from
// https://github.com/mozilla/telemetry-dashboard/blob/gh-pages/wrapper/telemetry-wrapper.js
// This module focuses on data manipulations rather than data plotting
import { stringify } from 'query-string';

import Telemetry from './telemetry-node';
import { getEvolution } from './tmo';
import getVersions from '../release/versions';
import TELEMETRY_CONFIG from './telemetry_config';

// This function is a copy/paste from telemetry-wrapper
const createTMOLinkForParams = (params) => {
  const url = `https://telemetry.mozilla.org/new-pipeline/${params.evoVersions ? 'evo' : 'dist'}.html#!`;

  let queryParams = stringify({
    max_channel_version: `${params.channel}%252F${params.version}`,
    sanitize: `${params.sanitize ? 1 : 0}`,
    trim: `${params.trim ? 1 : 0}`,
    use_submission_date: `${params.useSubmissionDate ? 1 : 0}`,
    measure: `${params.metric}`,
  });
  if (params.evoVersions) {
    queryParams += stringify({
      min_channel_version: `${params.channel}%252F${params.version - params.evoVersions + 1}`,
    });
  }

  if (params.filters) {
    ['os', 'application', 'e10sEnabled', 'child'].forEach(key =>
      queryParams += stringify({
        key: params.filters[key],
      }),
    );
  }

  // Special case: dashgen defaults to not filtering anything
  // but the dashes default to filtering to only Firefox Desktop
  if (!(params.filters && 'application' in params.filters)) {
    // This isn't all products, but it's close enough
    queryParams += stringify({
      product: 'Firefox!Fennec',
    });
  }

  if (params.compare) {
    queryParams += stringify({
      compare: `${params.compare}`,
    });
  }

  return `${url}?${queryParams}`;
};

// Reduced function from telemetry-wrapper
const setDefaultParams = (params) => {
  params.useSubmissionDate = params.useSubmissionDate || false;
  params.percentile = params.percentile || 50;
  return params;
};

// Partial logic from evoTime in telemetry-wrapper
const prepareDataForGraph = (params, evolutions, versions) => {
  const dateses = evolutions.map(evo => evo.dates());
  const legendLabels = versions.map(v => v.toString());
  let percentileLabel = 'median';
  if (params.percentile !== 50) {
    percentileLabel = `${params.percentile}th percentile'`;
  }
  const yLabel = percentileLabel;
  const description = evolutions[0].description;
  const valueses = evolutions.map(evo => evo.percentiles(params.percentile));
  const datas = dateses.map((dates, i) => dates.map((date, j) => {
    return {
      date: date.toISOString().substring(0, 10),
      value: valueses[i][j],
    };
  }));

  return {
    datas,
    description,
    legendLabels,
    params,
    yLabel,
  };
};

export const fetchTelemetryEvolution = async (ctx, name) => {
  await new Promise((resolve) => {
    Telemetry.init(resolve);
  });
  const channelVersions = await getVersions();
  const params = setDefaultParams(TELEMETRY_CONFIG[name]);

  const start = parseInt(channelVersions.nightly, 10);
  const endVersion = start - params.evoVersions;

  const versions = [];
  for (let version = start; version > endVersion; version -= 1) {
    versions.push(version);
  }
  const evolutionMap = await Promise.all(
    versions.map(async (version) => {
      const query = Object.assign({}, {
        metric: params.metric,
        channel: params.channel,
        filters: params.filters,
        useSubmissionDate: params.useSubmissionDate,
        version: version,
      });
      return getEvolution(query);
    }),
  );
  ctx.body = {
    identifier: name,
    graphData: prepareDataForGraph(
      params,
      // Remove evolutions that failed
      evolutionMap.filter(e => e !== null).reverse(),
      versions.reverse()),
    telemetryUrl: createTMOLinkForParams(params),
  };
};
