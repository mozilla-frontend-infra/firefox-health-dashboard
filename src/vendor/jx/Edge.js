/* eslint-disable no-underscore-dangle */

import jx from './expressions';
import {
  exists, isFunction, isString, missing,
} from '../utils';
import { Domain, ValueDomain } from './domains';
import { Log } from '../logs';

/*
Describe one side of a (multidimensional cube)
 */
class Edge {
  constructor({ name, value, domain }) {
    this.name = name;
    this.value = value; // function to map original data to domain value
    this.domain = domain; // The details on what values this edge can take on
  }
}

Edge.newInstance = (desc) => {
  if (desc instanceof Edge) {
    return desc;
  }

  if (isString(desc)) {
    return new Edge({
      name: desc,
      value: jx(desc),
      domain: new ValueDomain(desc),
    });
  }

  const { name, value, domain } = desc;
  const dom = Domain.newInstance(domain);
  const val = exists(value) ? jx(value) : dom._value;

  if (missing(val) || !isFunction(val)) {
    Log.error('Expecting every edge to have a "value"');
  }

  return new Edge({
    name,
    value: val,
    domain: dom,
  });
};

export default Edge;
