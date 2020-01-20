import React from 'react';
import renderer from 'react-test-renderer';
import DashboardPage from '../../src/utils/DashboardPage';

describe('DashboardPage', () => {
  it('renders correctly', () => {
    const node = renderer.create(<DashboardPage><div /></DashboardPage>).toJSON();
    expect(node).toMatchSnapshot();
  });
});
