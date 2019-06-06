import React from 'react';
import renderer from 'react-test-renderer';
import Android from '../../src/android';

it('renders correctly', () => {
  const tree = renderer.create(<Android />).toJSON();

  expect(tree).toMatchSnapshot();
});
