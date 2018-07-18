import fetchJson from '../fetchJson';

const renameProduct = product => (
  product === 'klar' ? 'GV' : 'WV'
);

const matchSiteName = profileName => profileName
  .replace(/.*.*http[s]*:\/\/[www]*\.*(.*)[/].*/, (match, firstMatch) => firstMatch);

const transformedDataForMetrisGraphics = (nimbledroidData) => {
  const metricsGraphicsData = nimbledroidData.reduce((result, elem) => {
    const product = renameProduct(elem.package_id.replace('org.mozilla.', ''));
    if (!result[product]) {
      result[product] = {};
    }
    elem.profiles.forEach((profile) => {
      const { scenario_name, status, time_in_ms } = profile;
      // In Nimbledroid we have create a number of profiles
      // some of them test websites and contain the URL in the name.
      // There are other profiles testing non-site behaviours, however,
      // we're not interested on plotting those
      if (
        status !== 'fail' &&
        scenario_name.startsWith('customFlow') &&
        scenario_name.includes('http')
      ) {
        if (!result[product][scenario_name]) {
          result[product][scenario_name] = {
            data: [],
            title: matchSiteName(scenario_name),
          };
        }
        if (time_in_ms > 0) {
          result[product][scenario_name].data.push({
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
        const { data, title } = productData[product][profileKey];
        const sortedData = data.sort(sortDataPointsByRecency);
        const lastDataPoint = sortedData[sortedData.length - 1].value;

        // This is the first time we're seing this scenario
        if (!result[profileKey]) {
          result[profileKey] = {
            data: {},
            title,
            lastDataPoints: {}, // This is a shortcut
           };
        }
        // This is the first time we're seing this product for this scenario
        if (!result[profileKey].data[product]) {
          result[profileKey].data[product] = sortedData;
          result[profileKey].lastDataPoints[product] = lastDataPoint;
        }
      });
      return result;
    }, {});
  return mergedData;
};

class NimbledroidApiHandler {
  products = ['focus', 'klar'];

  constructor(backendUrl) {
    this.nimbledroidApiUrl = `${backendUrl}/api/android/nimbledroid`;
  }

  // No clean way to have interfaces on Javascript
  getData() {
    return this.fetchProducts();
  }

  productUrl(product) {
    return `${this.nimbledroidApiUrl}?product=${product}`;
  }

  async fetchProductData(product) {
    const productData = await fetchJson(this.productUrl(product));
    return transformedDataForMetrisGraphics(productData);
  }

  async fetchProducts() {
    const productsData = await Promise.all(
      this.products.map(async product => this.fetchProductData(product)),
    );
    if (
      Object.keys(productsData[0]).length === 0 ||
      Object.keys(productsData[1]).length === 0
    ) {
      throw Error('The backend has no data available.');
    }
    return mergeProductsData(productsData);
  }
}

export default NimbledroidApiHandler;
