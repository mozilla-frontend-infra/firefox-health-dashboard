/* global fetch */
import percentile from 'aggregatejs/percentile';

const TREEHERDER = 'https://treeherder.mozilla.org';
const PROJECT = 'mozilla-central';
const NINENTY_DAYS = 90 * 24 * 60 * 60;
const signaturesUrl = (project = PROJECT) =>
  `${TREEHERDER}/api/project/${project}/performance/signatures`;
const subtests = async signatureHash => {
  const url = `${signaturesUrl()}/?parent_signature=${signatureHash}`;

  return (await fetch(url)).json();
};

const parentInfo = async (suite, platform, option = 'pgo') => {
  const [options, signatures] = await Promise.all([
    await (await fetch(`${TREEHERDER}/api/optioncollectionhash/`)).json(),
    await (await fetch(
      `${signaturesUrl()}/?framework=1&platform=${platform}&subtests=0`
    )).json(),
  ]);
  // Create a structure with only jobs matching the suite, make
  // option_collection_hash be the key and track the signatureHash as a property
  const suites = Object.keys(signatures).reduce((res, signatureHash) => {
    const value = signatures[signatureHash];

    if (value.suite === suite) {
      res[value.option_collection_hash] = {
        parentSignatureHash: signatureHash,
        test: suite, // All subtests have this entry as a uid
        ...value,
      };

      return res;
    }

    return res;
  }, {});
  const result = [];

  // Remove from suites any suite that does not match the wanted 'option'
  options.forEach(elem => {
    if (elem.option_collection_hash in suites) {
      // XXX: As far as I'm concerned I've always seen 1 element in this array
      if (elem.options[0].name === option) {
        result.push(suites[elem.option_collection_hash]);
      } else {
        delete suites[elem.option_collection_hash];
      }
    }
  });

  if (result.length !== 1) {
    throw Error('We should have an array of 1');
  }

  return result[0];
};

const dataUrl = (tests, project = PROJECT, interval = NINENTY_DAYS) => {
  const signatureIds = Object.values(tests).map(v => v.id);
  let baseDataUrl = `${TREEHERDER}/api/project/${project}/performance/data/?framework=1&interval=${interval}`;

  baseDataUrl += `&${signatureIds.map(id => `signature_id=${id}`).join('&')}`;

  return baseDataUrl;
};

const perherderGraphUrl = (
  signatureIds,
  platform,
  project = PROJECT,
  timerange = NINENTY_DAYS
) => {
  let baseDataUrl = `${TREEHERDER}/perf.html#/graphs?timerange=${timerange}`;

  baseDataUrl += `&${signatureIds
    .map(id => `series=${project},${id},1,1`)
    .join('&')}`;

  return baseDataUrl;
};

export const adjustedData = (data, percentileThreshold, measure = 'value') => {
  let transformedData = data;

  if (percentileThreshold < 100) {
    const threshold = percentile(
      data.map(d => d[measure]),
      percentileThreshold / 100.0
    );

    transformedData = data.filter(d => d[measure] < threshold);
  }

  return transformedData.map(datum => ({
    ...datum,
    datetime: new Date(datum.push_timestamp * 1000),
  }));
};

const benchmarkData = async ({
  suite,
  platform,
  percentileThreshold = 100,
  includeParentData = true,
}) => {
  const parent = await parentInfo(suite, platform);
  const info = await subtests(parent.parentSignatureHash);

  if (includeParentData) {
    info[parent.parentSignatureHash] = parent;
  }

  const signatureIds = Object.values(info).map(v => v.id);
  // This is a link to a Perfherder graph with all subtests
  const perfherderUrl = perherderGraphUrl(signatureIds);
  // The data contains an object where each key represents a subtest
  // Each data point of that subtest takes the form of:
  // {
  //     job_id: 162620134,
  //     signature_id: 1659462,
  //     id: 414057864,
  //     push_id: 306862,
  //     value: 54.89
  // }
  const dataPoints = await (await fetch(dataUrl(info))).json();
  const data = {};

  Object.keys(dataPoints).forEach(subtestHash => {
    data[subtestHash] = {
      meta: {
        url: perherderGraphUrl([subtestHash]),
        ...info[subtestHash], // Original object from Perfherder
      },
      data: adjustedData(dataPoints[subtestHash], percentileThreshold),
    };
  });

  return { perfherderUrl, data, parentSignature: parent.parentSignatureHash };
};

export default benchmarkData;
