import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import QuantumTP6m from '../../src/android/TP6m';
import { timePickers } from '../../src/utils/timePickers';

it('renders correctly', () => {
  timePickers.mock();

  const tree = renderer
    .create(
      <BrowserRouter>
        <QuantumTP6m />
      </BrowserRouter>,
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
