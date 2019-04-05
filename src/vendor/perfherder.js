/* eslint-disable camelcase */
import { toQueryString } from './convert';
import { first, missing, toArray } from './utils';
import { selectFrom, toPairs } from './vectors';
import fetchJson from '../utils/fetchJson';
import { jx } from './jx/expressions';
import { Log } from './logs';

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
const TREEHERDER = 'https://treeherder.mozilla.org';
const REPO = 'mozilla-central';
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
      const url = `${TREEHERDER}/api/project/${REPO}/performance/signatures/?${toQueryString(
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
          test: meta.test === meta.suite ? null : meta.test,
          options: lookup[meta.option_collection_hash],
          extraOptions: toArray(meta.extra_options).sort(),
          platform: meta.machine_platform,
          parent: meta.parent_signature,
          id: meta.id,
          framework: meta.framework_id,
          repo: REPO,
        }))
        .toArray();

      PERFHERDER.signatures.push(...clean);
    })();
  }

  await frameworkCache[framework];
};

/*
return an array of frameworks
 */
const findFramework = expression =>
  toPairs(expression)
    .map((v, k) => {
      if (k === 'and' || k === 'or')
        return selectFrom(v)
          .map(findFramework)
          .flatten()
          .groupBy('.')
          .map(first);

      if (v.framework) return [v.framework];

      return [];
    })
    .flatten()
    .groupBy('.')
    .map(first)
    .toArray();
const getSignatures = async condition => {
  // find out what frameworks to extract
  const frameworks = findFramework(condition);

  if (frameworks.length === 0)
    Log.error('expecting to find a framework in the condtion: {{condition}}', {
      condition,
    });

  await Promise.all(frameworks.map(getFramework));

  Log.note('scan {{num}} signatures', { num: PERFHERDER.signatures.length });

  return PERFHERDER.signatures.filter(jx(condition));
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
        const url = `${TREEHERDER}/api/project/${REPO}/performance/data/?${toQueryString(
          {
            signatures: chunkOfMetas.select('signature'),
          }
        )}`;

        return fetchJson(url);
      })();

      // EACH dataCache IS A PROMISE TO THE SPECIFIC DATA
      selectFrom(chunkOfMetas).forEach(meta => {
        dataCache[meta.signature] = (async () => {
          const data = (await getData)[meta.signature].map(row => ({
            ...row,
            meta,
          }));

          return { meta, data };
        })();
      });
    });

  return Promise.all(toArray(metadatas).map(m => dataCache[m.signature]));
};

const getData = async condition => {
  const signatures = await getSignatures(condition);
  const output = await getDataBySignature(signatures);

  return output;
};

export { getSignatures, getData, TREEHERDER, REPO };
