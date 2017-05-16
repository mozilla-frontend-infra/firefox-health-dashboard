/* eslint-disable */

function assert(condition, message) {
  if (!condition) {
    console.error('telemetry-node', message || 'Assertion failed');
  }
  return condition;
}

const Telemetry = {
  BASE_URL: 'https://aggregates.telemetry.mozilla.org/',
  CHANNEL_VERSION_DATES: null,
  CHANNEL_VERSION_BUILDIDS: null,
  CACHE: {},
  CACHE_LAST_UPDATED: {},
  CACHE_TIMEOUT: 4 * 60 * 60 * 1000,
  MAX_URL_LENGTH: 4094,
};

const urlCallbacks = {};

Telemetry.Histogram = (function () {
  function Histogram(buckets, values, kind, submissions, sum,
    description, measure) {
    assert(['number', 'string'].indexOf(typeof buckets[0]) > -1,
        `\`buckets\` must be an array of numbers or strings, is array of ${typeof buckets[0]}`);
    assert(typeof values[0] === 'number',
       `\`values\` must be an array of numbers, is array of ${typeof values[0]}`);
    assert(['flag', 'boolean', 'count', 'enumerated', 'linear',
      'exponential', 'categorical'].indexOf(kind) >= 0,
      `\`kind\` must be a valid histogram kind, is ${kind}`);
    assert(typeof submissions === 'number',
      `\`submissions\` must be a number, is ${typeof submissions}`);
    assert(typeof sum === 'number',
      `\`sum\` must be a number, is ${typeof sum}`);
    assert(typeof description === 'string',
      `\`description\` must be a string, is ${typeof description}`);
    assert(typeof measure === 'string',
      `\`measure\` must be a string, is ${typeof measure}`);
    this.buckets = buckets;
    this.values = values;

    this.count = this.values.reduce((previous, count) => {
      return previous + count;
    }, 0);
    this.kind = kind;
    this.submissions = submissions;
    this.sum = sum;
    this.description = description;
    this.measure = measure;
  }

  Histogram.prototype.lastBucketUpper = function () {
    assert(this.buckets.length > 0,
      'Histogram buckets cannot be empty');
    if (this.buckets.length == 1) return this.buckets[0] + 1;
    if (this.kind === 'linear' || this.kind === 'flag' || this.kind ===
      'boolean' || this.kind === 'enumerated') { // linear buckets
      return this.buckets[this.buckets.length - 1] + this.buckets[
        this.buckets.length - 1] - this.buckets[this.buckets.length -
        2];
    }  // exponential buckets
    return this.buckets[this.buckets.length - 1] * this.buckets[
        this.buckets.length - 1] / this.buckets[this.buckets.length -
        2];
  };

  Histogram.prototype.mean = function () {
    const buckets = this.buckets.concat([this.lastBucketUpper(this.buckets,
      this.kind)]);
    let totalHits = 0,
      bucketHits = 0;
    const linearTerm = (buckets[buckets.length - 1] - buckets[buckets.length -
      2]) / 2;
    const exponentialFactor = Math.sqrt(buckets[buckets.length - 1] /
      buckets[buckets.length - 2]);
    const useLinearBuckets = this.kind === 'linear' || this.kind ===
      'flag' || this.kind === 'boolean' || this.kind === 'enumerated';
    this.values.forEach((count, i) => {
      totalHits += count;
      const centralX = useLinearBuckets ? buckets[i] + linearTerm :
        buckets[i] * exponentialFactor; // find the center of the current bucket
      bucketHits += count * centralX;
    });
    return bucketHits / totalHits;
  };

  Histogram.prototype.percentile = function (percentile) {
    assert(typeof percentile === 'number',
      '`percentile` must be a number');
    assert(percentile >= 0 && percentile <= 100,
      '`percentile` must be between 0 and 100 inclusive');
    const buckets = this.buckets.concat([this.lastBucketUpper()]);
    const linearTerm = buckets[buckets.length - 1] - buckets[buckets.length -
      2];
    const exponentialFactor = buckets[buckets.length - 1] / buckets[
      buckets.length - 2];

    let hitsAtPercentileInBar = this.values.reduce((previous,
      count) => {
      return previous + count;
    }, 0) * (percentile / 100);
    let percentileBucketIndex = 0;
    while (hitsAtPercentileInBar >= 0) {
      hitsAtPercentileInBar -= this.values[percentileBucketIndex];
      percentileBucketIndex++;
    }
    percentileBucketIndex--;
    hitsAtPercentileInBar += this.values[percentileBucketIndex]; // decrement to get to the bar containing the percentile
    const ratioInBar = hitsAtPercentileInBar / this.values[
      percentileBucketIndex]; // the ratio of the hits in the percentile to the hits in the bar containing it - how far we are inside the bar
    if (this.kind === 'linear' || this.kind === 'flag' || this.kind ===
      'boolean' || this.kind === 'enumerated') { // linear buckets
      return buckets[percentileBucketIndex] + linearTerm * ratioInBar; // linear interpolation within bar
    }  // exponential buckets
    return buckets[percentileBucketIndex] * Math.pow(
        exponentialFactor, ratioInBar); // geometric interpolation within bar
  };

  Histogram.prototype.map = function (callback) {
    const buckets = this.buckets.concat([this.lastBucketUpper()]);
    const histogram = this;
    return this.values.map((count, i) => {
      return callback.call(histogram, count, buckets[i], buckets[
        i + 1], i);
    });
  };

  return Histogram;
}());

