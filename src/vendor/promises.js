/* eslint-disable linebreak-style */

const cache = asyncFunction =>
  // Run `asyncFunction` just once and keep result

  new Promise((resolve, reject) => {
    (async () => {
      try {
        resolve(await asyncFunction());
      } catch (e) {
        reject(e);
      }
    })();
  });

export { cache }; // eslint-disable-line import/prefer-default-export
