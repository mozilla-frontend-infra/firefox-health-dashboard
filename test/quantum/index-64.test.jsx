import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import Windows from '../../src/windows/Windows';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <BrowserRouter>
        <Windows
          location={{ pathname: '/windows/64' }}
          match={{ params: { bits: 64 } }}
        />
      </BrowserRouter>,
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
