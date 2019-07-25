/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
import { Log } from '../logs';
import { GMTDate as Date } from '../dates';
import { isEqual } from '../datas';
import { Duration } from '../durations';
import {
  coalesce, exists, isString, missing,
} from '../utils';
import { selectFrom } from '../vectors';
import jx from './expressions';

const DEFAULT_FORMAT = 'yyyy-MM-dd HH:mm:ss';
// const ALGEBRAIC = ['time', 'duration', 'numeric', 'count', 'datetime']; // DOMAINS THAT HAVE ALGEBRAIC OPERATIONS DEFINED
// const KNOWN = ['set', 'boolean', 'duration', 'time', 'numeric']; // DOMAINS THAT HAVE A KNOWN NUMBER FOR PARTS AT QUERY TIME
// const PARTITION = ['set', 'boolean']; // DIMENSIONS WITH CLEAR PARTS
const NULL = {
  // SPECIAL SINGLTON TO REPRESENT OUT-OF-DOMAIN VALUES
  name: 'NULL',
  value: null,
  _filter: () => true,
};

class Domain {
  constructor() {
    this.locked = false;
  }

  lock() {
    this.locked = true;
  }

  isEqual() {
    throw Log.error('not implemented');
  }
}

class ValueDomain extends Domain {
  constructor(name) {
    super();
    this.type = 'value';
    this.name = name;
    this.map = {};
    this.partitions = [NULL];
  }

  /*
  Return index into the `partitions` array for given `value`
   */
  valueToIndex(value) {
    /*
    Return the canonical value that represents `value`, or NULL
     */
    if (missing(value)) {
      return this.partitions.length - 1;
    }

    const output = this.partitions.findIndex(v => v.value === value);

    if (output === -1) {
      if (this.locked) {
        return this.partitions.length - 1;
      }

      this.partitions.splice(this.partitions.length - 1, 0, { value });

      return this.partitions.length - 2;
    }

    return output;
  }
}

class TimeDomain extends Domain {
  constructor({
    min, max, interval, past, ending, format,
  }) {
    super();

    if (exists(past)) {
      this.max = Date.newInstance(coalesce(ending, 'today')).addDay();
      this.min = this.max.addDay(-1).subtract(Duration.newInstance(past));
    } else {
      this.min = Date.newInstance(min);
      this.max = Date.newInstance(max);
    } // endif

    if (exists(interval)) {
      this.interval = Duration.newInstance(interval);
    } else {
      this.interval = Date.getBestInterval(this.min, this.max);
    }

    this.format = format;
    this.values = this._constructTimeRange();
  }

  _constructTimeRange = () => {
    this.partitions = [];

    for (
      let v = this.min;
      v.milli() < this.max.milli();
      v = v.add(this.interval)
    ) {
      const partition = {
        value: v,
        min: v,
        max: v.add(this.interval),
        name: v.format(coalesce(this.format, DEFAULT_FORMAT)),
      };

      this.partitions.push(partition);
    } // for

    this.partitions.push(NULL);
  };

  /*
  Return index into the `partitions` array for given `value`
   */
  valueToIndex(value) {
    const dateValue = Date.newInstance(value).milli();

    return this.partitions.findIndex(
      part => part === NULL
        || (part.min.milli() <= dateValue && dateValue < part.max.milli()),
    );
  }

  /*
  Return value if `value` is in the domain else return null
   */
  includes(value) {
    const dateValue = Date.newInstance(value).milli();

    if (this.min.milli() <= dateValue && dateValue < this.max.milli()) {
      return dateValue;
    }

    return null;
  }

  isEqual(other) {
    if (this === other) return true;

    return ['min', 'max', 'interval', 'past', 'ending', 'format'].every(v => isEqual(this[v], other[v]));
  }
}

class SetDomain extends Domain {
  constructor({ type, partitions }) {
    super();

    const parts = selectFrom(partitions);

    if (type !== 'set') {
      Log.error('expecting "set" type');
    }

    if (parts.missing('where').length > 0) {
      Log.error('Expecting all parts to have a "where" clause ');
    }

    if (parts.missing('name').length > 0) {
      Log.error('Expecting all parts to have a "name" ');
    }

    this.partitions = parts
      .map(({ name, value, where }) => ({
        name,
        value: coalesce(value, name),
        where,
        _filter: jx(where),
      }))
      .append(NULL)
      .toArray();

    this._value = row => this.partitions.find(part => part._filter(row)).value;
  }

  /*
  Return index into the `partitions` array for given `value`
   */
  valueToIndex(value) {
    const output = this.partitions.findIndex(part => part.value === value);

    if (output === -1) {
      return this.partitions.length - 1;
    }

    return output;
  }

  * [Symbol.iterator]() {
    for (const v of this.partitions) yield v;
  }
}

Domain.newInstance = (desc) => {
  if (desc instanceof Domain) {
    return desc;
  }

  if (isString(desc)) {
    return ValueDomain(desc);
  }

  if (desc.type === 'time') {
    return new TimeDomain(desc);
  }

  if (desc.type === 'set') {
    return new SetDomain(desc);
  }

  throw Log.error('Do not know how to construct a domain from {{desc|json}}', {
    desc,
  });
};

export {
  NULL, Domain, ValueDomain, TimeDomain,
};