Telemetry.Evolution = (function () {
  function Evolution(buckets, data, kind, description, measure) {
    assert(['number', 'string'].indexOf(typeof buckets[0]) > -1,
        `\`buckets\` must be an array of numbers or strings, is array of ${typeof buckets[0]}`);
    assert(typeof data[0].histogram[0] === 'number',
      `\`data\` must be an array of numbers, is array of ${typeof data[0].histogram[0]}`);
    assert(typeof kind === 'string',
      `\`kind\` must be a string, is ${typeof kind}`);
    assert(typeof description === 'string',
      `\`description\` must be a string, is ${typeof description}`);
    assert(typeof measure === 'string',
      `\`measure\` must be a string, is ${typeof measure}`);
    this.buckets = buckets;
    this.data = data;
    this.kind = kind;
    this.description = description;
    this.measure = measure;
  }

  Evolution.prototype.dates = function () {
    return this.data.map((entry) => {
      assert(entry.date.length === 8, 'Invalid date string');
      let YYYY = entry.date.substring(0, 4),
        MM = entry.date.substring(4, 6),
        DD = entry.date.substring(6, 8);
      return new Date(`${YYYY}-${MM}-${DD}`);
    })
      .sort((a, b) => {
        return a - b;
      });
  };

  Evolution.prototype.combine = function (otherEvolution) {
    assert(otherEvolution.buckets.length > 0,
      '`otherEvolution` must be a histograms collection');
    assert(this.kind === otherEvolution.kind,
      '`this` and `otherEvolution` must be of the same kind');
    assert(this.buckets.length === otherEvolution.buckets.length,
      '`this` and `otherEvolution` must have the same buckets');
    const dateMap = {}; // Collate the histogram entries by date
    this.data.forEach((histogramEntry) => {
      if (!dateMap.hasOwnProperty(histogramEntry.date)) {
        dateMap[histogramEntry.date] = [];
      }
      dateMap[histogramEntry.date].push(histogramEntry);
    });
    otherEvolution.data.forEach((histogramEntry) => {
      if (!dateMap.hasOwnProperty(histogramEntry.date)) {
        dateMap[histogramEntry.date] = [];
      }
      dateMap[histogramEntry.date].push(histogramEntry);
    });
    const data = Object.keys(dateMap)
      .sort()
      .map((date) => {
        const entries = dateMap[date];
        const histogram = entries[0].histogram.map((count) => {
          return 0;
        });
        entries.forEach((entry) => { // go through each histogram entry and combine histograms
          entry.histogram.forEach((count, i) => {
            histogram[i] += count;
          });
        });
        return {
          date: date,
          count: entries.reduce((previous, entry) => {
            return previous + entry.count;
          }, 0),
          sum: entries.reduce((previous, entry) => {
            return previous + entry.sum;
          }, 0),
          label: entries[0].label,
          histogram: histogram,
        };
      });
    return new Telemetry.Evolution(this.buckets, data, this.kind,
      this.description, this.measure);
  };

  Evolution.prototype.sanitized = function () {
    let maxSubmissions = 0;
    this.data.forEach((entry) => {
      if (entry.count > maxSubmissions) {
        maxSubmissions = entry.count;
      }
    });
    const submissionsCutoff = Math.max(maxSubmissions / 100, 100);
    const timeCutoff = new Date();
    timeCutoff.setDate(timeCutoff.getDate() + 100); // Set time cutoff to 100 days in the future
    const data = this.data.filter((entry) => {
      assert(entry.date.length === 8, 'Invalid date string');
      let YYYY = entry.date.substring(0, 4),
        MM = entry.date.substring(4, 6),
        DD = entry.date.substring(6, 8);
      const date = new Date(`${YYYY}-${MM}-${DD}`);
      return entry.count >= submissionsCutoff && date <=
        timeCutoff;
    });
    if (data.length === 0) {
      return null;
    }
    return new Telemetry.Evolution(this.buckets, data, this.kind,
      this.description, this.measure);
  };

  Evolution.prototype.dateRange = function (startDate, endDate) {
    assert(startDate.getTime, '`startDate` must be a date');
    assert(endDate.getTime, '`endDate` must be a date');
    const data = this.data.filter((entry) => {
      assert(entry.date.length === 8, 'Invalid date string');
      let YYYY = entry.date.substring(0, 4),
        MM = entry.date.substring(4, 6),
        DD = entry.date.substring(6, 8);
      const date = new Date(`${YYYY}-${MM}-${DD}`);
      return startDate <= date && date <= endDate;
    });
    if (data.length === 0) {
      return null;
    }
    return new Telemetry.Evolution(this.buckets, data, this.kind,
      this.description, this.measure);
  };

  Evolution.prototype.histogram = function () {
    const submissions = this.data.reduce((submissions, entry) => {
      return submissions + entry.count;
    }, 0);
    const sum = this.data.reduce((sum, entry) => {
      return sum + entry.sum;
    }, 0);
    const values = this.data.reduce((values, entry) => {
      entry.histogram.forEach((count, i) => {
        values[i] = (values[i] || 0) + count;
      });
      return values;
    }, []);

    return new Telemetry.Histogram(this.buckets, values, this.kind,
      submissions, sum, this.description, this.measure);
  };

  Evolution.prototype.map = function (callback) {
    const evolution = this;
    return this.data.sort((a, b) => {
      return parseInt(a.date) - parseInt(b.date);
    })
      .map((entry, i) => {
        const histogram = new Telemetry.Histogram(evolution.buckets,
          entry.histogram, evolution.kind, entry.count, entry.sum,
          evolution.description, evolution.measure);

        assert(entry.date.length === 8, 'Invalid date string');
        let YYYY = entry.date.substring(0, 4),
          MM = entry.date.substring(4, 6),
          DD = entry.date.substring(6, 8);
        const date = new Date(`${YYYY}-${MM}-${DD}`);

        return callback.call(evolution, histogram, i, date);
      });
  };

  Evolution.prototype.means = function () {
    return this.map((histogram, i) => {
      return histogram.mean();
    });
  };

  Evolution.prototype.percentiles = function (percentile) {
    return this.map((histogram, i) => {
      return histogram.percentile(percentile);
    });
  };

  Evolution.prototype.submissions = function () {
    return this.map((histogram, i) => {
      return histogram.submissions;
    });
  };

  return Evolution;
}());

