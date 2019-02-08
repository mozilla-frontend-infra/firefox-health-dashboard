import generateDatasetStyle from './generateDatasetStyle';
import SETTINGS from '../../settings';
import { frum } from '../queryOps';
import CONFIG from '../nimbledroid/config';

const nimbledroidFormatter = scenario => ({
  datasets: frum(scenario)
    .enumerate()
    .map((pckage, index) => {
      const { packageId } = pckage;

      return {
        data: pckage.data
          .map(({ date, value }) => ({ x: date, y: value }))
          .toArray(),
        label: CONFIG.packageIdLabels[packageId],
        ...generateDatasetStyle(SETTINGS.colors[index]),
      };
    })
    .toArray(),
});

export default nimbledroidFormatter;
