/* eslint-disable */

import { selectFrom } from "../vendor/vectors";
import {MOZILLA_CENTRAL, FENIX} from "../utils/PerfherderGraphContainer";

const ENCODINGS = [
  {encoding: "VP9"},
  {encoding: "H264"},
  {encoding: "AV1"},
  {encoding: "WIDEVINE-H264", encodingName: "H264"},
  {encoding: "WIDEVINE-VP9", encodingName: "VP9"},
];

// The standard encodings are: VP9, H264, AV1
const STANDARD_ENCODINGS = ENCODINGS.slice(0, 3);

const WIDEVINE_ENCODINGS = ENCODINGS.slice(3, 5);

/*
For HFR sizes, they differ depending on encoding:
VP9: 2160p60, 1440p60, 1080p60, 720p60
AV1: 1440p60, 1080p60, 720p60
H264: 1080p60, 720p60
*/
const HFR_SIZES = [
  {size: "2160p60"},
  {size: "1440p60"},
  {size: "1080p60"},
  {size: "720p60"},
];
const VP9_HFR_SIZES = HFR_SIZES;
const AV1_HFR_SIZES = HFR_SIZES.slice(1,4);
const H264_HFR_SIZES = HFR_SIZES.slice(2,4);

const SFR_HIGHRES_SIZES = [
  {size: "2160p30"},
  {size: "1440p30"},
  {size: "1080p30"},
  {size: "720p30"},
];

const SFR_LOWRES_SIZES = [
  {size: "480p30"},
  {size: "360p30"},
  {size: "240p30"},
  {size: "144p30"},
];

const STANDARD_SIZES = HFR_SIZES.concat(SFR_HIGHRES_SIZES, SFR_LOWRES_SIZES);

const WIDEVINE_HFR_SIZES = [
  {size: "1080pMQ60"},
  {size: "1080p60"},
  {size: "720pMQ60"},
  {size: "720p60"},
];

const WIDEVINE_H264_SFR_SIZES = [
  {size: "1080pHQ30"},
  {size: "1080pMQ30"},
  {size: "1080p30"},
  {size: "720pHQ30"},
  {size: "720pMQ30"},
  {size: "720p30"},
  {size: "480pHQ30"},
  {size: "480pMQ30"},
  {size: "480p30"},
  {size: "360p30"},
  {size: "240p30"},
  {size: "144p30"},
];

const WIDEVINE_VP9_SFR_SIZES = [
  {size: "2160p24"},
  {size: "1440p24"},
  {size: "1080pHQ30"},
  {size: "1080pMQ30"},
  {size: "1080p30"},
  {size: "720pHQ30"},
  {size: "720pMQ30"},
  {size: "720p30"},
  {size: "480pHQ30"},
  {size: "480pMQ30"},
  {size: "480p30"},
  {size: "360p30"},
  {size: "240p30"},
];

const WIDEVINE_H264_SIZES = WIDEVINE_HFR_SIZES.concat(WIDEVINE_H264_SFR_SIZES);
const WIDEVINE_VP9_SIZES = WIDEVINE_HFR_SIZES.concat(WIDEVINE_VP9_SFR_SIZES);

const SPEEDS = [
  {speedLabel: "2", speed: 2},
  {speedLabel: "1.75", speed: 1.75},
  {speedLabel: "1.5", speed: 1.5},
  {speedLabel: "1.25", speed: 1.25},
  {speedLabel: "1", speed: 1, isSlow: true},
  {speedLabel: "0.75", speed: 0.75, isSlow: true},
  {speedLabel: "0.5", speed: 0.5, isSlow: true},
  {speedLabel: "0.25", speed: 0.25, isSlow: true},
];

