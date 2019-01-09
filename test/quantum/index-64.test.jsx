import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import Quantum from '../../src/quantum/index';

it('renders correctly', () => {
  const tree = renderer.create((
    <BrowserRouter>
      <Quantum location={{ pathname: '/quantum/64' }} params={{ match: { bits: 64 } }} />
    </BrowserRouter>
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
