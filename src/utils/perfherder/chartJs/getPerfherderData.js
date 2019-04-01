import { queryPerformanceData } from '../../../vendor/perf-goggles';
import SETTINGS from '../../../settings';
import { missing } from '../../../vendor/utils';

const getPerfherderData = async series => {
  const newData = new Array(series.length);

  await Promise.all(
    series.map(async ({ label, seriesConfig, options = {} }, index) => {
      let color;

      if (options.includeSubtests) {
        color = SETTINGS.colors[index];
      }

      const seriesData = await queryPerformanceData(seriesConfig, options);

      Object.values(seriesData).forEach(seriesInfo => {
        let actualLabel = label;

        if (!seriesConfig.test && options.includeSubtests) {
          const { suite, test } = seriesInfo.meta;

          actualLabel = test
            ? test.replace(`${seriesInfo.meta.suite}-`, '')
            : suite;
        }

        newData[index] = {
          ...seriesInfo,
          color,
          label: actualLabel,
        };
      });
    })
  );

  if (newData.every(missing)) {
    throw new Error(
      `can not get data for ${JSON.stringify(series[0].seriesConfig)}`
    );
  }

  return newData;
};

export default getPerfherderData;
