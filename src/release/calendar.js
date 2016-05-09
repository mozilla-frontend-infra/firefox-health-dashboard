import moment from 'moment';
import ical from 'ical';
import fetchText from '../fetch/text';

export default async function getCalendar() {
  const url = 'https://calendar.google.com/calendar/ical/mozilla.com_2d37383433353432352d3939%40resource.calendar.google.com/public/basic.ics';
  const ics = await fetchText(url);
  const parsed = ical.parseICS(ics);
  const data = Object.keys(parsed).reduce((data, key) => {
    const entry = parsed[key];
    if (moment().diff(entry.start, 'days') > 7) {
      return data;
    }
    const summary = entry.summary.match(/Firefox\s+(ESR)?\s*([\d.]+)\s+Release/);
    if (!summary) {
      return data;
    }
    data.push({
      version: summary[2],
      channel: summary[1] ? 'esr' : 'release',
      date: moment(entry.start).format('YYYY-MM-DD')
    });
    return data;
  }, []);
  data.sort((a, b) => (a.date < b.date) ? -1 : 1);
  return data;
}
