/* global window */
import { delayedValue } from './utils';
import { Log } from './logs';

const { indexedDB } = window;
const dbVersion = 1;

class KVStoreDummy {
  async get() {
    return null;
  }

  async set() {
    return null;
  }
}

class KVStoreInternal {
  constructor(name) {
    this.db = delayedValue();
    this.name = name;
    const request = indexedDB.open(name, dbVersion);

    request.onupgradeneeded = (event) => {
      event.target.result.createObjectStore(name);
    };

    request.onerror = (event) => {
      throw Log.error(
        'Error creating/accessing IndexedDB database {{event}}',
        {},
        event.target.error,
      );
    };

    request.onsuccess = (event) => {
      this.db.resolve(event.target.result);
    };
  }

  async get(key) {
    const output = delayedValue();
    const request = (await this.db)
      .transaction(this.name)
      .objectStore(this.name)
      .get(key);

    request.onsuccess = (event) => {
      output.resolve(event.target.result);
    };

    request.onerror = (event) => {
      output.reject(event.target.error);
    };

    return output;
  }

  /*
  return key when successful
   */
  async set(key, value) {
    const output = delayedValue();
    const request = (await this.db)
      .transaction(this.name, 'readwrite')
      .objectStore(this.name)
      .put(value, key);

    request.onsuccess = (event) => {
      output.resolve(event.target.result);
    };

    request.onerror = (event) => {
      output.reject(event.target.error);
    };

    return output;
  }
}

const KVStore = !indexedDB ? KVStoreDummy : KVStoreInternal;

// eslint-disable-next-line import/prefer-default-export
export { KVStore };
