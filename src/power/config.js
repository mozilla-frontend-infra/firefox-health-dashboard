/* eslint-disable */

import { Data } from '../vendor/Data';

const TESTS = [
  {
    id: 'cpu',
    label: 'CPU',
    filter: { eq: { test: 'cpu' } },
  },
  {
    id: 'proportional',
    label: 'Proportional',
    filter: { eq: { test: 'proportional' } },
  },
  {
    id: 'screen',
    label: 'Screen',
    filter: { eq: { test: 'screen' } },
  },
  {
    id: 'wifi',
    label: 'Wifi',
    filter: { eq: { test: 'wifi' } },
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
    id: 'p2',
    label: 'Pixel 2 (arm7)',
    filter: {
      eq: {
        platform: 'android-hw-p2-8-0-arm7-api-16',
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
  header: ['browser', 'browserLabel', 'suite', 'filter'],
  data: [
    ['geckoview', 'Geckoview', 'scn-power-idle', {eq: {framework: 10, repo: 'mozilla-central', suite: ['raptor-scn-power-idle-geckoview-power']}}],
    ['refbrow', 'Reference Browser', 'scn-power-idle', {eq: {framework: 10, repo: 'mozilla-central', suite: ['raptor-scn-power-idle-refbrow-power']}}],
    ['fenix', 'Firefox Preview', 'scn-power-idle', {eq: {framework: 10, repo: 'mozilla-central', suite: ['raptor-scn-power-idle-fenix-power']}}],
    ['fennec', 'Fennec', 'scn-power-idle', {eq: {framework: 10, repo: 'mozilla-central', suite: ['raptor-scn-power-idle-fennec-power']}}],

    ['geckoview', 'Geckoview', 'speedometer', {eq: {framework: 10, repo: 'mozilla-central', suite: ['raptor-speedometer-geckoview-power']}}],
    ['refbrow', 'Reference Browser', 'speedometer', {eq: {framework: 10, repo: 'mozilla-central', suite: ['raptor-speedometer-refbrow-power']}}],
    ['fenix', 'Firefox Preview', 'speedometer', {eq: {framework: 10, repo: 'mozilla-central', suite: ['raptor-speedometer-fenix-power']}}],
    ['fennec', 'Fennec', 'speedometer', {eq: {framework: 10, repo: 'mozilla-central', suite: ['raptor-speedometer-fennec-power']}}],

  ],
};
const COMBOS = COMBO_TABLE.data.map(row => Data.zip(COMBO_TABLE.header, row));

export { TESTS, COMBOS, PLATFORMS };
