import fetchJson from '../fetchJson';

const PRODUCT_KEYS = {
  'org.mozilla.klar': 'GV',
  'org.mozilla.focus': 'WV',
  'com.chrome.beta': 'ChromeBeta',
};

const matchUrl = profileName => profileName
  .replace(/.*(http[s]?:\/\/w*\.?.*?)[/]?[)]/, (match, firstMatch) => firstMatch);

const matchShorterUrl = url => url
  .replace(/http[s]?:\/\/w*\.?(.*?)/, (match, firstMatch) => firstMatch);

const transformedDataForMetrisGraphics = (nimbledroidData) => {
  const metricsGraphicsData = nimbledroidData.reduce((result, elem) => {
    const product = PRODUCT_KEYS[elem.package_id];
    if (!result[product]) {
      result[product] = {};
    }
    elem.profiles.forEach((profile) => {
      const { scenario_name, status, time_in_ms } = profile;
      // In Nimbledroid we have create a number of profiles
      // some of them test websites and contain the URL in the name.
      // There are other profiles testing non-site behaviours, however,
      // we're not interested on plotting those
      if (scenario_name.includes('http')) {
        const url = matchUrl(scenario_name);
        if (!result[product][url]) {
          result[product][url] = {
            data: [],
            title: matchShorterUrl(url),
            url,
          };
        }
        if (time_in_ms > 0) {
          result[product][url].data.push({
            date: new Date(elem.added),
            value: time_in_ms / 1000,
          });
        }
      }
    });
    return result;
  }, {});
  return metricsGraphicsData;
};

const sortDataPointsByRecency = (a, b) => {
  let retVal;
  if (a.date < b.date) {
    retVal = -1;
  } else if (a.date === b.date) {
    retVal = 0;
  } else {
    retVal = 1;
  }
  return retVal;
};

const mergeProductsData = (productsData) => {
  const mergedData = productsData
    .reduce((result, productData) => {
      const product = Object.keys(productData);
      const profileKeys = Object.keys(productData[product]);

      profileKeys.forEach((profileKey) => {
        const profileInfo = productData[product][profileKey];
        const sortedData = profileInfo.data.sort(sortDataPointsByRecency);
        const lastDataPoint = (sortedData[sortedData.length - 1].value).toFixed(2);

        // This is the first time we're seing this scenario
        if (!result[profileKey]) {
          delete profileInfo.data;
          result[profileKey] = {
            data: {},
            ...profileInfo,
          };
        }
        // This is the first time we're seing this product for this scenario
        if (!result[profileKey].data[product]) {
          result[profileKey].data[product] = sortedData;
          result[profileKey][product] = lastDataPoint;
        }
      });
      return result;
    }, {});
  return mergedData;
};

let ENDPOINT;

const productUrl = product => `${ENDPOINT}?product=${product}`;

const fetchProductData = async (product) => {
  const url = productUrl(product);
  const productData = await fetchJson(url);
  return transformedDataForMetrisGraphics(productData);
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
      products.map(async product => fetchProductData(product)),
    );
    return mergeProductsData(productsData);
  }
}

export default NimbledroidApiHandler;
