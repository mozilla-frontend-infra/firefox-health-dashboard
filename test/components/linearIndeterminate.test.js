import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import LinearIndeterminate from '../../src/components/LinearIndeterminate';

describe('<LinearIndeterminate />', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <LinearIndeterminate
          classes={{
            root: 'X',
          }}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
