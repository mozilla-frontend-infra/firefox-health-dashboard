import queryPerformanceData from '@mozilla-frontend-infra/perf-goggles';
import perfherderFormatter from './perfherderFormatter';

const getPerfherderData = async (series, timeRange) => {
    const data = await Promise.all(series
        .map(async (config) => {
            const seriesData = await queryPerformanceData(config, timeRange);
            const seriesDatum = (Object.values(seriesData)).pop();
            return {
                ...seriesDatum,
                label: config.label,
            };
    }));
    return perfherderFormatter(data);
};

export default getPerfherderData;
