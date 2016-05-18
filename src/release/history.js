// import getVersions from './versions';
import sortBy from 'lodash/sortBy';
import { getArchive, getReleaseDate } from './archive';

export default async function getHistory(channel = 'release', product = 'firefox', tail = 30) {
  const versions = await getArchive(channel, product);
  const lookup = [];
  for (let i = 0; i < tail; i++) {
    const release = await getReleaseDate(versions[i], channel, product);
    if (release.date) {
      lookup.push({
        version: release.version,
        date: release.date
      });
    }
  }
  sortBy(lookup, 'date', (a) => Date.parse(a));
  return lookup;
}
