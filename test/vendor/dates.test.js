import { Date } from '../../src/vendor/dates';

describe('dates', () => {
  it('gmt', () => {
    expect(Date.newInstance('1970 jan 1').unix()).toEqual(0);
  });

  it('epoch constant', () => {
    expect(Date.EPOCH.unix()).toEqual(0);
  });

  it('today', () => {
    expect(Date.today().unix() % (24 * 60 * 60)).toEqual(0);
  });

  it('epoch', () => {
    const timezone = Date.newInstance('1970 jan 1')
      .floorDay()
      .unix();

    expect(timezone).toEqual(0);
  });
});
