import fetchJson from '../fetchJson';
import { toPairs, frum, first, last } from '../queryOps';

const matchUrl = profileName =>
  profileName.replace(
    /.*(http[s]?:\/\/w*\.?.*?[/]?)[)]/,
    (match, firstMatch) => firstMatch
  );
const matchShorterUrl = url =>
  url.replace(/http[s]?:\/\/w*\.?(.*?)/, (match, firstMatch) => firstMatch);
const transformedDataForMetrisGraphics = scenarios =>
  toPairs(scenarios)
    .map((data, scenarioName) => {
      const url = matchUrl(scenarioName); // multiple scenarioName have same url

      return {
        url,
        scenarioName,
        title: matchShorterUrl(url),
        data: frum(data)
          .filter(({ ms }) => ms > 0)
          .map(({ date, ms }) => ({
            date: new Date(date),
            value: ms / 1000,
          })),
      };
    })
    .groupBy('url')
    .map(many => {
      const output = first(many);

      output.data = frum(many)
        .select('data')
        .flatten()
        .sort('date')
        .toArray();

      return output;
    });
const mergeProductsData = productsData =>
  frum(productsData)
    .map(({ meta, scenarios }) =>
      frum(scenarios).map(scenario => ({
        ...meta,
        ...scenario,
        scenarioKey: scenario.url.split('#')[0],
        lastDataPoint: (last(scenario.data) || {}).value,
      }))
    )
    .flatten()
    .toArray();
let ENDPOINT;
const productUrl = product => `${ENDPOINT}?product=${product}&version=3`;
const fetchProductData = async product => {
  const url = productUrl(product);
  const { meta, scenarios } = await fetchJson(url);

  return {
    meta,
    scenarios: transformedDataForMetrisGraphics(scenarios),
  };
};

// XXX: There's a strong coupling of data fetching from the API and
//      data transformation for UI purposes (e.g. mergeProducts data)
class NimbledroidApiHandler {
  constructor(backendUrl) {
    ENDPOINT = `${backendUrl}/api/android/nimbledroid`;
  }

  // No clean way to have interfaces on Javascript
  getData({ products }) {
    return this.fetchProducts(products);
  }

  // e.g. org.mozilla.klar, com.chrome.beta
  async fetchProducts(products) {
    const productsData = await Promise.all(
      products.map(async product => fetchProductData(product))
    );

    return mergeProductsData(productsData);
  }
}

export default NimbledroidApiHandler;
