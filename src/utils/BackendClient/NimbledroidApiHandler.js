/* eslint-disable no-param-reassign */
import fetchJson from '../fetchJson';

const matchUrl = profileName =>
  profileName.replace(
    /.*(http[s]?:\/\/w*\.?.*?[/]?)[)]/,
    (match, firstMatch) => firstMatch
  );
const matchShorterUrl = url =>
  url.replace(/http[s]?:\/\/w*\.?(.*?)/, (match, firstMatch) => firstMatch);
const transformedDataForMetrisGraphics = scenarios => {
  const metricsGraphicsData = Object.keys(scenarios).reduce(
    (result, scenarioName) => {
      scenarios[scenarioName].forEach(({ date, ms }) => {
        // multiple scenarioName have same url0
        const url = matchUrl(scenarioName);
        // multiple scenarioName have same url

        if (!result[url]) {
          result[url] = {
            data: [],
            title: matchShorterUrl(url),
            url,
          };
        }

        if (ms > 0) {
          /* this appends contents of scenarios[scenarioName] 
          to result[url].data **AND** concatenates data when 
          matchUrl(scenarioName1) == matchUrl(scenarioName2) */
          result[url].data.push({
            date: new Date(date),
            value: ms / 1000,
          });
        }
      });

      return result;
    },
    {}
  );

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

const mergeProductsData = productsData => {
  const mergedMeta = {};
  const mergedScenarios = productsData.reduce((result, { meta, scenarios }) => {
    const { latestVersion, packageId } = meta;

    mergedMeta[packageId] = {
      latestVersion,
    };

    Object.keys(scenarios).forEach(originalKey => {
      const profileInfo = scenarios[originalKey];

      if (profileInfo.data.length === 0) {
        return;
      }

      const sortedData = profileInfo.data.sort(sortDataPointsByRecency);
      const lastDataPoint = sortedData[sortedData.length - 1].value.toFixed(2);
      const scenarioKey = originalKey.split('#')[0];

      // This is the first time we're seing this scenario
      if (!result[scenarioKey]) {
        delete profileInfo.data;
        result[scenarioKey] = {
          data: {},
          ...profileInfo,
        };
      }

      // This is the first time we're seing this product for this scenario
      if (!result[scenarioKey].data[packageId]) {
        result[scenarioKey].data[packageId] = sortedData;
        result[scenarioKey][packageId] = lastDataPoint;
      }
    });

    return result;
  }, {});

  return {
    meta: mergedMeta,
    scenarios: mergedScenarios,
  };
};

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
