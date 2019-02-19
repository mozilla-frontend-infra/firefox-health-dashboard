import 'isomorphic-fetch';
import isEqual from 'lodash.isequal';
import { stringify } from 'query-string';
import { frum, toPairs } from '../../utils/queryOps';
import { Signal } from '../../utils/signal';

export const TREEHERDER = 'https://treeherder.mozilla.org';
const PROJECT = 'mozilla-central';
const DEFAULT_TIMERANGE = 14 * 24 * 3600;
const objectToURI = obj =>
  toPairs(obj)
    .map((value, key) => `${key}=${encodeURIComponent(value)}`)
    .concatenate('&');

export const signaturesUrl = (project = PROJECT) =>
  `${TREEHERDER}/api/project/${project}/performance/signatures/`;

const dataPointsEndpointUrl = (project = PROJECT) =>
  `${TREEHERDER}/api/project/${project}/performance/data/`;
const platformSuitesUrl = ({ project, ...params }) =>
  `${TREEHERDER}/api/project/${project}/performance/signatures/?${objectToURI(
    params
  )}`;

export const perfDataUrls = (
  { frameworkId, project },
  signatureIds,
  timeRange
) => {
  const url = dataPointsEndpointUrl(project);
  const baseParams = stringify({
    framework: frameworkId,
    interval: timeRange,
  });

  // To guarantee order for tests
  signatureIds.sort();
  const urls = [];

  for (let i = 0; i < signatureIds.length / 100; i += 1) {
    const signaturesParams = stringify({
      signature_id: signatureIds.slice(i * 100, (i + 1) * 100),
    });

    urls.push(`${url}?${baseParams}&${signaturesParams}`);
  }

  return urls;
};

const tranformData = data =>
  data.map(datum => ({
    datetime: new Date(datum.push_timestamp * 1000),
    ...datum,
  }));
// The data contains an object where each key represents a subtest
// Each data point of that subtest takes the form of:
// {
//     job_id: 162620134,
//     signature_id: 1659462,
//     id: 414057864,
//     push_id: 306862,
//     value: 54.89
// }
const fetchPerfData = async (seriesConfig, signatureIds, timeRange) => {
  const dataPoints = {};

  await Promise.all(
    perfDataUrls(seriesConfig, signatureIds, timeRange).map(async url => {
      const data = await (await fetch(url)).json();

      Object.keys(data).forEach(hash => {
        if (!dataPoints[hash]) {
          dataPoints[hash] = [];
        }

        dataPoints[hash] = dataPoints[hash].concat(tranformData(data[hash]));
      });
    })
  );

  return dataPoints;
};

const perfherderGraphUrl = (
  { project = PROJECT, frameworkId },
  signatureIds,
  timeRange = DEFAULT_TIMERANGE
) => {
  let baseDataUrl = `${TREEHERDER}/perf.html#/graphs?timerange=${timeRange}`;

  baseDataUrl += `&${signatureIds
    .sort()
    .map(id => `series=${project},${id},1,${frameworkId}`)
    .join('&')}`;

  return baseDataUrl;
};

const queryAllTreeherderOptions = async () => {
  const response = await fetch(`${TREEHERDER}/api/optioncollectionhash/`);

  return response.json();
};

const transformOptionCollectionHash = optionCollectionHash => {
  const options = {};

  optionCollectionHash.forEach(optionCollection => {
    // What optionCollection looks like:
    // {"options":[{"name":"debug"},{"name":"memleak"}],
    //  "option_collection_hash":"531e7f974f8dab5d4d8dfe344a0219a5b1184d20"},
    // and we wanted "options" to look like this instead:
    // "options":["debug", "memleak"]
    options[
      optionCollection.option_collection_hash
    ] = optionCollection.options.map(keys => keys.name);
  });

  return options;
};

const treeherderOptions = async () => {
  const optionCollectionHash = await queryAllTreeherderOptions();

  return transformOptionCollectionHash(optionCollectionHash);
};

