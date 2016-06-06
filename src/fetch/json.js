import fetchText from './text';

export default async function fetchJson(url, options) {
  const text = await fetchText(url, options);
  if (!text) {
    return null;
  }
  return JSON.parse(text);
}