Telemetry.getJSON = function (url, callback) {
  assert(typeof url === 'string', '`url` must be a string');
  assert(typeof callback === 'function', '`callback` must be a function');
  assert(url.length <= Telemetry.MAX_URL_LENGTH, `\`url\` is too long (${url.length} > ${Telemetry.MAX_URL_LENGTH})`);
  if (Telemetry.CACHE[url] !== undefined) {
    if (Telemetry.CACHE[url] !== null && Telemetry.CACHE[url]._loading) { // Requested but not yet loaded
      var xhr = Telemetry.CACHE[url];
      let originalLoadCallback = xhr.onload,
        originalErrorCallback = xhr.onerror;
      xhr.onload = function () {
        if (this.status !== 200) {
          callback(null, this.status);
        } else {
          callback(JSON.parse(this.responseText), null);
        }
        originalLoadCallback.call(this);
      };
      xhr.onerror = function () {
        callback(null, this.status);
        originalErrorCallback.call(this);
      };
      return;
    } else if ((new Date())
      .getTime() - Telemetry.CACHE_LAST_UPDATED[url] < Telemetry.CACHE_TIMEOUT
    ) { // In cache and hasn't expired
      setTimeout(() => {
        callback(Telemetry.CACHE[url], Telemetry.CACHE[url] === null ?
          404 : null);
      }, 1);
      return;
    }
  }

  var xhr = new XMLHttpRequest();
  xhr._loading = true;
  Telemetry.CACHE[url] = xhr; // Mark the URL as being requested but not yet loaded
  xhr.onload = function () {
    if (this.status !== 200) {
      if (this.status === 404) { // Cache the null result if the URL resolves to a resource or missing resource
        Telemetry.CACHE[url] = null;
        Telemetry.CACHE_LAST_UPDATED[url] = (new Date())
          .getTime();
      } else { // Result was invalid, remove the current request from the cache
        delete Telemetry.CACHE[url];
      }
      callback(null, this.status);
    } else { // Request was successful
      const result = JSON.parse(this.responseText);
      Telemetry.CACHE[url] = result;
      Telemetry.CACHE_LAST_UPDATED[url] = (new Date())
        .getTime();
      callback(result, this.status);
    }
  };
  xhr.onerror = function () { // Network-level error, notify the callback
    delete Telemetry.CACHE[url];
    callback(null, this.status);
  };
  xhr.open('get', url, true);
  xhr.send();
};