const querySubtests = async ({ project }, parentHash) => {
  const response = await fetch(
    `${signaturesUrl(project)}?parent_signature=${parentHash}`
  );

  return response.json();
};

const internalAllPlatformSignatures = {};

async function allPlatformSignatures({ project }) {
  const result = internalAllPlatformSignatures[project];

  if (!result) {
    internalAllPlatformSignatures[project] = Promise.all([
      async () => {
        const response = await fetch(
          platformSuitesUrl({ project, framework: 10 })
        );
        const output = toPairs(response.json())
          .map((jobSignature, signatureHash) => ({
            parentSignatureHash: signatureHash,
            ...jobSignature,
            test:
              jobSignature.suite === jobSignature.test
                ? null
                : jobSignature.test,
          }))
          .toArray();

        return output;
      },
    ]);
  }

  return internalAllPlatformSignatures[project];
}

const signaturesForPlatformSuite = async ({ project, suite, test }) => {
  const platformSignatures = (await allPlatformSignatures({ project }))[0];
  const output = frum(platformSignatures)
    .filter(
      jobSignature => jobSignature.suite === suite && jobSignature.test === test
    )
    .toArray();

  return output;
};

const findParentSignatureInfo = (
  { option = 'pgo', extraOptions },
  signatures,
  options
) => {
  const result = [];

  frum(signatures).forEach(hash => {
    const signature = signatures[hash];
    const optionCollection = options[signature.option_collection_hash];

    if (optionCollection && optionCollection.includes(option)) {
      if (extraOptions && extraOptions.length > 0) {
        if (isEqual(signature.extra_options, extraOptions)) {
          result.push(signature);
        }
      } else {
        result.push(signature);
      }
    }
  });

  if (result.length !== 1) {
    return undefined;
  }

  return result[0];
};

const parentSignatureInfo = async seriesConfig => {
  const [signatures, options] = await Promise.all([
    signaturesForPlatformSuite(seriesConfig),
    treeherderOptions(seriesConfig.project),
  ]);

  return findParentSignatureInfo(seriesConfig, signatures, options);
};

const fetchSubtestsData = async (seriesConfig, subtestsInfo, timeRange) => {
  const signatureIds = Object.values(subtestsInfo).map(v => v.id);
  const subtestsData = {};
  const dataPoints = await fetchPerfData(seriesConfig, signatureIds, timeRange);

  Object.keys(dataPoints).forEach(subtestHash => {
    subtestsData[subtestHash] = {
      data: dataPoints[subtestHash],
      meta: subtestsInfo[subtestHash], // Original object from Perfherder
      perfherderUrl: perfherderGraphUrl(seriesConfig, [subtestHash]),
    };
  });

  return subtestsData;
};

const queryPerformanceData = async (seriesConfig, options) => {
  const { includeSubtests = false, timeRange = DEFAULT_TIMERANGE } = options;
  const parentInfo = await parentSignatureInfo(seriesConfig);

  // XXX: Throw error instead
  if (!parentInfo) {
    return {};
  }

  let perfData = {};

  if (!(includeSubtests && parentInfo.has_subtests)) {
    const dataPoints = await fetchPerfData(
      seriesConfig,
      [parentInfo.id],
      timeRange
    );

    perfData = {
      [parentInfo.parentSignatureHash]: {
        data: dataPoints[parentInfo.parentSignatureHash],
        meta: parentInfo,
        perfherderUrl: perfherderGraphUrl(seriesConfig, [parentInfo.id]),
      },
    };
  } else {
    const subtestsMeta = await querySubtests(
      seriesConfig,
      parentInfo.parentSignatureHash
    );

    subtestsMeta[parentInfo.parentSignatureHash] = parentInfo;
    const subtestsData = await fetchSubtestsData(
      seriesConfig,
      subtestsMeta,
      timeRange
    );

    Object.keys(subtestsData).forEach(hash => {
      perfData[hash] = subtestsData[hash];
    });
  }

  return perfData;
};

export { queryPerformanceData };
