import fetchJson from '../fetch/json';

const AWFY = 'https://arewefastyet.com';
const MACHINE = { 32: '37', 64: '36' };

const generateUrl = (architecture) => {
  const machine = MACHINE[architecture];
  return {
    dataUrl: `${AWFY}/data.php?file=bk-aggregate-speedometer-misc-score-${machine}.json`,
    viewUrl: `${AWFY}#machine=${machine}&view=single&suite=speedometer-misc&subtest=score`,
  };
};

const CONFIGURATION = {
  nightly: { Firefox: 14, Chrome: 3 },
  beta: { Firefox: 62, Chrome: 3 },
};

const absoluteValues = (graph, configuration) => {
  const modes = {};
  const modeIds = Object.values(configuration);
  modeIds.forEach(modeId => modes[modeId] = []);

  graph.timelist.forEach((date, idx) => {
    // XXX: This flattens all data points for the same day to one data point
    const dayDate = new Date(date * 1000).toISOString().substring(0, 10);
    graph.lines.forEach((line) => {
      // if (line && line.data[idx] && modeIds.find(el => el === line.modeid)) {
      if (line && line.data[idx] && modeIds.includes(line.modeid)) {
        modes[line.modeid].push({
          date: dayDate,
          value: line.data[idx][0],
        });
      }
    });
  });

  return modeIds.map(modeId => modes[modeId]);
};

const fetchTransformSpeedometerData = async ({ architecture, channel }) => {
  // XXX: We should look into a nicer approach. The 1st represents Chrome & the 2nd Firefox
  const configuration = CONFIGURATION[channel];
  const { dataUrl, viewUrl } = generateUrl(architecture);
  const referenceSeries = await fetchJson(dataUrl);
  return {
    meta: {
      configuration,
      dataUrl,
      viewUrl,
    },
    legendLabels: Object.keys(configuration),
    series: absoluteValues(referenceSeries.graph, configuration),
  };
};

export default fetchTransformSpeedometerData;
