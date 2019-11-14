/* eslint-disable jest/valid-expect */
/* global describe, it */
import assert from 'assert';
import { expect } from 'chai';
import { adjustedData } from '../../src/utils/perfherder/subbenchmarks';

const stubData = [
  { push_timestamp: 1518774673, value: 1 },
  { push_timestamp: 1518774673, value: 3 },
  { push_timestamp: 1518774673, value: 2 },
  { push_timestamp: 1518774673, value: 4 },
];

describe('subbenchmarks', () => {
  it('adjustData() - only keep 50th percentile of data', () => {
    const data = adjustedData(stubData, 50);

    assert(data.length === 2);
    expect(data.map(d => d.value)).to.have.same.members([1, 2]);
  });
});
