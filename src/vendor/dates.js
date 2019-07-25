/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-loop-func */

import {
  coalesce,
  exists,
  isInteger,
  isNumeric,
  isString,
  last,
  missing,
  first,
} from './utils';
import { Duration } from './durations';
import {
  abs, ceiling, floor, round, sign,
} from './math';
import { Log } from './logs';
import strings from './strings';

const twoDigits = x => (x < 0 || x > 9 ? '' : '0') + x;

class GMTDate extends Date {
  unix = () => this.milli() / 1000.0;

  isEqual(other) {
    return this.milli() === other.milli();
  }

  between = (min, max) => {
    if (exists(min)) {
      if (min.getMilli && this.milli() < min.milli()) {
        return false;
      }

      if (this.milli() < min) {
        return false;
      }
    }

    if (exists(max)) {
      if (max.getMilli && max.milli() < this.milli()) {
        return false;
      }

      if (max <= this.milli()) {
        return false;
      }
    }

    return true;
  };

  add = (interval) => {
    if (missing(interval)) {
      Log.error('expecting an interval to add');
    }

    const i = Duration.newInstance(interval);
    const addMilli = i.milli - Duration.MILLI_VALUES.month * i.month;

    return this.addMonth(i.month).addMilli(addMilli);
  };

  subtract = (time) => {
    if (isString(time)) {
      Log.error(
        'expecting to subtract a Duration or GMTDate object, not a string',
      );
    }

    if (time instanceof GMTDate) {
      // SUBTRACT TIME
      return GMTDate.diffMonth(this, time);
    }

    // SUBTRACT DURATION
    return this.addMilli(-time.milli);
  };

  dow = GMTDate.prototype.getUTCDay;

  // CONVERT THIS GMT DATE TO LOCAL DATE
  addTimezone = () => this.addMinute(-this.getTimezoneOffset());

  // CONVERT THIS LOCAL DATE TO GMT DATE
  subtractTimezone = () => this.addMinute(this.getTimezoneOffset());

  addMilli = value => new GMTDate(this.milli() + value);

  addSecond = (value) => {
    const output = new GMTDate(this);

    output.setUTCSeconds(this.getUTCSeconds() + value);

    return output;
  };

  addMinute = (value) => {
    const output = new GMTDate(this);

    output.setUTCMinutes(this.getUTCMinutes() + value);

    return output;
  };

  addHour = (value) => {
    const output = new GMTDate(this);

    output.setUTCHours(this.getUTCHours() + value);

    return output;
  };

  addDay = (value) => {
    const value_ = coalesce(value, 1);
    const output = new GMTDate(this);

    output.setUTCDate(this.getUTCDate() + value_);

    return output;
  };

  addWeekday = (value) => {
    let output = this.addDay(1);

    if ([0, 1].includes(output.dow())) {
      output = output.floorWeek().addDay(2);
    }

    const weeks = floor(value / 5);

    output = output.addDay(value - weeks * 5);

    if ([0, 1].includes(output.dow())) {
      output = output.floorWeek().addDay(2);
    }

    output = output.addWeek(weeks).addDay(-1);

    return output;
  };

  addWeek = (value) => {
    const value_ = coalesce(value, 1);
    const output = new GMTDate(this);

    output.setUTCDate(this.getUTCDate() + value_ * 7);

    return output;
  };

  addMonth = (value) => {
    if (value === 0) {
      return this;
    } // WHOA! SETTING MONTH IS CRAZY EXPENSIVE!!

    const output = new GMTDate(this);

    output.setUTCMonth(this.getUTCMonth() + value);

    return output;
  };

  addYear = (value) => {
    const output = new GMTDate(this);

    output.setUTCFullYear(this.getUTCFullYear() + value);

    return output;
  };

