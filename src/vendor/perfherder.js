/* eslint-disable camelcase */
import { fetchJson, URL } from './requests';
import { exists, first, missing, toArray } from './utils';
import { selectFrom, toPairs } from './vectors';
import jx from './jx/expressions';
import { Log } from './logs';

const DEBUG = false;
const PERFHERDER = {
  signatures: [],
};
const TREEHERDER = 'https://treeherder.mozilla.org';
const getAllOptions = (async () => {
  const output = await fetchJson(
    URL({ path: [TREEHERDER, 'api/optioncollectionhash/'] })
  );

  return selectFrom(output)
    .map(({ option_collection_hash, options }) => [
      first(options).name,
      option_collection_hash,
    ])
    .args()
    .fromPairs();
})();
const frameworkCache = {};
const getFramework = async combo => {
  const { repo, framework } = combo;
  const comboString = JSON.stringify(combo);

  if (frameworkCache[comboString] === undefined) {
    frameworkCache[comboString] = (async () => {
      const url = URL({
        path: [TREEHERDER, 'api/project', repo, 'performance/signatures/'],
        query: { framework, subtests: 1 },
      });
      const rawData = await fetchJson(url);
      // ADD OPTION SIGNATURES
      const lookup = await getAllOptions;
      const clean = toPairs(rawData)
        .map((meta, signature) => {
          const { suite, test, lower_is_better } = meta;
          let lowerIsBetter = true;

          if (lower_is_better === undefined) {
            if (
              [
                'raptor-speedometer',
                'raptor-stylebench',
                'raptor-wasm',
                'raptor-motionmark',
                'raptor-sunspider',
                'raptor-webaudio',
                'raptor-unity',
              ].some(prefix => suite.startsWith(prefix))
            ) {
              lowerIsBetter = false;
            } else if (
              [
                'raptor-tp6',
                'raptor-firefox',
                'raptor-chrome',
                'raptor-google',
                'raptor-assorted-dom',
                'tp4',
                'tp5',
              ].some(prefix => suite.startsWith(prefix))
            ) {
              lowerIsBetter = true;
            } else {
              if (DEBUG) {
                Log.note('Do not have direction for {{suite}}', { suite });
              }

              lowerIsBetter = false;
            }
          }

          return {
            signature,
            suite,
            test: test === suite ? null : test,
            lowerIsBetter,
            options: lookup[meta.option_collection_hash],
            extraOptions: toArray(meta.extra_options).sort(),
            platform: meta.machine_platform,
            parent: meta.parent_signature,
            id: meta.id,
            framework: meta.framework_id,
            repo,
          };
        })
        .toArray();

      PERFHERDER.signatures.push(...clean);
    })();
  }

  await frameworkCache[comboString];
};

/*
return an array of {repo, framework} objects
 */
const findCombo = expression =>
  toPairs(expression)
    .map((v, k) => {
      if (k === 'or' || k === 'and') {
        return selectFrom(v)
          .map(findCombo)
          .flatten()
          .groupBy(['repo', 'framework'])
          .map(first);
      }

      const { repo, framework } = v;

      if (exists(framework)) {
        if (missing(repo)) {
          Log.error(
            'expecting {{expression}} to have {framework, repo} paired',
            { expression }
          );
        }

        return [{ repo, framework }];
      }

      if (exists(repo)) {
        Log.error('expecting {{expression}} to have {framework, repo} paired', {
          expression,
        });
      }

      return [];
    })
    .flatten()
    .groupBy(['repo', 'framework'])
    .map(first)
    .toArray();
const getSignatures = async condition => {
  // find out what frameworks to extract
  const combos = findCombo(condition);

  if (missing(combos)) {
    Log.error('expecting to find a framework in the condtion: {{condition}}', {
      condition,
    });
  }

  await Promise.all(combos.map(getFramework));

  Log.note('scan {{num}} signatures', { num: PERFHERDER.signatures.length });

  return PERFHERDER.signatures.filter(jx(condition));
};

const dataCache = {}; // MAP FROM SIGNATURE TO PROMISE OF DATA
const getDataBySignature = async metadatas => {
  // SCHEDULE ANY MISSING SIGNATURES
  selectFrom(metadatas)
    .groupBy('repo')
    .forEach((sigs, repo) => {
      selectFrom(sigs)
        .filter(({ signature }) => missing(dataCache[signature]))
        .chunk(40)
        .forEach(chunkOfMetas => {
          // GET ALL SIGNATURES IN THE CHUNK
          const getData = (async () => {
            const url = URL({
              path: [TREEHERDER, 'api/project', repo, 'performance/data/'],
              query: { signatures: chunkOfMetas.select('signature') },
            });

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
    });

  return Promise.all(toArray(metadatas).map(m => dataCache[m.signature]));
};

const getData = async condition => {
  const signatures = await getSignatures(condition);

  return getDataBySignature(signatures);
};

export { getAllOptions, getSignatures, getData, TREEHERDER };
