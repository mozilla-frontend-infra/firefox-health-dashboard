import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import QuantumTP6 from '../../src/quantum/TP6';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <BrowserRouter>
        <QuantumTP6 />
      </BrowserRouter>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
