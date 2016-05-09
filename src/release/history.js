import getVersions from './versions';
import { getReleaseDate } from './archive';

export default async function getHistory(channel = 'release', tail = 10) {
  const versions = await getVersions();
  const start = parseInt(versions[channel]);
  const lookup = [];
  for (let i = 0; i < tail; i++) {
    const release = await getReleaseDate(start - i, channel);
    lookup.push({
      version: release.version,
      date: release.date
    });
  }
  return lookup;
}