let _init;
let _initCompletedCallbacks;
Telemetry.init = function Telemetry_init(callback) {
  assert(typeof callback === 'function', '`callback` must be a function');

  if (_init) {
    callback();
    return;
  }
  if (_initCompletedCallbacks) {
    _initCompletedCallbacks.push(callback);
    return;
  }
  _initCompletedCallbacks = [
    function () { _init = true; },
    callback,
  ];

  Telemetry.getJSON(`${Telemetry.BASE_URL
    }aggregates_by/build_id/channels/`,
    (channels) => {
      let loadedChannels = 0,
        expectedChannels = channels.length * 2;
      Telemetry.CHANNEL_VERSION_BUILDIDS = {};
      Telemetry.CHANNEL_VERSION_DATES = {};
      channels.forEach((channel, i) => {
        const versionBuildIds = Telemetry.CHANNEL_VERSION_BUILDIDS[
          channel] = {};
        Telemetry.getJSON(`${Telemetry.BASE_URL
          }aggregates_by/build_id/channels/${channel
          }/dates/`,
          (buildIdEntries) => {
            buildIdEntries.forEach((entry) => {
              if (!versionBuildIds.hasOwnProperty(entry.version)) {
                versionBuildIds[entry.version] = [];
              }
              versionBuildIds[entry.version].push(entry.date);
            });
            loadedChannels++; // Loaded another channel's dates
            if (loadedChannels == expectedChannels) {
              _initCompletedCallbacks.forEach((callback) => {
                callback();
              });
            } // This is the last channel that needs to be loaded
          });

        const versionDates = Telemetry.CHANNEL_VERSION_DATES[channel] = {};
        Telemetry.getJSON(`${Telemetry.BASE_URL
          }aggregates_by/submission_date/channels/${channel
          }/dates/`,
          (dateEntries) => {
            dateEntries.forEach((entry) => {
              if (!versionDates.hasOwnProperty(entry.version)) {
                versionDates[entry.version] = [];
              }
              versionDates[entry.version].push(entry.date);
            });
            loadedChannels++; // Loaded another channel's dates
            if (loadedChannels == expectedChannels) {
              _initCompletedCallbacks.forEach((callback) => {
                callback();
              });
            } // This is the last channel that needs to be loaded
          });
      });
    });
};