const PLAYBACK_SUITES = [
  {id: "hfr-firefox", variant: "hfr", browser: "firefox", suite: "raptor-youtube-playback-h264-std-firefox-live"},
  // {id: "hfr-firefox", variant: "hfr", browser: "firefox", suite: "raptor-youtube-playback-hfr-firefox-live"},
  {id: "av1-sfr-firefox", variant: "av1-sfr", browser: "firefox", suite: "raptor-youtube-playback-av1-sfr-firefox-live"},
  {id: "h264-sfr-firefox", variant: "h264-sfr", browser: "firefox", suite: "raptor-youtube-playback-h264-sfr-firefox-live"},
  {id: "vp9-sfr-firefox", variant: "vp9-sfr", browser: "firefox", suite: "raptor-youtube-playback-vp9-sfr-firefox-live"},
  {id: "widevine-hfr-firefox", variant: "widevine-hfr", browser: "firefox", suite: "raptor-youtube-playback-widevine-hfr-firefox-live"},
  {id: "widevine-h264-sfr-firefox", variant: "widevine-h264-sfr", browser: "firefox", suite: "raptor-youtube-playback-widevine-h264-sfr-firefox-live"},
  {id: "widevine-vp9-sfr-firefox", variant: "widevine-vp9-sfr", browser: "firefox", suite: "raptor-youtube-playback-widevine-vp9-sfr-firefox-live"},

  {id: "hfr-chrome", variant: "hfr", browser: "chrome", suite: "raptor-youtube-playback-h264-std-chrome-live"},
  // {id: "hfr-chrome", variant: "hfr", browser: "chrome", suite: "raptor-youtube-playback-hfr-chrome-live"},
  {id: "av1-sfr-chrome", variant: "av1-sfr", browser: "chrome", suite: "raptor-youtube-playback-av1-sfr-chrome-live"},
  {id: "h264-sfr-chrome", variant: "h264-sfr", browser: "chrome", suite: "raptor-youtube-playback-h264-sfr-chrome-live"},
  {id: "vp9-sfr-chrome", variant: "vp9-sfr", browser: "chrome", suite: "raptor-youtube-playback-vp9-sfr-chrome-live"},
  {id: "widevine-hfr-chrome", variant: "widevine-hfr", browser: "chrome", suite: "raptor-youtube-playback-widevine-hfr-chrome-live"},
  {id: "widevine-h264-sfr-chrome", variant: "widevine-h264-sfr", browser: "chrome", suite: "raptor-youtube-playback-widevine-h264-sfr-chrome-live"},
  {id: "widevine-vp9-sfr-chrome", variant: "widevine-vp9-sfr", browser: "chrome", suite: "raptor-youtube-playback-widevine-vp9-sfr-chrome-live"},

  {id: "hfr-geckoview", variant: "hfr", browser: "geckoview", suite: "raptor-youtube-playback-h264-std-geckoview-live"},
  // {id: "hfr-geckoview", variant: "hfr", browser: "geckoview", suite: "raptor-youtube-playback-hfr-geckoview-live"},
  {id: "av1-sfr-geckoview", variant: "av1-sfr", browser: "geckoview", suite: "raptor-youtube-playback-av1-sfr-geckoview-live"},
  {id: "h264-sfr-geckoview", variant: "h264-sfr", browser: "geckoview", suite: "raptor-youtube-playback-h264-sfr-geckoview-live"},
  {id: "vp9-sfr-geckoview", variant: "vp9-sfr", browser: "geckoview", suite: "raptor-youtube-playback-vp9-sfr-geckoview-live"},
  {id: "widevine-hfr-geckoview", variant: "widevine-hfr", browser: "geckoview", suite: "raptor-youtube-playback-widevine-hfr-geckoview-live"},
  {id: "widevine-h264-sfr-geckoview", variant: "widevine-h264-sfr", browser: "geckoview", suite: "raptor-youtube-playback-widevine-h264-sfr-geckoview-live"},
  {id: "widevine-vp9-sfr-geckoview", variant: "widevine-vp9-sfr", browser: "geckoview", suite: "raptor-youtube-playback-widevine-vp9-sfr-geckoview-live"},

  {id: "hfr-fenix", variant: "hfr", browser: "fenix", suite: "raptor-youtube-playback-h264-std-fenix-live"},
  // {id: "hfr-fenix", variant: "hfr", browser: "fenix", suite: "raptor-youtube-playback-hfr-fenix-live"},
  {id: "av1-sfr-fenix", variant: "av1-sfr", browser: "fenix", suite: "raptor-youtube-playback-av1-sfr-fenix-live"},
  {id: "h264-sfr-fenix", variant: "h264-sfr", browser: "fenix", suite: "raptor-youtube-playback-h264-sfr-fenix-live"},
  {id: "vp9-sfr-fenix", variant: "vp9-sfr", browser: "fenix", suite: "raptor-youtube-playback-vp9-sfr-fenix-live"},
  {id: "widevine-hfr-fenix", variant: "widevine-hfr", browser: "fenix", suite: "raptor-youtube-playback-widevine-hfr-fenix-live"},
  {id: "widevine-h264-sfr-fenix", variant: "widevine-h264-sfr", browser: "fenix", suite: "raptor-youtube-playback-widevine-h264-sfr-fenix-live"},
  {id: "widevine-vp9-sfr-fenix", variant: "widevine-vp9-sfr", browser: "fenix", suite: "raptor-youtube-playback-widevine-vp9-sfr-fenix-live"},

  {id: "hfr-fennec68", variant: "hfr", browser: "fennec68", suite: "raptor-youtube-playback-h264-std-fennec68-live"},
  // {id: "hfr-fennec68", variant: "hfr", browser: "fennec68", suite: "raptor-youtube-playback-hfr-fennec68-live"},
  {id: "av1-sfr-fennec68", variant: "av1-sfr", browser: "fennec68", suite: "raptor-youtube-playback-av1-sfr-fennec68-live"},
  {id: "h264-sfr-fennec68", variant: "h264-sfr", browser: "fennec68", suite: "raptor-youtube-playback-h264-sfr-fennec68-live"},
  {id: "vp9-sfr-fennec68", variant: "vp9-sfr", browser: "fennec68", suite: "raptor-youtube-playback-vp9-sfr-fennec68-live"},
  {id: "widevine-hfr-fennec68", variant: "widevine-hfr", browser: "fennec68", suite: "raptor-youtube-playback-widevine-hfr-fennec68-live"},
  {id: "widevine-h264-sfr-fennec68", variant: "widevine-h264-sfr", browser: "fennec68", suite: "raptor-youtube-playback-widevine-h264-sfr-fennec68-live"},
  {id: "widevine-vp9-sfr-fennec68", variant: "widevine-vp9-sfr", browser: "fennec68", suite: "raptor-youtube-playback-widevine-vp9-sfr-fennec68-live"},
];

