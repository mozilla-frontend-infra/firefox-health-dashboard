import generateDatasetStyle from './generateDatasetStyle';
import SETTINGS from '../../settings';
import CONFIG from '../nimbledroid/config';
import { selectFrom, toPairs } from '../../vendor/vectors';
import Date from '../../vendor/dates';

const SINCE = Date.newInstance('today-13week').milli();
const nimbledroidFormatter = ({ data }) => ({
  datasets: toPairs(data)
    .enumerate()
    .map((details, packageId, index) => ({
      data: selectFrom(details)
        .filter(({ date }) => date > SINCE)
        .select({ x: 'date', y: 'value' })
        .toArray(),
      label: CONFIG.packageIdLabels[packageId],
      ...generateDatasetStyle(SETTINGS.colors[index]),
    }))
    .toArray(),
});

export default nimbledroidFormatter;
