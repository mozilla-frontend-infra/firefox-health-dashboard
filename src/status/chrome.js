import { flow, find, findKey, filter, map } from 'lodash/fp';
import caniuse from 'caniuse-db/data.json';
import fetchJson from '../fetch/json';
import resolveStatus from '../meta/feature-status';
import resolveCategory from '../meta/feature-category';
import { getRelease } from '../bz/release';

const base = 'https://www.chromestatus.com/features.json';
const firefoxBase = 'https://platform-status.mozilla.org/api/status';

export async function getChromePopular() {
  const firefoxStatus = await fetchJson(firefoxBase);
  const chromeStatus = await fetchJson(base);
  const queuedIds = [];
  const features = flow(
    filter(({ web_dev_views }) => {
      return web_dev_views && web_dev_views.value <= 2;
    }),
    filter(({ ff_views }) => {
      return ff_views && resolveStatus(ff_views.text) !== 'shipped';
    }),
    map((chrome) => {
      const result = {
        id: chrome.id,
        link: `https://www.chromestatus.com/feature/${chrome.id}`,
        name: chrome.name,
        category: resolveCategory(chrome.category),
        chrome: {
          status: resolveStatus(chrome.impl_status_chrome),
          alt: chrome.impl_status_chrome,
          updated: new Date(chrome.updated).valueOf(),
        },
        firefox: {
          status: resolveStatus(chrome.ff_views.text),
          alt: chrome.ff_views.text,
        },
        ie: {
          status: resolveStatus(chrome.ie_views.text),
          alt: chrome.ie_views.text,
        },
        safari: {
          status: resolveStatus(chrome.safari_views.text),
          alt: chrome.safari_views.text,
        },
      };
      if (result.chrome.status === 'shipped' && chrome.shipped_milestone) {
        result.chrome.version = chrome.shipped_milestone;
      }
      const firefoxRef = find({ chrome_ref: chrome.id })(firefoxStatus);
      if (firefoxRef) {
        result.name = firefoxRef.title;
        result.firefox.ref = firefoxRef.slug;
        result.firefox.status = resolveStatus(firefoxRef.firefox_status);
        result.safari.status = resolveStatus(firefoxRef.webkit_status);
        result.ie.status = resolveStatus(firefoxRef.ie_status);
        if (firefoxRef.firefox_version) {
          result.firefox.version = firefoxRef.firefox_version;
        }
      } else {
        if (/show_bug\.cgi/.test(chrome.ff_views_link || '')) {
          const id = chrome.ff_views_link.match(/id=(\d+)/)[1];
          queuedIds.push({
            id: id,
            feature: result,
          });
        }
      }
      let caniuseRef = findKey({ chrome_id: chrome.id })(caniuse.data);
      if (!caniuseRef && firefoxRef && firefoxRef.caniuse_ref) {
        caniuseRef = firefoxRef.caniuse_ref;
      }
      if (caniuseRef) {
        const ref = caniuse.data[caniuseRef];
        result.caniuse = {
          ref: caniuseRef,
          usage: ref.usage_perc_y + ref.usage_perc_a,
        };
      }
      return result;
    })
  )(chromeStatus);

  (await getRelease(queuedIds.map(({ id }) => id)))
    .forEach(({ id, version }) => {
      if (version) {
        const ref = find({ id: String(id) })(queuedIds);
        if (ref) {
          if (!ref.feature.firefox.status) {
            ref.feature.firefox.bz = true;
          }
          ref.feature.firefox.status = 'shipped';
          ref.feature.firefox.version = version;
        }
      }
    });

  return flow(
    map((feature) => {
      feature.score = ['chrome', 'firefox', 'ie', 'safari'].filter((browser) => {
        return feature[browser].status === 'in-development'
          || feature[browser].status === 'shipped';
      }).length;
      return feature;
    }),
    filter(({ score }) => score > 0)
  )(features);
}
