/* eslint-disable linebreak-style */
import renderer from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import TP6 from '../../src/views/QuantumTP6';

it('renders correctly integer', () => {
  const tree = renderer
    .create(
      <BrowserRouter>
        <TP6
          location={{ pathname: '/quantum/tp6' }}
          match={{ params: { bits: 64, test: 'loadtime' } }}
        />
      </BrowserRouter>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
