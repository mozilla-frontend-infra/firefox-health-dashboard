/* eslint-disable */

import { selectFrom } from "../vendor/vectors";

const SIZES = [
  {size: "2160p60"},
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
  // {size: "144p15"},
];

const ENCODINGS = [
  {encoding: "VP9"},
  {encoding: "H264"},
];

const SPEEDS = [
  {speedLabel: "2", speed: 2},
  {speedLabel: "1.5", speed: 1.5},
  {speedLabel: "1.25", speed: 1.25},
  {speedLabel: "1", speed: 1, isSlow: true},
  {speedLabel: "0.5", speed: 0.5, isSlow: true},
  {speedLabel: "0.25", speed: 0.25, isSlow: true},
];

const TESTS = selectFrom(ENCODINGS)
  .leftJoin('dummy', SIZES, 'dummy')
  .leftJoin('dummy', SPEEDS, 'dummy')
  .map(({encoding, size, speed, speedLabel}) => {
    // H264.1080p30@1.25X_%_dropped_frames
    const fullName1 =  encoding + '.' + size + '@' + speedLabel + 'X_dropped_frames';
    return {
      encoding,
      size,
      speed,
      filter: {"eq": {"test": fullName1}}
    }
  })
  .toArray();


const PLATFORMS = [
  {
    id: 'win64',
    type: 'desktop',
    label: 'Windows 64bit',
    bits: 64,
    filter: {eq: {platform: 'windows10-64-shippable', options: 'opt'}},
  },
  {
    id: 'win-aarch64',
    type: 'desktop',
    label: 'Windows (aarch64)',
    bits: 64,
    filter: {eq: {platform: 'windows10-64-shippable', options: 'opt'}},
  },
  {
    id: 'win32',
    type: 'desktop',
    label: 'Windows 32bit',
    bits: 32,
    filter: {eq: {platform: 'windows7-32-shippable', options: 'opt'}},
  },
  {
    id: 'linux64',
    type: 'desktop',
    label: 'Linux 64bit',
    bits: 64,
    filter: {eq: {platform: 'linux64-shippable', options: 'opt'}},
  },
  {
    id: 'mac',
    type: 'desktop',
    label: 'MacOSX',
    bits: 64,
    filter:
      {eq: {platform: ['macosx1010-64-shippable', 'macosx1014-64-shippable', 'macosx64-shippable']}},
  },
  {
    id: 'g5',
    type: 'mobile',
    label: 'Moto G5 (arm7)',
    bits: 64,
    filter: {
      eq: {
        platform: 'android-hw-g5-7-0-arm7-api-16',
      },
    },
  },
  {
    id: 'p2-aarch64',
    type: 'mobile',
    label: 'Pixel 2 (aarch64)',
    bits: 64,
    filter: {
      eq: {
        platform: 'android-hw-p2-8-0-android-aarch64',
      },
    },
  },
];

const MOZILLA_CENTRAL = {
  name: "mozilla-central",
  revisionURL: "https://hg.mozilla.org/mozilla-central/pushloghtml",
}

const FENIX = {
  name: "fenix",
  revisionURL: "https://github.com/mozilla-mobile/fenix/commit/",
}


const BROWSERS =[
  {id: "firefox", label:"Firefox", title:"Firefox (Desktop)", format:"desktop", filter: {eq: {framework: 10, repo: MOZILLA_CENTRAL, suite: ["raptor-youtube-playback-firefox-live"]}}},
  {id: "chrome", label:"Chrome", title:"Chrome (Desktop)", format:"desktop", filter: {eq: {framework: 10, repo: MOZILLA_CENTRAL, suite: ["raptor-youtube-playback-chrome-live"]}}},
  {id: "geckoview", label:"geckoview", title:"Firefox (Android)", format:"mobile", filter: {eq: {framework: 10, repo: MOZILLA_CENTRAL, suite: ["raptor-youtube-playback-geckoview-live"]}}},
  {id: "fenix", label:"Firefox Preview", title:"Firefox Preview (Android)", format:"mobile", filter: {eq: {framework: 10, repo: FENIX, suite: ["raptor-youtube-playback-fenix-live"]}}},
];


export { SIZES, ENCODINGS, SPEEDS, TESTS, BROWSERS, PLATFORMS };
