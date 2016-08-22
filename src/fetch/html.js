import cheerio from 'cheerio';
import fetchText from './text';

export default async function fetchHtml(url, options = {}) {
  const { xml = false } = options;
  const text = await fetchText(url, options);
  if (!text) {
    return null;
  }
  return cheerio.load(text, { xmlMode: xml });
}