const HFR_H264_TESTS = selectFrom(H264_HFR_SIZES)
  .leftJoin('dummy', SPEEDS, 'dummy')
  .map(({size, speed, speedLabel}) => {
    // H2641080p30fps@1.25X_dropped_frames
    const encoding = "H264";
    const fullName =  encoding + size + 'fps@' + speedLabel + 'X_dropped_frames';
    return {
      encoding,
      size,
      speed,
      variant: "hfr",
      filter: {"eq": {test: fullName}}
    }
  })
  .toArray();

const HFR_AV1_TESTS = selectFrom(AV1_HFR_SIZES)
  .leftJoin('dummy', SPEEDS, 'dummy')
  .map(({size, speed, speedLabel}) => {
    // AV11080p30fps@1.25X_dropped_frames
    const encoding = "AV1";
    const fullName =  encoding + size + 'fps@' + speedLabel + 'X_dropped_frames';
    return {
      encoding,
      size,
      speed,
      variant: "hfr",
      filter: {"eq": {test: fullName}}
    }
  })
  .toArray();

const HFR_VP9_TESTS = selectFrom(VP9_HFR_SIZES)
  .leftJoin('dummy', SPEEDS, 'dummy')
  .map(({size, speed, speedLabel}) => {
    // VP91080p30fps@1.25X_dropped_frames
    const encoding = "VP9";
    const fullName =  encoding + size + 'fps@' + speedLabel + 'X_dropped_frames';
    return {
      encoding,
      size,
      speed,
      variant: "hfr",
      filter: {"eq": {test: fullName}}
    }
  })
  .toArray();

const HFR_TESTS = HFR_H264_TESTS.concat(HFR_AV1_TESTS, HFR_VP9_TESTS);

const SFR_LOWRES_TESTS = selectFrom(STANDARD_ENCODINGS)
  .leftJoin('dummy', SFR_LOWRES_SIZES, 'dummy')
  .map(({encoding, size}) => {
    // H264480p30fps@1X_dropped_frames
    const speed = 1;
    const speedLabel = "1";
    const fullName =  encoding + size + 'fps@' + speedLabel + 'X_dropped_frames';
    return {
      encoding,
      size,
      speed,
      variant: `${encoding.toLowerCase()}-sfr`,
      filter: {"eq": {"test": fullName}}
    }
  })
  .toArray();