Telemetry.getHistogramInfo = function Telemetry_getHistogramInfo(channel,
  version, metric, _, callback) {
  assert(Telemetry.CHANNEL_VERSION_DATES !== null && Telemetry.CHANNEL_VERSION_BUILDIDS !==
    null, 'Telemetry.js must be initialized before use');
  assert(typeof channel === 'string', '`channel` must be a string');
  assert(typeof version === 'string', '`version` must be a string');
  assert(typeof metric === 'string', '`metric` must be a string');
  assert(typeof callback === 'function', '`callback` must be a function');
  const dates = Telemetry.CHANNEL_VERSION_DATES[channel][version].join(',');
  const url = `${Telemetry.BASE_URL}aggregates_by/submission_date` +
    `/channels/${encodeURIComponent(channel)}/?version=${
    encodeURIComponent(version)}&dates=${dates
    }&metric=${encodeURIComponent(metric)}`;
  Telemetry.getJSON(url, (histograms, status) => {
    if (histograms === null) {
      callback(null, null, null, dates);
    } else {
      callback(histograms.kind, histograms.description, histograms.buckets,
        dates);
    }
  });
};

function populateEntriesMap(entriesMap, url, callback) {
  Telemetry.getJSON(url, (histograms, status) => {
    if (histograms === null) {
      assert(status === 404, `Could not obtain evolution: status ${
        status} (${url})`); // Only allow null evolution if it is 404 - if there is no evolution for the given filters
      callback({});
    } else {
      histograms.data.forEach((entry) => {
        if (!entriesMap.hasOwnProperty(entry.label)) {
          entriesMap[entry.label] = [];
        }
        entriesMap[entry.label].push(entry);
      });
      callback(entriesMap, histograms);
    }
  });
}

function entriesMapToEvolutionMap(entriesMap, histograms, metric) {
  const evolutionMap = {};
  for (const label in entriesMap) {
    evolutionMap[label] = new Telemetry.Evolution(histograms.buckets,
      entriesMap[label], histograms.kind, histograms.description,
      metric);
  }
  return evolutionMap;
}


