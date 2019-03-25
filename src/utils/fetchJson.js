/* global fetch */

const jsonHeaders = {
  Accept: 'application/json',
};
const fetchJson = async url => {
  const response = await fetch(url, jsonHeaders);

  if (!response) {
    return null;
  }

  return response.json();
};

export default fetchJson;
