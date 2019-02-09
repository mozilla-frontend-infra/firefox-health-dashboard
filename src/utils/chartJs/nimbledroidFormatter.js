import generateDatasetStyle from './generateDatasetStyle';
import SETTINGS from '../../settings';
import { frum } from '../queryOps';
import CONFIG from '../nimbledroid/config';

const nimbledroidFormatter = scenario => ({
  datasets: frum(scenario)
    .map(({ packageId, data }, index) => {
      return {
        data: data.select({ x: 'date', y: 'value' }),
        label: CONFIG.packageIdLabels[packageId],
        ...generateDatasetStyle(SETTINGS.colors[index]),
      };
    })
    .toArray(),
});

export default nimbledroidFormatter;