Telemetry.getEvolution = function Telemetry_getEvolution(channel, version,
  metric, filters, useSubmissionDate, callback) {
  assert(Telemetry.CHANNEL_VERSION_DATES !== null && Telemetry.CHANNEL_VERSION_BUILDIDS !==
    null, 'Telemetry.js must be initialized before use');
  assert(typeof channel === 'string', '`channel` must be a string');
  assert(typeof version === 'string', '`version` must be a string');
  assert(typeof metric === 'string', '`metric` must be a string');
  assert(typeof filters === 'object', '`filters` must be an object');
  assert(typeof callback === 'function', '`callback` must be a function');
  const dates = (useSubmissionDate ? Telemetry.CHANNEL_VERSION_DATES :
    Telemetry.CHANNEL_VERSION_BUILDIDS)[channel][version].join(',');
  let filterString = '';
  Object.keys(filters)
    .sort()
    .forEach((filterName) => { // we need to sort the keys in order to make sure the same filters result in the same URL each time, for caching
      let filter = filters[filterName];
      if (!Array.isArray(filter)) {
        filter = [filter];
      }

      for (let i = 0; i < filter.length; ++i) {
        filterString += `&${encodeURIComponent(filterName)}=${
          encodeURIComponent(filter[i])}`;
      }
    });
  const url = `${Telemetry.BASE_URL}aggregates_by/${useSubmissionDate ?
      'submission_date' : 'build_id'
    }/channels/${encodeURIComponent(channel)}/?version=${
    encodeURIComponent(version)}&dates=${
    encodeURIComponent(dates)}&metric=${encodeURIComponent(metric)
    }${filterString}`;
  const entriesMap = {};
  if (url.length > Telemetry.MAX_URL_LENGTH) {
    assert(useSubmissionDate, '`url` is too long because of build_id?!');
    // Some versions have submission dates ranging across years.
    // This makes for urls that are too long and need to be chopped.
    const submissionDates = Telemetry.CHANNEL_VERSION_DATES[channel][version];
    let dates_half = submissionDates.slice(0, submissionDates.length / 2);
    let url_half = `${Telemetry.BASE_URL}aggregates_by/submission_date/channels/${
      encodeURIComponent(channel)}/?version=${encodeURIComponent(version)
      }&dates=${encodeURIComponent(dates_half.join(','))}&metric=${
      encodeURIComponent(metric)}${filterString}`;
    populateEntriesMap(entriesMap, url_half, (entriesMap) => {
      dates_half = submissionDates.slice(submissionDates.length / 2);
      url_half = `${Telemetry.BASE_URL}aggregates_by/submission_date/channels/${
        encodeURIComponent(channel)}/?version=${encodeURIComponent(version)
        }&dates=${encodeURIComponent(dates_half.join(','))}&metric=${
        encodeURIComponent(metric)}${filterString}`;
      populateEntriesMap(entriesMap, url_half, (entriesMap, histograms) => {
        callback(entriesMapToEvolutionMap(entriesMap, histograms, metric));
      });
    });
    return;
  }
  populateEntriesMap(entriesMap, url, (entriesMap, histograms) => {
    callback(entriesMapToEvolutionMap(entriesMap, histograms, metric));
  });
};

Telemetry.getFilterOptions = function Telemetry_getFilterOptions(channel,
  version, callback) {
  assert(typeof channel === 'string', '`channel` must be a string');
  assert(typeof version === 'string', '`version` must be a string');
  assert(typeof callback === 'function', '`callback` must be a function');
  const url = `${Telemetry.BASE_URL}filters/?channel=${encodeURIComponent(
    channel)}&version=${encodeURIComponent(version)}`;
  Telemetry.getJSON(url, (filterOptions, status) => {
    if (filterOptions === null) {
      assert(status === 404,
        `Could not obtain filter options: status ${status} (${
        url})`); // Only allow null filter options if it is 404 - if there are no filters
      callback({});
    } else {
      filterOptions.metric = filterOptions.metric.filter(
        (measure) => {
          return !/^STARTUP_/.test(measure); // Ignore STARTUP_* histograms since nobody ever uses them
        });
      callback(filterOptions);
    }
  });
};

Telemetry.getVersions = function Telemetry_getVersions(fromVersion,
  toVersion) { // shim function
  assert(Telemetry.CHANNEL_VERSION_DATES !== null && Telemetry.CHANNEL_VERSION_BUILDIDS !==
    null, 'Telemetry.js must be initialized before use');
  assert((fromVersion === undefined && toVersion === undefined) || (
      typeof fromVersion === 'string' && typeof toVersion === 'string'),
    '`fromVersion` and `toVersion` must be strings');
  const versions = [];
  for (const channel in Telemetry.CHANNEL_VERSION_DATES) {
    for (const version in Telemetry.CHANNEL_VERSION_DATES[channel]) {
      // Only output a channel/version if it is in both the buildID versions and the submission date versions (sometimes there is invalid data where a version is in submission date versions but not buildID versions, see https://bugzilla.mozilla.org/show_bug.cgi?id=1189727)
      if (Telemetry.CHANNEL_VERSION_BUILDIDS[channel] && Telemetry.CHANNEL_VERSION_BUILDIDS[
          channel][version]) {
        versions.push(`${channel}/${version}`);
      }
    }
  }
  versions.sort();
  return fromVersion !== undefined ? versions.filter((version) => {
    return fromVersion <= version && version <= toVersion;
  }) : versions;
};

export default Telemetry;
