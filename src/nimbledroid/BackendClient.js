/* global fetch */
import SETTINGS from '../settings';
import NimbledroidApiHandler from './NimbledroidApiHandler';

class BackendClient {
  constructor() {
    this.baseUrl = SETTINGS.backend;
    this.handlers = {
      nimbledroid: new NimbledroidApiHandler(this.baseUrl),
    };
  }

  getData(apiName, parameters) {
    return this.handlers[apiName].getData(parameters);
  }
}

export default BackendClient;
