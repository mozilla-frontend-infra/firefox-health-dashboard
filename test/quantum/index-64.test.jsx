import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import Quantum from '../../src/quantum/Quantum';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <BrowserRouter>
        <Quantum
          location={{ pathname: '/quantum/64' }}
          match={{ params: { bits: 64 } }}
        />
      </BrowserRouter>,
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
