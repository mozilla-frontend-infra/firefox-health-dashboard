import { parse } from 'query-string';
import generateDatasetStyle from '../../chartJs/generateDatasetStyle';
import SETTINGS from '../../../settings';

const dataToChartJSformat = data =>
  data.map(({ datetime, value }) => ({
    x: datetime,
    y: value,
  }));
const generateInitialOptions = meta => {
  const higherIsBetter = meta.lower_is_better === false;

  return {
    reverse: higherIsBetter,
    scaleLabel: higherIsBetter ? 'Score' : 'Load time',
    tooltips: {
      callbacks: {
        footer: (tooltipItems, data) => {
          const tooltipData = [];
          let delta = 'n/a';
          let deltaPercentage = 'n/a';
          let jobLink = '';
          let hgLink = '';
          let dataset = 'n/a';
          let currentData = 'n/a';
          if (tooltipItems[0].index > 0) {
            dataset = data.datasets[tooltipItems[0].datasetIndex].data;

            currentData = dataset[tooltipItems[0].index].y;
            const previousData = dataset[tooltipItems[0].index - 1].y;

            delta = (currentData - previousData).toFixed(2);
            deltaPercentage = (((currentData - previousData) / previousData) * 100).toFixed(2);

            const tooltipDataSet = series.data[tooltipItems[0].index];
            // make job link against job id
            jobLink = `https://treeherder.mozilla.org/#/jobs?repo=mozilla-central&revision=ca0f00593e38cdab54c3a990059bbf1150e77365&selectedJob=${tooltipDataSet.job_id}&group_state=expanded`;

            // generate hg link
            const pushId = tooltipDataSet.push_id;
            const previousPushID = series.data[tooltipItems[0].index - 1].push_id;

            const pushiIdLink = `https://treeherder.mozilla.org/api/project/mozilla-central/resultset/${pushId}/?format=json`;
            const previousPushiIdLink = `https://treeherder.mozilla.org/api/project/mozilla-central/resultset/${previousPushID}/?format=json`;

            // get push data against pushid
            const pushIdData = fetchPushidData(pushiIdLink);
            const previousPushIdData = fetchPushidData(previousPushiIdLink);

            const recentRevision = pushIdData.revision;
            const previousRevision = previousPushIdData.revision;

            hgLink = `https://hg.mozilla.org/mozilla-central/pushloghtml?fromchange=${previousRevision}&tochange=${recentRevision}`;
          }
          const indicator = `${currentData} (${higherOrLower})`;
          jobLink = `Job(${jobLink})`;
          hgLink = `hg (${hgLink})`;
          tooltipData.push(indicator, `Δ ${delta} (${deltaPercentage}%)`, jobLink, hgLink);
          return tooltipData;
        },
      },
    },
  };
};

/* This function combines Perfherder series and transforms it 
into ChartJS formatting */
const perfherderFormatter = series => {
  // The first series' metadata defines the whole set
  const newData = {
    data: { datasets: [] },
    options: generateInitialOptions(series[0]),
  };

  series.forEach(({ color, data, label, perfherderUrl }, index) => {
    if (data) {
      newData.data.datasets.push({
        ...generateDatasetStyle(color || SETTINGS.colors[index]),
        label,
        data: dataToChartJSformat(data),
      });
    }

    if (!newData.jointUrl) {
      newData.jointUrl = perfherderUrl;
    } else {
      // We're joining the different series for each subbenchmark
      const parsedUrl = parse(perfherderUrl);

      newData.jointUrl += `&series=${parsedUrl.series}`;
    }
  });

  return newData;
};

export default perfherderFormatter;
