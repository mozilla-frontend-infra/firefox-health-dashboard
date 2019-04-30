import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import BugzillaQueryUrl from '../../src/components/BugzillaUrl';

describe('<BugzillaQueryUrl />', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <BugzillaQueryUrl
          bugCount={1}
          url="http://github.com"
          text="test"
          classes={{
            padding: 'X',
            text: 'Y',
            margin: 'Z',
          }}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly without bugs', () => {
    const tree = renderer
      .create(
        <BugzillaQueryUrl
          url="http://github.com"
          text="test"
          classes={{
            padding: 'X',
            text: 'Y',
            margin: 'Z',
          }}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
