import moment from 'moment';
import fetchHtml from '../fetch/html';

export default async function getChromeHistory() {
  const versions = [];
  let lastDate = null;
  for (let i = 1; i <= 10; i++) {
    const $ = await fetchHtml(`http://filehippo.com/download_google_chrome/history/${i}/`);
    $('#program-history-list li').each((j, li) => {
      const labelish = $(li)
        .find('a:first-of-type')
        .text()
        .trim();
      if (labelish.endsWith('Beta')) {
        return;
      }
      const datish = $(li)
        .find('.detailLine')
        .text()
        .trim();
      const version = labelish.match(/(\d+\.)+\d+/)[0].trim();
      const date = moment(datish.match(/\s(\d{2}\s[a-z]{3}\s\d{4})\s/i)[1], 'DD MMM YYYY');
      if (date.isValid()) {
        lastDate = date;
        versions.push({
          date: date.format('YYYY-MM-DD'),
          version,
        });
      }
    });
    if (moment().diff(lastDate, 'months') > 12) {
      break;
    }
  }
  return versions;
}