  // RETURN A DATE ROUNDED DOWN TO THE CLOSEST FULL INTERVAL
  floor = (interval, minDate) => {
    if (exists(minDate)) {
      return minDate.add(this.subtract(minDate).floor(interval));
    }

    if (exists(interval.month) && interval.month > 0) {
      if (interval.month % 12 === 0) {
        return this.addMonth(-interval.month + 12).floorYear();
      }

      if ([1, 2, 3, 4, 6].includes(interval.month)) {
        const thisYear = this.floorYear();

        return thisYear.add(this.subtract(thisYear).floor(interval));
      }

      Log.error(`Can not floor interval '${interval.toString()}'`);
    }

    let intervalStr = interval;

    if (interval.milli !== undefined) {
      intervalStr = interval.toString();
    }

    if (intervalStr.indexOf('year') >= 0) {
      return this.floorYear();
    }

    if (intervalStr.indexOf('month') >= 0) {
      return this.floorMonth();
    }

    if (intervalStr.indexOf('week') >= 0) {
      return this.floorWeek();
    }

    if (intervalStr.indexOf('day') >= 0) {
      return this.floorDay();
    }

    if (intervalStr.indexOf('hour') >= 0) {
      return this.floorHour();
    }

    throw Log.error(`Can not floor interval '${intervalStr}'`);
  };

  floorYear = () => {
    const output = new GMTDate(this);

    output.setUTCMonth(0, 1);
    output.setUTCHours(0, 0, 0, 0);

    return output;
  };

  floorMonth = () => {
    const output = new GMTDate(this);

    output.setUTCDate(1);
    output.setUTCHours(0, 0, 0, 0);

    return output;
  };

  floorWeek = () => {
    const output = new GMTDate(this);

    output.setUTCDate(this.getUTCDate() - this.getUTCDay());
    output.setUTCHours(0, 0, 0, 0);

    return output;
  };

  floorDay = () => {
    const output = new GMTDate(this);

    output.setUTCHours(0, 0, 0, 0);

    return output;
  };

  floorHour = () => {
    const output = new GMTDate(this);

    output.setUTCMinutes(0);

    return output;
  };

  ceilingDay = () => this.floorDay().addDay(1);

  ceilingWeek = () => this.floorWeek().addWeek(1);

  ceilingMonth = () => this.floorMonth().addMonth(1);

  ceiling = interval => this.floor(interval).add(interval);

  // ------------------------------------------------------------------
  // formatDate(date_object, format);
  // Returns a date in the output format specified.
  // The format string uses the same abbreviations as in getDateFromFormat()
  // ------------------------------------------------------------------
  format = (format) => {
    const y = `${this.getUTCFullYear()}`;
    const M = this.getUTCMonth() + 1;
    const d = this.getUTCDate();
    const E = this.getUTCDay();
    const H = this.getUTCHours();
    const m = this.getUTCMinutes();
    const s = this.getUTCSeconds();
    const f = this.getUTCMilliseconds();
    const v = {};

    v.y = y;
    v.yyyy = y;
    v.yy = y.slice(2, 4);
    v.M = M;
    v.MM = twoDigits(M);
    v.MMM = GMTDate.MONTH_NAMES[M - 1];
    v.NNN = GMTDate.MONTH_NAMES[M + 11];
    v.days = (() => {
      if (d === 1) {
        return '';
      }

      if (d === 2) {
        return '1 day';
      }

      return `${d - 1} days`;
    })();
    v.d = d;
    v.dd = twoDigits(d);
    v.E = GMTDate.DAY_NAMES[E + 7];
    v.EE = GMTDate.DAY_NAMES[E];
    v.H = H;
    v.HH = twoDigits(H);
    v.h = ((H + 11) % 12) + 1;
    v.hh = twoDigits(v.h);
    v.hours = `${(d - 1) * H} hours`;
    v.K = H % 12;
    v.KK = twoDigits(v.K);
    v.k = H + 1;
    v.kk = twoDigits(v.k);
    v.a = ['AM', 'PM'][floor(H / 12)];
    v.m = m;
    v.mm = twoDigits(m);
    v.s = s;
    v.ss = twoDigits(s);
    v.fff = f;
    v.ffffff = f * 1000;

    let output = '';

    for (let index = 0; index < format.length; index += 1) {
      let i = 0;

      for (; i < GMTDate.KEYS.length; i += 1) {
        const k = GMTDate.KEYS[i];

        if (format.slice(index, index + k.length) === k) {
          output += v[k];
          index += k.length - 1;
          break;
        }
      }

      if (i === GMTDate.KEYS.length) {
        output += format.charAt(index);
      }
    }

    return output;
  };
}

