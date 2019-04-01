import { parse } from 'query-string';
import generateDatasetStyle from '../../chartJs/generateDatasetStyle';
import { missing } from '../../../vendor/utils';

const dataToChartJSformat = data =>
  data.map(({ datetime, value }) => ({
    x: datetime,
    y: value,
  }));
const generateInitialOptions = series => {
  // TODO: map tests and suite scores to measurement units and
  // add some label for scale
  const isTest = !missing(series[0].meta.test);
  // CRAZY ASSUMPTION THAT TESTS ARE A MEASURE OF DURATION
  const higherIsBetter = isTest ? false : !series[0].meta.lower_is_better;

  return {
    reverse: higherIsBetter,
    scaleLabel: higherIsBetter ? 'Score' : 'Duration',
    tooltips: {
      enabled: false,
    },
    series,
  };
};

/* This function combines Perfherder series and transforms it
into ChartJS formatting */
const perfherderFormatter = series => {
  const newData = {
    data: { datasets: [] },
    // all the series beed to be send, in order to build a custom tooltip
    options: generateInitialOptions(series),
  };

  series.forEach(({ color, data, label, perfherderUrl, style = {} }, index) => {
    if (data) {
      const temp = {
        ...generateDatasetStyle({ index, color, type: 'scatter', ...style }),
        label,
        data: dataToChartJSformat(data),
      };

      newData.data.datasets.push(temp);
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
