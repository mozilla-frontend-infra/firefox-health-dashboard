import fetchText from './text';

export default async function fetchJson(url) {
  const text = await fetchText(url);
  if (!text) {
    return null;
  }
  return JSON.parse(text);
}