GMTDate.newInstance = (value) => {
  if (missing(value)) {
    return null;
  }

  if (isString(value)) {
    const newval = GMTDate.tryParse(value);

    if (newval !== null) {
      return newval;
    }
  }

  if (isNumeric(value)) {
    Number.parseFloat(value);

    if (value <= 9999999999) {
      // TOO SMALL, MUST BE A UNIX TIMESTAMP
      return new GMTDate(value * 1000);
    }

    return new GMTDate(value);
  }

  return new GMTDate(value);
};

GMTDate.prototype.milli = GMTDate.prototype.getTime;

GMTDate.currentTimestamp = Date.now;

GMTDate.now = () => new GMTDate();

GMTDate.eod = () => new GMTDate().ceilingDay();

GMTDate.today = () => new GMTDate().floorDay();

GMTDate.min = (...args) => {
  let min = null;

  args.forEach((v) => {
    if (v === undefined || v === null) {
      return;
    }

    if (min === null || min > v) {
      min = v;
    }
  });

  return min;
};

GMTDate.max = (...args) => {
  let max = null;

  args.forEach((a) => {
    if (a === null) {
      return;
    }

    if (max === null || max < a) {
      max = a;
    }
  });

  return max;
};

// RETURN THE NUMBER OF WEEKDAYS BETWWEN GIVEN TIMES
GMTDate.diffWeekday = (endTime_, startTime_) => {
  let out = 0;

  // TEST
  if (startTime_ <= endTime_) {
    for (let d = startTime_; d.milli() < endTime_.milli(); d = d.addDay(1)) {
      if (![6, 0].includes(d.dow())) {
        out += 1;
      }
    }
  } else {
    for (let d = endTime_; d.milli() < startTime_.milli(); d = d.addDay(1)) {
      if (![6, 0].includes(d.dow())) {
        out -= 1;
      }
    }
  }

  // SHIFT SO SATURDAY IS START OF WEEK
  let endTime = endTime_.addDay(1);
  let startTime = startTime_.addDay(1);

  if ([0, 1].includes(startTime.dow())) {
    startTime = startTime.floorWeek().addDay(2);
  }

  if ([0, 1].includes(endTime.dow())) {
    endTime = endTime.floorWeek();
  }

  const startWeek = startTime.addWeek(1).floorWeek();
  const endWeek = endTime.addMilli(-1).floorWeek();
  const output = (startWeek.milli()
      - startTime.milli()
      + ((endWeek.milli() - startWeek.milli()) / 7) * 5
      + (endTime.milli() - endWeek.addDay(2).milli()))
    / Duration.DAY.milli;

  if (out !== sign(output) * ceiling(abs(output))) {
    Log.error('Weekday calculation failed internal test');
  }

  return output;
};

