/* global describe, it */
import assert from 'assert';
import { expect } from 'chai';
import { transformGraphData, determineStatusColor } from '../../src/utils/helpers';

describe('transformGraphData', () => {
  it('should take an array of objects and transform it into many arrays of objects', () => {

    const keys = ['value1', 'value2'];    
    const dataInput = [
      { value1: 3, value2: 8, date: "2018-05-03" },
      { value1: 7, value2: 13, date: "2018-05-02" },
      { value1: 9, value2: 5, date: "2018-05-01" },  
    ];
    
    const expectedData = [
      [
        { value: 3, date: new Date("2018-05-03") },    
        { value: 7, date: new Date ("2018-05-02") },
        { value: 9, date: new Date("2018-05-01") },
      ],[
        { value: 8, date: new Date ("2018-05-03") },
        { value: 13, date: new Date ("2018-05-02") },
        { value: 5, date: new Date ("2018-05-01") },
      ]
    ];

    const actual = transformGraphData(keys, dataInput);
    assert(keys.length === Object.keys(dataInput[0]).length - 1); // date should be omitted from keys list
    expect(actual).to.eql(expectedData);
  })
});

describe('determineStatusColor', () => {
  it('should return a color based value/target comparison of most recent data point', () => {
    const targetValue = 5;
    const targetLine = 'value2';
    const targetLine2 = 'value1';
    const targetValue2 = 7;
    const dataInput = [
      { value1: 3, value2: 8, date: "2018-05-01" },
      { value1: 7, value2: 13, date: "2018-05-03" },
      { value1: 9, value2: 5, date: "2018-05-02" },
    ];
    
    const actual = determineStatusColor(dataInput, targetLine, targetValue);
    const actual2 = determineStatusColor(dataInput, targetLine2, targetValue2);

    expect(dataInput[0]).to.have.own.property(targetLine);
    expect(actual).to.be.equal('red');
    expect(actual2).to.be.equal('green');    
  })
});
