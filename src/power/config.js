/* eslint-disable */

import { Data } from '../vendor/datas';
import { MOZILLA_CENTRAL } from '../utils/PerfherderGraphContainer'

const TESTS = [
  {
    id: 'cpu',
    label: 'CPU',
    filter: { in: { test: ['cpu', 'power-cpu'] } },
  },
  // {
  //   id: 'proportional',
  //   label: 'Proportional',
  //   filter: { eq: { test: 'proportional' } },
  // },
  {
    id: 'screen',
    label: 'Screen',
    filter: { in: { test: ['screen', 'power-screen'] } },
  },
  {
    id: 'wifi',
    label: 'Wifi',
    filter: { in: { test: ['wifi', 'power-wifi'] } },
  },
];
const PLATFORMS = [
  {
    id: 'g5',
    label: 'Moto G5 (arm7)',
    filter: {
      eq: {
        platform: 'android-hw-g5-7-0-arm7-api-16',
      },
    },
  },
  {
    id: 'p2-aarch64',
    label: 'Pixel 2 (aarch64)',
    filter: {
      eq: {
        // options: 'opt',
        platform: 'android-hw-p2-8-0-android-aarch64',
      },
    },
  },
];

const COMBO_TABLE = {
  header: ['repo', 'browser', 'browserLabel', 'suite', 'suiteLabel', 'filter'],
  data: [
    [MOZILLA_CENTRAL, 'geckoview', 'Geckoview', 'scn-power-idle', 'about:blank page', {eq: {framework: 10, repo: 'mozilla-central', suite: ['raptor-scn-power-idle-geckoview-power']}}],
    // [MOZILLA_CENTRAL, 'refbrow', 'Reference Browser', 'scn-power-idle', 'about:blank page', {eq: {framework: 10, repo: 'mozilla-central', suite: ['raptor-scn-power-idle-refbrow-power']}}],
    [MOZILLA_CENTRAL, 'fenix', 'Firefox Preview', 'scn-power-idle', 'about:blank page', {eq: {framework: 10, repo: 'mozilla-central', suite: ['raptor-scn-power-idle-fenix-power']}}],
    [MOZILLA_CENTRAL, 'fennec68', 'Firefox ESR', 'scn-power-idle', 'about:blank page', {eq: {framework: 10, repo: 'mozilla-central', suite: ['raptor-scn-power-idle-fennec68-power']}}],

    [MOZILLA_CENTRAL, 'geckoview', 'Geckoview', 'scn-power-idle-bg', 'idle background', {eq: {framework: 10, repo: 'mozilla-central', suite: ['raptor-scn-power-idle-bg-geckoview-power']}}],
    // [MOZILLA_CENTRAL, 'refbrow', 'Reference Browser', 'scn-power-idle-bg', 'idle background', {eq: {framework: 10, repo: 'mozilla-central', suite: ['raptor-scn-power-idle-bg-refbrow-power']}}],
    [MOZILLA_CENTRAL, 'fenix', 'Firefox Preview', 'scn-power-idle-bg', 'idle background', {eq: {framework: 10, repo: 'mozilla-central', suite: ['raptor-scn-power-idle-bg-fenix-power']}}],
    [MOZILLA_CENTRAL, 'fennec68', 'Firefox ESR', 'scn-power-idle-bg', 'idle background', {eq: {framework: 10, repo: 'mozilla-central', suite: ['raptor-scn-power-idle-bg-fennec68-power']}}],

    [MOZILLA_CENTRAL, 'geckoview', 'Geckoview', 'speedometer', 'Speedometer', {eq: {framework: 10, repo: 'mozilla-central', suite: ['raptor-speedometer-geckoview-power']}}],
    [MOZILLA_CENTRAL, 'refbrow', 'Reference Browser', 'speedometer', 'Speedometer', {eq: {framework: 10, repo: 'mozilla-central', suite: ['raptor-speedometer-refbrow-power']}}],
    [MOZILLA_CENTRAL, 'fenix', 'Firefox Preview', 'speedometer', 'Speedometer', {eq: {framework: 10, repo: 'mozilla-central', suite: ['raptor-speedometer-fenix-power']}}],
    [MOZILLA_CENTRAL, 'fennec68', 'Firefox ESR', 'speedometer', 'Speedometer', {eq: {framework: 10, repo: 'mozilla-central', suite: ['raptor-speedometer-fennec68-power']}}],

  ],
};
const COMBOS = COMBO_TABLE.data.map(row => Data.zip(COMBO_TABLE.header, row));

export { TESTS, COMBOS, PLATFORMS };
