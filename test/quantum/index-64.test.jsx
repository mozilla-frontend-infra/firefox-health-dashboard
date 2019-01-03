import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import Quantum64 from '../../src/quantum/index-64bit';

it('renders correctly', () => {
  const tree = renderer.create((
    <BrowserRouter>
      <Quantum64 location={{}} />
    </BrowserRouter>
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
