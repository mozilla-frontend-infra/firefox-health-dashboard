import React from 'react';
import renderer from 'react-test-renderer';
import NimbledroidProductVersions from '../../src/nimbledroid/NimbledroidProductVersions';

const nimbledroidData = require('../mocks/nimbledroidData.json');

it('renders correctly', () => {
  const tree = renderer
    .create(<NimbledroidProductVersions nimbledroidData={nimbledroidData} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});