GMTDate.diffMonth = (endTime, startTime) => {
  // MAKE SURE WE HAVE numMonths THAT IS TOO BIG;
  let numMonths = floor(
    ((endTime.milli() - startTime.milli() + Duration.MILLI_VALUES.day * 31)
      / Duration.MILLI_VALUES.year)
      * 12,
  );
  let test = startTime.addMonth(numMonths);

  while (test.milli() > endTime.milli()) {
    numMonths -= 1;
    test = startTime.addMonth(numMonths);
  } // while

  // //////////////////////////////////////////////////////////////////////////
  // TEST
  let testMonth = 0;

  while (startTime.addMonth(testMonth).milli() <= endTime.milli()) {
    testMonth += 1;
  } // while

  testMonth -= 1;

  if (testMonth !== numMonths) {
    Log.error(
      `Error calculating number of months between (${startTime.format(
        'yy-MM-dd HH:mm:ss',
      )}) and (${endTime.format('yy-MM-dd HH:mm:ss')})`,
    );
  }
  // DONE TEST
  // //////////////////////////////////////////////////////////////////////////

  const output = new Duration();

  output.month = numMonths;
  output.milli = endTime.milli()
    - startTime.addMonth(numMonths).milli()
    + numMonths * Duration.MILLI_VALUES.month;

  //  if (output.milli>=Duration.MILLI_VALUES.day*31)
  //    Log.error("problem");
  return output;
};

// ------------------------------------------------------------------
// These functions use the same 'format' strings as the
// java.text.SimpleDateFormat class, with minor exceptions.
// The format string consists of the following abbreviations:
//
// Field        | Full Form          | Short Form
// -------------+--------------------+-----------------------
// Year         | yyyy (4 digits)    | yy (2 digits), y (2 or 4 digits)
// Month        | MMM (name or abbr.)| MM (2 digits), M (1 or 2 digits)
//              | NNN (abbr.)        |
// Day of Month | dd (2 digits)      | d (1 or 2 digits)
// Day of Week  | EE (name)          | E (abbr)
// Hour (1-12)  | hh (2 digits)      | h (1 or 2 digits)
// Hour (0-23)  | HH (2 digits)      | H (1 or 2 digits)
// Hour (0-11)  | KK (2 digits)      | K (1 or 2 digits)
// Hour (1-24)  | kk (2 digits)      | k (1 or 2 digits)
// Minute       | mm (2 digits)      | m (1 or 2 digits)
// Second       | ss (2 digits)      | s (1 or 2 digits)
// MilliSecond  | fff (3 digits)     |
// MicroSecond  | ffffff (6 digits)  |
// AM/PM        | a                  |
//
// NOTE THE DIFFERENCE BETWEEN MM and mm! Month=MM, not mm!
// Examples:
//  "MMM d, y" matches: January 01, 2000
//                      Dec 1, 1900
//                      Nov 20, 00
//  "M/d/yy"   matches: 01/20/00
//                      9/2/00
//  "MMM dd, yyyy hh:mm:ssa" matches: "January 01, 2000 12:30:45AM"
// ------------------------------------------------------------------

GMTDate.MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
GMTDate.DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
];

GMTDate.KEYS = [
  'ffffff',
  'hours',
  'yyyy',
  'days',
  'fff',
  'MMM',
  'NNN',
  'yy',
  'MM',
  'dd',
  'HH',
  'E',
  'EE',
  'hh',
  'KK',
  'kk',
  'mm',
  'ss',
  'd',
  'H',
  'h',
  'K',
  'k',
  's',
  'a',
  'm',
  'y',
  'M',
];

GMTDate.Timezones = {
  GMT: 0,
  EST: -5,
  CST: -6,
  MST: -7,
  PST: -8,
};

GMTDate.getTimezone = () => {
  Log.warning('GMTDate.getTimezone is incomplete!');
  GMTDate.getTimezone = () => {
    const offset = new GMTDate().getTimezoneOffset();

    // CHEAT AND SIMPLY GUESS
    if (offset === 240 || offset === 300) {
      return 'EDT';
    }

    if (offset === 420 || offset === 480) {
      return 'PDT';
    }

    return `(${round(offset / 60)}GMT)`;
  };

  return GMTDate.getTimezone();
};

