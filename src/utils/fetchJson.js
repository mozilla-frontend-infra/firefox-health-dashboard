/* global fetch */
import { Log } from '../vendor/logs';

const jsonHeaders = {
  Accept: 'application/json',
};
const fetchJson = async url => {
  const response = await fetch(url, jsonHeaders);

  if (!response) return null;

  if (response.status !== 200) {
    Log.error('{{status}} when calling {{url}}', {
      url,
      status: response.status,
    });
  }

  try {
    return response.json();
  } catch (error) {
    Log.error(`Problem parsing ${response.text()}`);
    // Log.error("Problem parsing {{text}}", {text: response.text()});
  }
};

export default fetchJson;
