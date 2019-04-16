import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import QuantumTP6m from '../../src/quantum/TP6m';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <BrowserRouter>
        <QuantumTP6m />
      </BrowserRouter>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