// //////////////////////////////////////////////////////////////////////////////
// WHAT IS THE MOST COMPACT DATE FORMAT TO DISTINGUISH THE RANGE
// //////////////////////////////////////////////////////////////////////////////
GMTDate.niceFormat = ({
  type, min, max, interval,
}) => {
  if (!['date', 'time'].includes(type)) {
    Log.error('Expecting a time domain');
  }

  let minFormat = 0; // SECONDS

  if (interval.milli >= Duration.MILLI_VALUES.minute) {
    minFormat = 1;
  }

  if (interval.milli >= Duration.MILLI_VALUES.hour) {
    minFormat = 2;
  }

  if (interval.milli >= Duration.MILLI_VALUES.day) {
    minFormat = 3;
  }

  if (interval.milli >= Duration.MILLI_VALUES.month) {
    minFormat = 4;
  }

  if (interval.month >= Duration.MONTH_VALUES.month) {
    minFormat = 4;
  }

  if (interval.month >= Duration.MONTH_VALUES.year) {
    minFormat = 5;
  }

  let maxFormat = 5; // year
  const span = max.subtract(min, interval);

  if (
    span.month < Duration.MONTH_VALUES.year
    && span.milli < Duration.MILLI_VALUES.day * 365
  ) maxFormat = 4; // month

  if (
    span.month < Duration.MONTH_VALUES.month
    && span.milli < Duration.MILLI_VALUES.day * 31
  ) maxFormat = 3; // day

  if (span.milli < Duration.MILLI_VALUES.day) {
    maxFormat = 2;
  }

  if (span.milli < Duration.MILLI_VALUES.hour) {
    maxFormat = 1;
  }

  if (span.milli < Duration.MILLI_VALUES.minute) {
    maxFormat = 0;
  }

  if (maxFormat <= minFormat) {
    maxFormat = minFormat;
  }

  // INDEX BY [minFormat][maxFormat]
  return [
    [
      'ss.000',
      'mm:ss',
      'HH:mm:ss',
      'NNN dd, HH:mm:ss',
      'NNN dd, HH:mm:ss',
      'dd-NNN-yyyy HH:mm:ss',
    ],
    ['', 'HH:mm', 'HH:mm', 'E dd, HH:mm', 'NNN dd, HH:mm', 'dd-NNN-yyyy HH:mm'],
    ['', '', 'HH:mm', 'E dd, HH:mm', 'NNN dd, HH:mm', 'dd-NNN-yyyy HH:mm'],
    ['', '', '', 'E dd', 'NNN dd', 'dd-NNN-yyyy'],
    ['', '', '', '', 'NNN', 'NNN yyyy'],
    ['', '', '', '', '', 'yyyy'],
  ][minFormat][maxFormat];
};

GMTDate.getBestInterval = (
  minDate,
  maxDate,
  requestedInterval = Duration.DAY,
  range = {},
) => {
  // INTERVAL WILL SPLIT DOMAIN INTO N PARTS; min <= N < max
  const { min = 7, max = 20 } = range;
  let dur = maxDate.subtract(minDate);

  if (dur.milli > Duration.MONTH.milli * min) {
    dur = maxDate.subtract(minDate, Duration.MONTH);

    const biggest = dur.divideBy(min).month;

    return coalesce(
      Duration.COMMON_INTERVALS.slice()
        .reverse()
        .find(d => biggest > d.month),
      first(Duration.COMMON_INTERVALS),
    );
  }

  const requested = requestedInterval.milli;
  const smallest = dur.divideBy(max).milli;
  const biggest = dur.divideBy(min).milli;

  if (smallest <= requested && requested < biggest) {
    return requestedInterval;
  }

  if (requested > biggest) {
    return coalesce(
      Duration.COMMON_INTERVALS.slice()
        .reverse()
        .find(d => biggest > d.milli),
      first(Duration.COMMON_INTERVALS),
    );
  }

  if (requested < smallest) {
    return coalesce(
      Duration.COMMON_INTERVALS.find(d => smallest <= d.milli),
      last(Duration.COMMON_INTERVALS),
    );
  }
};

