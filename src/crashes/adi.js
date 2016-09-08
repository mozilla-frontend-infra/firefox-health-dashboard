import moment from 'moment';
import fetchCrashStats from '../fetch/crash-stats';
import { getHistory } from '../release/history';

export async function getAdi({ product, channel, dateRange }) {
  const soccoroProduct = (product === 'fennec') ? 'FennecAndroid' : 'Firefox';
  console.log('soccoroProduct', soccoroProduct);
  const versions = (await getHistory({
    product,
    channel,
    tailDate: dateRange[0],
  }))
    .map(({ version }) => version);
  const combinedAdi = {};
  (await fetchCrashStats({
    product: soccoroProduct,
    versions: versions,
    platforms: ['Windows', 'Mac OS X', 'Linux'],
    start_date: moment(dateRange[0]).format('YYYY-MM-DD'),
    end_date: moment(dateRange[1]).format('YYYY-MM-DD'),
  }, { endpoint: 'ADI' })).hits
    .forEach(({ adi_count, date, version }) => {
      combinedAdi[date] = (combinedAdi[date] || 0) + adi_count;
      // return {
      //   date,
      //   version,
      //   adi: adi_count,
      // };
    });

  const combinedCrashes = {};
  let endDate = moment(dateRange[1]);
  let startDate = null;
  while (moment(dateRange[0]).diff(endDate) < 0) {
    startDate = moment.max(endDate.add(-100, 'day'), dateRange[0]);
    console.log(moment(startDate).format('YYYY-MM-DD'));
    const facets = (await fetchCrashStats({
      product: soccoroProduct,
      versions: versions,
      platforms: ['Windows', 'Mac OS X', 'Linux'],
      date: [
        `>=${moment(startDate).format('YYYY-MM-DD')}`,
        `<${moment(endDate).format('YYYY-MM-DD')}`,
      ],
      '_histogram.date': 'version',
      _results_number: 0,
      _facets: 'histogram_date',
      uptime: '>=60',
    }, { endpoint: 'SuperSearch' })).facets;
    // .histogram_date
    // .forEach(({ term, count }) => {
    //   const date = term.slice(0, 8);
    //   combinedCrashes[date] = (combinedCrashes[date] || 0) + count;
    // });
    endDate = startDate;
  }

  console.log(combinedCrashes);
}
