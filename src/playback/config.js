/* eslint-disable */

import { selectFrom } from "../vendor/vectors";

const SIZES = [
  // {size: "2160p60"},
  {size: "2160p30"},
  {size: "1440p60"},
  {size: "1440p30"},
  {size: "1080p60"},
  {size: "1080p30"},
  {size: "720p60"},
  {size: "720p30"},
  {size: "480p30"},
  {size: "360p30"},
  {size: "240p30"},
  {size: "144p30"},
  {size: "144p15"},
];

const ENCODINGS = [
  {encoding: "VP9"},
  {encoding: "H264"},
];

const SUITES = [
  {"suite": "Playback", "suitePrefix": "PlaybackPerf."},
  {"suite": "Plain", "suitePrefix": ""},
];

const SPEEDS = [
  {speedLabel: "2", speed: 2},
  {speedLabel: "1.5", speed: 1.5},
  {speedLabel: "1.25", speed: 1.25},
  {speedLabel: "1", speed: 1},
  {speedLabel: "0.5", speed: 0.5},
  {speedLabel: "0.25", speed: 0.25},
];

const TESTS = selectFrom(SUITES)
  .leftJoin('dummy', ENCODINGS, 'dummy')
  .leftJoin('dummy', SIZES, 'dummy')
  .leftJoin('dummy', SPEEDS, 'dummy')
  .map(({suite, suitePrefix, encoding, size, speed, speedLabel}) => {
    // H264.1080p30@1.25X_%_dropped_frames
    const fullName = suitePrefix + encoding + '.' + size + '@' + speedLabel + 'X_dropped_frames';

    return {
      suite,
      encoding,
      size,
      speed,
      filter: {"eq": {"test": fullName}}
    }
  })
  .toArray();


const PLATFORMS = [
  {
    id: 'win64',
    label: 'Windows 64bit',
    filter: {eq: {platform: 'windows10-64-shippable', options: 'opt'}},
  },
  {
    id: 'win-aarch64',
    label: 'Windows (aarch64)',
    filter: {eq: {platform: 'windows10-64-shippable', options: 'opt'}},
  },
  {
    id: 'win32',
    label: 'Windows 32bit',
    filter: {eq: {platform: 'windows7-32-shippable', options: 'opt'}},
  },
  {
    id: 'linux64',
    label: 'Linux 64bit',
    filter: {eq: {platform: 'linux64-shippable', options: 'opt'}},
  },
  {
    id: 'mac',
    label: 'MacOSX',
    filter:
      {eq: {platform: ['macosx1010-64-shippable', 'macosx1014-64-shippable', 'macosx64-shippable']}},
  },
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
        platform: 'android-hw-p2-8-0-android-aarch64',
      },
    },
  },
];


const BROWSERS =[
  {id: "firefox", label:"Firefox", filter: {eq: {framework: 10, repo: 'mozilla-central', suite: ["raptor-youtube-playback-firefox-live"]}}},
  {id: "geckoview", label:"geckoview", filter: {eq: {framework: 10, repo: 'mozilla-central', suite: ["raptor-youtube-playback-geckoview-live"]}}},
];


export { SUITES, SIZES, ENCODINGS, SPEEDS, TESTS, BROWSERS, PLATFORMS };