function _getInt(str, i, minlength, maxlength) {
  for (let x = maxlength; x >= minlength; x -= 1) {
    const token = str.slice(i, i + x);

    if (token.length < minlength) {
      return null;
    }

    if (isInteger(token)) {
      return token;
    }
  }

  return null;
}

function internalChecks(year, month, date, hh_, mm, ss, fff, ampm) {
  // Is date valid for month?
  if (month === 2) {
    // LEAP YEAR
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      if (date > 29) {
        return 0;
      }
    } else if (date > 28) {
      return 0;
    }
  }

  if (month === 4 || month === 6 || month === 9 || month === 11) {
    if (date > 30) {
      return 0;
    }
  }

  // Correct hours value
  let hh = hh_;

  if (hh_ < 12 && ampm === 'PM') {
    hh = hh_ - 0 + 12;
  } else if (hh_ > 11 && ampm === 'AM') {
    hh -= 12;
  }

  const milli = Date.UTC(year, month - 1, date, hh, mm, ss, fff);

  return new GMTDate(milli);
}

// ------------------------------------------------------------------
// getDateFromFormat( date_string , format_string, isPastDate )
//
// This function takes a date string and a format string. It matches
// If the date string matches the format string, it returns the
// getTime() of the date. If it does not match, it returns 0.
// isPastDate ALLOWS DATES WITHOUT YEAR TO GUESS THE RIGHT YEAR
// THE DATE IS EITHER EXPECTED TO BE IN THE PAST (true) WHEN FILLING
// OUT A TIMESHEET (FOR EXAMPLE) OR IN THE FUTURE (false) WHEN
// SETTING AN APPOINTMENT DATE
// ------------------------------------------------------------------
GMTDate.getDateFromFormat = (val_, format_, isPastDate) => {
  const val = `${val_}`;
  const format = format_;
  let valueIndex = 0;
  let formatIndex = 0;
  let token = '';
  let x;
  let y;
  const now = new GMTDate();
  // DATE BUILDING VARIABLES
  let year = null;
  let month = now.getMonth() + 1;
  let dayOfMonth = 1;
  let hh = 0;
  let mm = 0;
  let ss = 0;
  let fff = 0;
  let ampm = '';

  while (formatIndex < format.length) {
    while (val.charAt(valueIndex) === ' ' && valueIndex < val.length) valueIndex += 1;

    // Get next token from format string
    token = '';
    const c = format.charAt(formatIndex);

    while (format.charAt(formatIndex) === c && formatIndex < format.length) {
      token += format.charAt(formatIndex);
      formatIndex += 1;
    } // while

    // Extract contents of value based on format token
    if (token === 'yyyy' || token === 'yy' || token === 'y') {
      if (token === 'yyyy') {
        x = 4;
        y = 4;
      }

      if (token === 'yy') {
        x = 2;
        y = 2;
      }

      if (token === 'y') {
        x = 2;
        y = 4;
      }

      year = _getInt(val, valueIndex, x, y);

      if (year === null) {
        return 0;
      }

      valueIndex += year.length;

      if (year.length === 2) {
        if (year > 70) {
          year = 1900 + (year - 0);
        } else {
          year = 2000 + (year - 0);
        }
      }
    } else if (token === 'MMM' || token === 'NNN') {
      month = 0;

      GMTDate.MONTH_NAMES.some((monthName, i) => {
        let prefixLength = 0;

        while (
          val.charAt(valueIndex + prefixLength).toLowerCase()
          === monthName.charAt(prefixLength).toLowerCase()
        ) {
          prefixLength += 1;
        } // while

        if (prefixLength >= 3) {
          if (token === 'MMM' || (token === 'NNN' && i > 11)) {
            month = i + 1;

            if (month > 12) {
              month -= 12;
            }

            valueIndex += prefixLength;

            return true;
          }
        }

        return false;
      });

      if (month < 1 || month > 12) {
        return 0;
      }
    } else if (token === 'EE' || token === 'E') {
      for (let i = 0; i < GMTDate.DAY_NAMES.length; i += 1) {
        const dayName = GMTDate.DAY_NAMES[i];

        if (
          val.slice(valueIndex, valueIndex + dayName.length).toLowerCase()
          === dayName.toLowerCase()
        ) {
          valueIndex += dayName.length;
          break;
        }
      }
    } else if (token === 'MM' || token === 'M') {
      month = _getInt(val, valueIndex, token.length, 2);

      if (month === null || month < 1 || month > 12) {
        return 0;
      }

      valueIndex += month.length;
    } else if (token === 'dd' || token === 'd') {
      dayOfMonth = _getInt(val, valueIndex, token.length, 2);

      if (dayOfMonth === null || dayOfMonth < 1 || dayOfMonth > 31) {
        return 0;
      }

      valueIndex += dayOfMonth.length;
    } else if (token === 'hh' || token === 'h') {
      hh = _getInt(val, valueIndex, token.length, 2);

      if (hh === null || hh < 1 || hh > 12) {
        return 0;
      }

      valueIndex += hh.length;
    } else if (token === 'HH' || token === 'H') {
      hh = _getInt(val, valueIndex, token.length, 2);

      if (hh === null || hh < 0 || hh > 23) {
        return 0;
      }

      valueIndex += hh.length;
    } else if (token === 'KK' || token === 'K') {
      hh = _getInt(val, valueIndex, token.length, 2);

      if (hh === null || hh < 0 || hh > 11) {
        return 0;
      }

      valueIndex += hh.length;
    } else if (token === 'kk' || token === 'k') {
      hh = _getInt(val, valueIndex, token.length, 2);

      if (hh === null || hh < 1 || hh > 24) {
        return 0;
      }

      valueIndex += hh.length;
      hh -= 1;
    } else if (token === 'mm' || token === 'm') {
      mm = _getInt(val, valueIndex, token.length, 2);

      if (mm === null || mm < 0 || mm > 59) {
        return 0;
      }

      valueIndex += mm.length;
    } else if (token === 'ss' || token === 's') {
      ss = _getInt(val, valueIndex, token.length, 2);

      if (ss === null || ss < 0 || ss > 59) {
        return 0;
      }

      valueIndex += ss.length;
    } else if (token === 'fff') {
      fff = _getInt(val, valueIndex, token.length, 3);

      if (fff === null || fff < 0 || fff > 999) {
        return 0;
      }

      valueIndex += fff.length;
    } else if (token === 'ffffff') {
      fff = _getInt(val, valueIndex, token.length, 6);

      if (fff === null || fff < 0 || fff > 999999) {
        return 0;
      }

      fff /= 1000;
      valueIndex += fff.length;
    } else if (token === 'a') {
      if (val.slice(valueIndex, valueIndex + 2).toLowerCase() === 'am') {
        ampm = 'AM';
      } else if (val.slice(valueIndex, valueIndex + 2).toLowerCase() === 'pm') {
        ampm = 'PM';
      } else {
        return 0;
      }

      valueIndex += 2;
    } else if (token.trim() === '') {
      while (val.charCodeAt(valueIndex) <= 32) valueIndex += 1;
    } else {
      if (val.slice(valueIndex, valueIndex + token.length) !== token) {
        return 0;
      }

      valueIndex += token.length;
    }
  }

  // If there are any trailing characters left in the value, it doesn't match
  if (valueIndex !== val.length) {
    return 0;
  }

  if (year == null) {
    // WE HAVE TO GUESS THE YEAR
    year = now.getFullYear();
    const oldDate = now.getTime() - 86400000;
    const newDate = internalChecks(
      year,
      month,
      dayOfMonth,
      hh,
      mm,
      ss,
      fff,
      ampm,
    );

    if (isPastDate) {
      if (newDate !== 0 && `${newDate}` < `${oldDate}`) {
        return newDate;
      }

      return internalChecks(year - 1, month, dayOfMonth, hh, mm, ss, fff, ampm);
    }

    if (newDate !== 0 && `${newDate}` > `${oldDate}`) {
      return newDate;
    }

    return internalChecks(year + 1, month, dayOfMonth, hh, mm, ss, fff, ampm);
  }

  return internalChecks(year, month, dayOfMonth, hh, mm, ss, fff, ampm);
};

