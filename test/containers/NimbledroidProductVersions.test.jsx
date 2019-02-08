import React from 'react';
import renderer from 'react-test-renderer';
import { toPairs } from '../../src/utils/queryOps';
import NimbledroidProductVersions from '../../src/containers/NimbledroidProductVersions';
import CONFIG from '../../src/utils/nimbledroid/config';

const nimbledroidData = require('../mocks/nimbledroidData.json');

function flattenNimbledroid(source) {
  const lookup = source.meta;
  const ndd = toPairs(source.scenarios)
    .map((products, url) => {
      const { title } = products;

      return toPairs(products.data).map((data, packageId) => ({
        url,
        title,
        data,
        packageId,
        label: CONFIG.packageIdLabels[packageId],
        latestVersion: lookup[packageId].latestVersion,
      }));
    })
    .flatten()
    .toArray();

  return ndd;
}

it('renders correctly', () => {
  const tree = renderer
    .create(
      <NimbledroidProductVersions
        nimbledroidData={flattenNimbledroid(nimbledroidData)}
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

// eslint-disable-next-line import/prefer-default-export
export { flattenNimbledroid };