const SFR_HIGHRES_TESTS = selectFrom(STANDARD_ENCODINGS)
  .leftJoin('dummy', SFR_HIGHRES_SIZES, 'dummy')
  .leftJoin('dummy', SPEEDS, 'dummy')
  .map(({encoding, size, speed, speedLabel}) => {
    // H2641080p60fps@1X_dropped_frames
    const fullName =  encoding + size + 'fps@' + speedLabel + 'X_dropped_frames';
    return {
      encoding,
      size,
      speed,
      variant: `${encoding.toLowerCase()}-sfr`,
      filter: {"eq": {"test": fullName}}
    }
  })
  .toArray();

const SFR_TESTS = SFR_LOWRES_TESTS.concat(SFR_HIGHRES_TESTS);

const WIDEVINE_HFR_TESTS = selectFrom(WIDEVINE_ENCODINGS)
  .leftJoin('dummy', WIDEVINE_HFR_SIZES, 'dummy')
  .leftJoin('dummy', SPEEDS, 'dummy')
  .map(({encoding, encodingName, size, speed, speedLabel}) => {
    // H2641080p60fps@1X_dropped_frames
    const fullName =  encodingName + size + 'fps@' + speedLabel + 'X_dropped_frames';
    return {
      encoding,
      size,
      speed,
      variant: `widevine-hfr`,
      filter: {"eq": {"test": fullName}}
    }
  })
  .toArray();

const WIDEVINE_H264_SFR_TESTS = selectFrom(WIDEVINE_H264_SFR_SIZES)
  .leftJoin('dummy', SPEEDS, 'dummy')
  .map(({size, speed, speedLabel}) => {
    // VP91080p30fps@1.25X_dropped_frames
    const encoding = "WIDEVINE-H264";
    const fullName =  'H264' + size + 'fps@' + speedLabel + 'X_dropped_frames';
    return {
      encoding,
      size,
      speed,
      variant: "widevine-h264-sfr",
      filter: {"eq": {test: fullName}}
    }
  })
  .toArray();

const WIDEVINE_VP9_SFR_TESTS = selectFrom(WIDEVINE_VP9_SFR_SIZES)
  .leftJoin('dummy', SPEEDS, 'dummy')
  .map(({size, speed, speedLabel}) => {
    // VP91080p30fps@1.25X_dropped_frames
    const encoding = "WIDEVINE-VP9";
    const fullName =  "VP9" + size + 'fps@' + speedLabel + 'X_dropped_frames';
    return {
      encoding,
      size,
      speed,
      variant: "widevine-vp9-sfr",
      filter: {"eq": {test: fullName}}
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
        platform: ['android-hw-g5-7-0-arm7-api-16-shippable'],
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
        platform: ['android-hw-p2-8-0-android-aarch64-shippable'],
      },
    },
  },
];

const BROWSERS =[
  {id: "firefox", label:"Firefox", title:"Firefox (Desktop)", format:"desktop", repo: MOZILLA_CENTRAL, filter: {eq: {framework: 10, repo: MOZILLA_CENTRAL.name}}},
  {id: "chrome", label:"Chrome", title:"Chrome (Desktop)", format:"desktop", repo: MOZILLA_CENTRAL, filter: {eq: {framework: 10, repo: MOZILLA_CENTRAL.name}}},
  {id: "geckoview", label:"geckoview", title:"Firefox (Android)", format:"mobile", repo: MOZILLA_CENTRAL, filter: {eq: {framework: 10, repo: MOZILLA_CENTRAL.name}}},
  {id: "fenix", label:"Firefox Preview", title:"Firefox Preview (Android)", format:"mobile", repo: FENIX, filter: {eq: {framework: 10, repo: FENIX.name}}},
  {id: "fennec68", label:"Firefox ESR", title:"Firefox ESR (Android)", format:"mobile", repo: MOZILLA_CENTRAL, filter: {eq: {framework: 10, repo: MOZILLA_CENTRAL.name}}},
];

const STANDARD_TESTS = HFR_TESTS.concat(SFR_TESTS);
const WIDEVINE_TESTS = WIDEVINE_HFR_TESTS.concat(WIDEVINE_H264_SFR_TESTS, WIDEVINE_VP9_SFR_TESTS);

export { STANDARD_SIZES, ENCODINGS, STANDARD_ENCODINGS, SPEEDS, STANDARD_TESTS, WIDEVINE_TESTS, BROWSERS, PLATFORMS, PLAYBACK_SUITES, WIDEVINE_H264_SIZES, WIDEVINE_VP9_SIZES };