// ------------------------------------------------------------------
// tryParse( date_string [,isPastDate])
//
// This function takes a date string and tries to match it to a
// number of possible date formats to get the value. It will try to
// match against the following international formats, in this order:
// y-M-d   MMM d, y   MMM d,y   y-MMM-d   d-MMM-y  MMM d
// M/d/y   M-d-y      M.d.y     MMM-d     M/d      M-d
// d/M/y   d-M-y      d.M.y     d-MMM     d/M      d-M
// ------------------------------------------------------------------
{
  const generalFormats = [
    // SPACE DELIMITED PATTERNS
    'yyyy - MM - dd HH : mm : ss . fff',
    'yyyy - MM - dd T HH : mm : ss Z',
    'EE MMM d, yyyy',
    'EE MMM d, yyyy @ hh:mm a',
    'y M d',
    'y - M - d',
    'MMM d, y',
    'MMM d y',
    'MMM d',
    'y - MMM - d',
    'yyyy MMM d',
    'd - MMM - y',
    'd MMM y',
  ];
  const monthFirst = [
    'M / d / y',
    'M - d - y',
    'M . d . y',
    'MMM - d',
    'M / d',
    'M - d',
  ];
  const dateFirst = [
    'd / M / y',
    'd - M - y',
    'd . M . y',
    'd - MMM',
    'd / M',
    'd - M',
  ];

  GMTDate.CheckList = []
    .concat(generalFormats)
    .concat(dateFirst)
    .concat(monthFirst);
}

