import moment from 'moment';
import fetchCrashStats from '../fetch/crash-stats';
import { getHistory } from '../release/history';

export async function getAdi({ product, channel, dateRange }) {
  const soccoroProduct = (product === 'fennec') ? 'FennecAndroid' : 'Firefox';
  const versions = (await getHistory({
    product,
    channel,
    tailDate: dateRange[0],
  }))
    .map(({ version }) => version);
  return (await fetchCrashStats({
    product: soccoroProduct,
    versions: versions,
    platforms: ['Windows', 'Mac OS X', 'Linux'],
    start_date: moment(dateRange[0]).format('YYYY-MM-DD'),
    end_date: moment(dateRange[1]).format('YYYY-MM-DD'),
  }, { endpoint: 'ADI' })).hits
    .map(({ adi_count, date, version }) => {
      return {
        date,
        version,
        adi: adi_count,
      };
    });
}
