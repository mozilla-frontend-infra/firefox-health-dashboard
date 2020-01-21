/* eslint-disable jest/valid-expect */
/* global describe, it */
import { expect } from 'chai';
import { getWindowTitle } from '../../src/utils/helpers';

describe('helpers', () => {
  const baseTitle = 'Firefox Health Dashboard';

  it('should return the base title no pageTitle argument is provided', () => {
    expect(getWindowTitle()).equal(baseTitle);
  });

  it('should return only the base title if the argument has a similar text', () => {
    const fakePageTitle = 'Firefox health';
    expect(getWindowTitle(fakePageTitle)).equal(baseTitle);
  });

  it('should return the page title concatenated with the page title', () => {
    const fakePageTitle = 'Awesile Title';
    expect(getWindowTitle(fakePageTitle)).equal(`${fakePageTitle} - ${baseTitle}`);
  });
});