const RELATIVE = {
  today: 'floorDay',
  tomorrow: 'ceilingDay',
  eod: 'ceilingDay',
};

GMTDate.parseRelative = (val) => {
  const parts = [];

  val.split('+').forEach((t) => {
    t.split('-').forEach((tt, i) => {
      parts.push([i === 0 ? 'add' : 'subtract', tt]);
    });
  });
  const funcName = RELATIVE[first(parts)[1]];

  if (funcName) {
    let acc = GMTDate.now()[funcName]();

    parts.slice(1).forEach(([op, amount]) => {
      acc = acc[op](Duration.String2Duration(amount));
    });

    return acc;
  }

  return Duration.parse(val);
};

GMTDate.tryParse = (val_, isFutureDate = false) => {
  const val = val_.trim();

  // ATTEMPT EXPRESSIONS
  if (Object.keys(RELATIVE).some(r => val.includes(r))) {
    return GMTDate.parseRelative(val);
  }

  let d = null;

  GMTDate.CheckList.some((format, i) => {
    d = GMTDate.getDateFromFormat(val, format, isFutureDate);

    if (d === 0) {
      return false;
    }

    // MAKE THIS THE PREFERRED FORMAT
    GMTDate.CheckList.splice(i, 1);
    GMTDate.CheckList.unshift(format);

    return true;
  });

  return d;
};

GMTDate.EPOCH = GMTDate.newInstance('1/1/1970');

GMTDate.range = ({ min, max, interval }) => {
  const output = [];
  const min_ = GMTDate.newInstance(min);
  const max_ = GMTDate.newInstance(max);
  const interval_ = Duration.newInstance(interval);
  let acc = min_;

  for (; acc < max_; acc = acc.add(interval_)) {
    output.push(acc);
  }

  return output;
};

strings.format = (value, format) => {
  const ff = coalesce(format, 'yyyy-MM-dd HH:mm:ss');

  return GMTDate.newInstance(value).format(ff);
};

strings.unix = value => GMTDate.newInstance(value).unix();

export { GMTDate }; // eslint-disable-line import/prefer-default-export
