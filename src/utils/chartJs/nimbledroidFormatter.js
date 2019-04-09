import generateDatasetStyle from './generateDatasetStyle';
import SETTINGS from '../../settings';
import CONFIG from '../nimbledroid/config';
import { selectFrom, toPairs } from '../../vendor/vectors';

// Show past 13weeks of minbledroid
const SINCE = new Date(
  (Math.floor(new Date().getTime() / (24 * 60 * 60 * 1000)) - 13 * 7) *
    (24 * 60 * 60 * 1000)
);
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
