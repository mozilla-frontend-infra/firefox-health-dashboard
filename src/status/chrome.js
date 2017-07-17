import { flow, find, findKey, filter, map } from 'lodash/fp';
import caniuse from 'caniuse-db/data.json';
import browserslist from 'browserslist';
import fetchJson from '../fetch/json';
import { resolveStatus, resolveCategory, scoreFeature } from '../meta/feature';
import { getRelease } from '../bz/release';

const base = 'https://www.chromestatus.com/features.json';
const firefoxBase = 'https://platform-status.mozilla.org/api/status';

export async function getChromePopular() {
  const firefoxStatus = await fetchJson(firefoxBase);
  const chromeStatus = await fetchJson(base);
  const latest = browserslist.queries.lastVersions.select(1).reduce((result, str) => {
    const [platform, version] = str.split(/\s+/);
    result[platform] = +version;
    return result;
  }, {});
  const queuedIds = [];
  const features = flow(
    filter(({ browsers }) => {
      return browsers.webdev && browsers.webdev.view.val <= 2;
    }),
    filter(({ browsers }) => {
      return (
        !/opposed/i.test(browsers.ff.view.text) &&
        !/pursuing|deprecat|removed/i.test(browsers.chrome.status.text)
      );
    }),
    map((chromestatus) => {
      const { chrome, ff, edge, safari } = chromestatus.browsers;
      const result = {
        id: chromestatus.id,
        link: `https://www.chromestatus.com/feature/${chromestatus.id}`,
        name: chromestatus.name,
        category: resolveCategory(chromestatus.category),
        chrome: {
          status: resolveStatus(chrome.status.text),
          alt: chrome.status.text,
          updated: new Date(chrome.updated).valueOf(),
        },
        firefox: {
          status: resolveStatus(ff && ff.view.text),
          alt: ff && ff.view.text,
        },
        ie: {
          status: resolveStatus(edge && edge.view.text),
          alt: edge && edge.view.text,
        },
        safari: {
          status: resolveStatus(safari && safari.view.text),
          alt: safari && safari.view.text,
        },
      };
      if (result.chrome.status === 'shipped' && chrome.milestone_str) {
        result.chrome.version = chrome.milestone_str;
        if (result.chrome.version > latest.chrome) {
          result.chrome.status = 'in-development';
        }
      }
      const firefoxRef = find({ chrome_ref: chromestatus.id })(firefoxStatus);
      if (firefoxRef) {
        result.name = firefoxRef.title;
        result.firefox.ref = firefoxRef.slug;
        result.firefox.status = resolveStatus(firefoxRef.firefox_status);
        result.safari.status = resolveStatus(firefoxRef.webkit_status);
        result.ie.status = resolveStatus(firefoxRef.ie_status);
        if (firefoxRef.firefox_version) {
          result.firefox.version = firefoxRef.firefox_version;
        }
      } else if (/show_bug\.cgi/.test((ff && ff.view.url) || '')) {
        const id = ff.view.url.match(/id=([^$#]+)/)[1];
        queuedIds.push({
          id: id,
          feature: result,
        });
      }
      let caniuseRef = findKey({ chrome_id: chromestatus.id })(caniuse.data);
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
    }),
  )(chromeStatus);

  (await getRelease(queuedIds.map(({ id }) => id))).forEach(({ id, version }) => {
    if (version) {
      const ref = find({ id: String(id) })(queuedIds);
      if (ref) {
        if (ref.feature.firefox.status !== 'shipped') {
          ref.feature.firefox.bz = true;
        }
        ref.feature.firefox.status = version > latest.firefox ? 'in-development' : 'shipped';
        ref.feature.firefox.version = version;
      }
    }
  });

  return flow(map(scoreFeature), filter(({ completeness }) => completeness >= 0.5))(features);
}
