import { flow, map, sortBy, toPairs, some, filter, find } from 'lodash/fp';
import caniuse from 'caniuse-db/data.json';
import fetchJson from '../fetch/json';
import { resolveCategory, latestPlatforms, scoreFeature, platforms } from '../meta/feature';

const firefoxBase = 'https://platform-status.mozilla.org/api/status';

export async function getInDevelopment() {
  const firefoxStatus = await fetchJson(firefoxBase);
  return flow(
    toPairs,
    map(([ref, feature]) => {
      const result = {
        id: ref,
        name: feature.title,
        category: resolveCategory(feature.categories.join(' ')),
        link: `http://caniuse.com/#feat=${ref}`,
        caniuse: {
          ref: ref,
          usage: feature.usage_perc_y + feature.usage_perc_a,
        },
      };
      platforms.forEach((platform) => {
        result[platform] = { status: 'nope' };
        const versions = feature.stats[platform];
        flow(
          toPairs,
          sortBy(([idx]) => parseFloat(idx)),
          some(([idx, state]) => {
            result[platform].alt = state;
            const version = parseFloat(idx);
            if (/[ay]/.test(state) && version <= latestPlatforms[platform]) {
              result[platform].status = 'shipped';
              result[platform].version = version;
              return true;
            }
            if (/[ayd]/.test(state) && !result[platform].version) {
              result[platform].status = 'in-development';
              result[platform].version = version;
            }
            return false;
          }),
        )(versions);
      });
      const firefoxRef = find({ caniuse_ref: ref })(firefoxStatus);
      if (firefoxRef) {
        result.firefox.ref = firefoxRef.slug;
      }
      return result;
    }),
    map(scoreFeature),
    filter(({ completeness }) => completeness < 4 && completeness >= 0.5),
    // filter(({ recency }) => recency >= 0.5)
  )(caniuse.data);
}
