import queryPerformanceData from '@mozilla-frontend-infra/perf-goggles';
import perfherderFormatter from './perfherderFormatter';
import SETTINGS from '../../../settings';

const getPerfherderData = async (series) => {
    const newData = [];
    await Promise.all(series
        .map(async ({ label, seriesConfig, options = {} }, index) => {
            let color;
            if (options.includeSubtests) {
                color = SETTINGS.colors[index];
            }
            const seriesData = await queryPerformanceData(seriesConfig, options);
            Object.values(seriesData).forEach((seriesInfo) => {
                let actualLabel = label;
                if (options.includeSubtests) {
                    const { suite, test } = seriesInfo.meta;
                    actualLabel = test ? test.replace(`${seriesInfo.meta.suite}-`, '') : suite;
                }
                newData.push({
                    ...seriesInfo,
                    color,
                    label: actualLabel,
                });
            });
    }));
    return perfherderFormatter(newData);
};

export default getPerfherderData;
