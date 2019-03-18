/* eslint-disable linebreak-style */
import { cache } from './promises';
import { toArray, exists, missing } from './utils';
import { frum, toPairs } from './queryOps';
import { TREEHERDER } from './perf-goggles';
import fetchJson from '../utils/fetchJson';

// WHAT ARE THE SIGNATURES OF THE loadtime?
// GET ALL SIGNATURES FOR framework=10
// JOIN SIGNATURES WITH OPTIONS HASH
// GET ALL SIGNATURES FROM framework=X, AS PROMISES, ADD TO TABLE, HOW TO KNOW WHAT IS MISSING framework?
// PULL DATA FOR WANTED SIGNATURES; ADD TO TABLE
// HOW DO WE KNOW WHAT IS MISSING?  (signature, timerange) PAIRS?  week, 2week, month, 3months, 6months, year?
// DAILY AGGREGATE
// SET NORMALIZATION CONSTANTS

const PERFHERDER = {
  signatures: [],
  data: [],
};
const getAllOptions = cache(async () => {
  const response = await fetch(`${TREEHERDER}/api/optioncollectionhash/`);

  return response.json();
});
const frameworkCache = {};
const getFramework = async framework => {
  if (frameworkCache[framework] === undefined) {
    frameworkCache[framework] = cache(async () => {
      const url = `${TREEHERDER}/api/project/${project}/performance/signatures?framework=${framework}&subtests=1`;
      const rawData = await fetchJson(url);

      // ADD OPTION SIGNATURES
      PERFHERDER.signatures.append(
        frum(rawData).join('optionsHash', await getAllOptions, 'hash')
      );
    });
  }

  await frameworkCache[framework];
};

const getSignatures = async (framework, condition) => {
  await Promise.all(toArray(framework).map(getFramework));

  return frum(PERFHERDER.signatures).where(condition);
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
        const url = `${TREEHERDER}/api/performance/summary/?${toQueryString({
          signature: sigs,
        })}`;
        const output = await fetchJson(url);
        const temp = toPairs(output);

        PERFHERDER.data.append(
          toPairs(output).map((v, signature) => ({ ...v, signature }))
        );

        return output;
      })();

      // EACH dataCache IS A PROMISE TO THE SPECIFIC DATA
      frum(sigs).forEach(s => {
        dataCache[s] = (async () => {
          const chunkData = await getData;

          return chunkData[s];
        })();
      });

      dataCache[s] = Promise;
    });
};

const getData = async (framework, condition) => {
  const signatures = await getSignatures(framework, condition);

  return getDataBySignature(frum(signatures).select('signature'));
};

export { getSignatures, getData };
