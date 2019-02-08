import React from 'react';
import renderer from 'react-test-renderer';
import NimbledroidSummaryTable from '../../src/containers/NimbledroidSummaryTable';
import CONFIG from '../../src/utils/nimbledroid/config';
import { flattenNimbledroid } from './NimbledroidProductVersions.test';

const nimbledroidData = flattenNimbledroid(
  require('../mocks/nimbledroidData.json')
);

it('renders correctly', () => {
  const tree = renderer
    .create(
      <NimbledroidSummaryTable
        nimbledroidData={nimbledroidData}
        configuration={CONFIG}
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
