/* eslint-disable camelcase */
import { toQueryString } from './convert';
import { missing, toArray, first } from './utils';
import { selectFrom, toPairs } from './vectors';
import { TREEHERDER } from './perf-goggles';
import fetchJson from '../utils/fetchJson';
import { jx } from './jx/expressions';

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

  return selectFrom(output)
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

  return selectFrom(PERFHERDER.signatures).filter(jx(condition));
};

const dataCache = {};
const getDataBySignature = async metadatas => {
  // SCHEDULE ANY MISSING SIGNATURES
  selectFrom(metadatas)
    .filter(({ signature }) => missing(dataCache[signature]))
    .chunk(20)
    .forEach(chunkOfMetas => {
      // GET ALL SIGNATURES IN THE CHUNK
      const getData = (async () => {
        const url = `${TREEHERDER}/api/project/${repository}/performance/data/?${toQueryString(
          {
            signatures: chunkOfMetas.select('signature'),
          }
        )}`;

        return fetchJson(url);
      })();

      // EACH dataCache IS A PROMISE TO THE SPECIFIC DATA
      selectFrom(chunkOfMetas).forEach(meta => {
        dataCache[meta.signature] = (async () =>
          (await getData)[meta.signature].map(({ value, push_timestamp }) => ({
            value,
            push_timestamp,
            ...meta,
          })))();
      });
    });

  return Promise.all(toArray(metadatas).map(m => dataCache[m.signature]));
};

const getData = async (framework, condition) => {
  const signatures = await getSignatures(framework, condition);
  const output = await getDataBySignature(signatures);

  return selectFrom(output).flatten();
};

export { getSignatures, getData };
