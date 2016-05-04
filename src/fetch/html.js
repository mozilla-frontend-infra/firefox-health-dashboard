import fetchText from './text';
import cheerio from 'cheerio';

export default async function fetchHtml(url, xml = false) {
  const text = await fetchText(url);
  if (!text) {
    return null;
  }
  return cheerio.load(text, { xmlMode: xml });
}
