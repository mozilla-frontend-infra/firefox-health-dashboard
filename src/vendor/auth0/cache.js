import { sleep } from '../signals';
import { json2value, value2json } from '../convert';
import { GMTDate as Date } from '../dates';
import { missing, coalesce } from '../utils';
import { Data } from '../datas';
import { Log } from '../logs';

const ls = window.localStorage;

class Cache {
  constructor({ name, onStateChange, pleaseStop }) {
    this.name = name;
    this.value = null;
    this.timestamp = 0;
    this.onStateChange = coalesce(onStateChange, () => 0); // function called when external change happened
    this.pleaseStop = pleaseStop;
    this.updater();
  }

  async updater() {
    while (!this.pleaseStop.valueOf()) {
      const { name } = this;
      const timestamp = json2value(ls.getItem(`${name}.timestamp`));
      if (this.timestamp === timestamp) {
        /* eslint-disable-next-line no-await-in-loop */
        await sleep(1);
        /* eslint-disable-next-line no-continue */
        continue;
      }

      if (this.timestamp > timestamp) {
        // update storage with newer value
        this.pushToStorage();
      } else {
        // let storage update this.value
        this.timestamp = timestamp;
        this.value = json2value(ls.getItem(`${name}.value`));
        try {
          this.onStateChange(timestamp);
        } catch (e) {
          Log.warning('callback after change in {{name|quote}} failed', { name });
        }
      }
    }
  }

  set(value) {
    this.timestamp = Date.now().unix();
    this.value = Data.setDefault({}, value, this.value);
    this.pushToStorage();
    this.onStateChange();
  }


  get(path) {
    if (missing(path)) return this.value;
    return Data.get(this.value, path);
  }

  pushToStorage() {
    ls.setItem(`${this.name}.timestamp`, value2json(this.timestamp));
    ls.setItem(`${this.name}.value`, value2json(this.value));
  }

  clear(path) {
    this.timestamp = Date.now().unix();
    if (!path || path === '.') {
      this.value = {};
    } else {
      Data.set(this.value, path, null);
    }

    this.pushToStorage();
    this.onStateChange();
  }
}

export { Cache }; // eslint-disable-line import/prefer-default-export
