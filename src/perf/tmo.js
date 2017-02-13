import Tmo from 'telemetry-next-node';
// import { getHistory } from './release/history';

Tmo.init(() => {
  const version = Tmo.getVersions()[0];
  console.log(version);
  const parts = version.split('/');
  Tmo.getFilterOptions(parts[0], parts[1], (filters) => {
    // console.log('Measures available:');
    // filters.metric.forEach((measure) => {
    //   console.log(measure);
    // });
  });
});

export default {

};
