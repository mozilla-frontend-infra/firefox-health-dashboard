import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import TP6 from '../../src/views/QuantumTP6';

it('renders correctly url', () => {
  const tree = renderer
    .create(
      <MemoryRouter
        initialEntries={['/quantum/tp6?bits=64&test=loadtime']}
        initialIndex={0}>
        <TP6 />
      </MemoryRouter>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
