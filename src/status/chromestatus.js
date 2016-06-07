import Debug from 'debug';
import { sortBy } from 'lodash';
import fetchJson from '../fetch/json';
const debug = new Debug('chromestatus');

const base = 'https://www.chromestatus.com/features.json';

const mapStatus = [
  {
    status: 'not-planned',
    alts: [/^no/],
  },
  {
    status: 'considered',
    alts: [/proposed/, /consider/],
  },
  {
    status: 'in-development',
    alts: [/develop/, /experiment/, /preview/, /behind/],
  },
  {
    status: 'shipped',
    alts: [/enabled/, /shipped/, /done/, /prefix/, /partial/],
  },
];

function resolveStatus(test) {
  for (let i = 0; i < mapStatus.length; i++) {
    const alts = mapStatus[i].alt;
    for (let j = 0; j < alts.length; j++) {
      if (alts[j].test(test)) {
        return mapStatus[i].status;
      }
    }
  }
  debug('Could not map status `%s`', test);
  return mapStatus[0].status;
}

export async function getChromePopular() {
  let features = (await fetchJson(base))
    .filter(({ web_dev_view }) => {
      return web_dev_view && web_dev_view.value <= 2;
    });
  features = sortBy(features, 'updated', (date) => new Date(date));
  return features.map(({
    name,
    id,
    impl_status_chrome,
    ff_views,
    ie_views,
  }) => {
    return {
      id,
      name,
      status: {
        chrome: resolveStatus(impl_status_chrome),
        ff: resolveStatus(ff_views.text),
        ie: resolveStatus(ie_views.text),
      },
    };
  });
}
