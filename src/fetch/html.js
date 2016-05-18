import fetchText from './text';
import cheerio from 'cheerio';

export default async function fetchHtml(url, options = {}) {
  const xml = {
    options = false
  } = options || {};
  const text = await fetchText(url, options);
  if (!text) {
    return null;
  }
  return cheerio.load(text, { xmlMode: xml });
}
