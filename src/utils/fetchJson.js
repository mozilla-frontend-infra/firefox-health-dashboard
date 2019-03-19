/* global fetch */

const jsonHeaders = {
  Accept: 'application/json',
};
const fetchJson = async url => {
  const response = await fetch(url, jsonHeaders);

  if (!response) return null;

  try {
    return response.json();
  } catch (error) {
    throw new Error(`Problem parsing ${response.text()}`);
    // throw new Error("Problem parsing {{text}}", {text: response.text()});
  }
};

export default fetchJson;
