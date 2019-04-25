import React from 'react';
import renderer from 'react-test-renderer';
import NimbledroidGraphPage from '../../src/nimbledroid/NimbledroidGraphPage';

it('renders correctly', () => {
  const props = {
    site: 'test site',
    location: {
      search: 'your search',
    },
  };
  const tree = renderer
    .create(<NimbledroidGraphPage location={props.location} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});
