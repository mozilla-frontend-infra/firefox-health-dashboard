import fetchText from './text';
import cheerio from 'cheerio';

export default async function fetchHtml(url, options = {}) {
  const xml = options.xml || false;
  delete options.xml;
  const text = await fetchText(url);
  if (!text) {
    return null;
  }
  return cheerio.load(text, { xmlMode: xml });
}
