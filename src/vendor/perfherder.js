/* eslint-disable linebreak-style */
/* eslint-disable camelcase */
import { toQueryString } from './convert';
import { missing, toArray, first } from './utils';
import { frum, toPairs } from './queryOps';
import { TREEHERDER } from './perf-goggles';
import fetchJson from '../utils/fetchJson';
import { jx } from './expressions';

// WHAT ARE THE SIGNATURES OF THE loadtime?
// GET ALL SIGNATURES FOR framework=10
// JOIN SIGNATURES WITH OPTIONS HASH
// GET ALL SIGNATURES FROM framework=X, AS PROMISES,
//     ADD TO TABLE,
//     HOW TO KNOW WHAT IS MISSING framework?
// PULL DATA FOR WANTED SIGNATURES; ADD TO TABLE
// HOW DO WE KNOW WHAT IS MISSING?
//    (signature, timerange) PAIRS?
//     week, 2week, month, 3months, 6months, year?
// DAILY AGGREGATE
// SET NORMALIZATION CONSTANTS

const PERFHERDER = {
  signatures: [],
};
const repository = 'mozilla-central';
const getAllOptions = (async () => {
  const response = await fetch(`${TREEHERDER}/api/optioncollectionhash/`);
  const output = await response.json();

  return frum(output)
    .map(({ option_collection_hash, options }) => [
      first(options).name,
      option_collection_hash,
    ])
    .args()
    .fromPairs();
})();
const frameworkCache = {};
const getFramework = async framework => {
  if (frameworkCache[framework] === undefined) {
    frameworkCache[framework] = (async () => {
      const url = `${TREEHERDER}/api/project/${repository}/performance/signatures/?${toQueryString(
        {
          framework,
          subtests: 1,
        }
      )}`;
      const rawData = await fetchJson(url);
      // ADD OPTION SIGNATURES
      const lookup = await getAllOptions;
      const clean = toPairs(rawData)
        .map((meta, signature) => ({
          signature,
          suite: meta.suite,
          test: meta.test,
          options: lookup[meta.option_collection_hash],
          platform: meta.machine_platform,
          parent: meta.parent_signature,
          id: meta.id,
          framework: meta.framework_id,
        }))
        .toArray();

      PERFHERDER.signatures.push(...clean);
    })();
  }

  await frameworkCache[framework];
};

const getSignatures = async (framework, condition) => {
  await Promise.all(toArray(framework).map(getFramework));

  return frum(PERFHERDER.signatures).filter(jx(condition));
};

const dataCache = {};
const getDataBySignature = async signatures => {
  // SCHEDULE ANY MISSING SIGNATURES
  frum(signatures)
    .filter(s => missing(dataCache[s]))
    .chunk(20)
    .forEach(sigs => {
      // GET ALL SIGNATURES IN THE CHUNK
      const getData = (async () => {
        const url = `${TREEHERDER}/api/project/${repository}/performance/data/?${toQueryString(
          {
            signatures: sigs,
          }
        )}`;

        return fetchJson(url);
      })();

      // EACH dataCache IS A PROMISE TO THE SPECIFIC DATA
      frum(sigs).forEach(signature => {
        dataCache[signature] = (async () => ({
          signature,
          data: (await getData)[signature],
        }))();
      });
    });

  return Promise.all(signatures.map(s => dataCache[s]).toArray());
};

const getData = async (framework, condition) => {
  const signatures = await getSignatures(framework, condition);

  return getDataBySignature(frum(signatures).select('signature'));
};

export { getSignatures, getData };
