const jsonHeaders = {
  Accept: 'application/json',
};

const fetchJson = async (url, options) => {
  const text = await fetch(url, jsonHeaders);
  if (!text) {
    return null;
  }
  return JSON.parse(text);
};

export default fetchJson;
