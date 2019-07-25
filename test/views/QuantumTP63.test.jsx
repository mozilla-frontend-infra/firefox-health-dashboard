import renderer from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import TP6 from '../../src/quantum/TP6';
import { timePickers } from '../../src/utils/timePickers';

it('renders correctly integer', () => {
  timePickers.mock();

  const tree = renderer
    .create(
      <BrowserRouter>
        <TP6
          location={{ pathname: '/quantum/tp6' }}
          match={{ params: { bits: 64, test: 'warm-loadtime' } }}
        />
      </BrowserRouter>,
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
