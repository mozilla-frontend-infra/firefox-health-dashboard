import React from 'react';
import renderer from 'react-test-renderer';
import NimbledroidSummaryTable from '../../src/containers/NimbledroidSummaryTable';

const nimbledroidData = require('../mocks/nimbledroidData.json');

it('renders correctly', () => {
  const tree = renderer
    .create((
      <NimbledroidSummaryTable
        nimbledroidData={nimbledroidData}
        configuration={{
          baseProduct: 'org.mozilla.focus',
          compareProduct: 'com.chrome.beta',
          products: [
            'org.mozilla.klar',
            'org.mozilla.focus',
            'com.chrome.beta',
          ],
          targetRatio: 1.2,
        }}
      />
    ))
    .toJSON();
  expect(tree).toMatchSnapshot();
});
