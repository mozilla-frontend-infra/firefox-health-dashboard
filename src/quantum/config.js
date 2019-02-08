import { frum, zipObject } from '../utils/queryOps';


const CONFIG = {
  windows64Regression: [
    {
      title: 'MotionMark HTML suite',
      secondLink: '/quantum/windows10-64/motionmark_htmlsuite',
      secondTitle: 'Breakdown',
      signatures: { 'windows10-64': 'b7794dcfc9a7522e7c1615e4a59b13ee86c0d7a6' },
    },
    {
      title: 'MotionMark Animometer',
      secondLink: '/quantum/windows10-64/motionmark_animometer',
      secondTitle: 'Breakdown',
      signatures: { 'windows10-64': 'b34709c79b6de3d4e1a260a60da9717f20163d66' },
    },
    {
      title: 'ARES6',
      secondLink: '/quantum/windows10-64/ARES6',
      secondTitle: 'Breakdown',
      signatures: { 'windows10-64': '22a0985bd873492d70d49c335a21fd49a73c87cf' },
    },
    {
      title: 'JetStream',
      secondLink: '/quantum/windows10-64/JetStream',
      secondTitle: 'Breakdown',
      signatures: { 'windows10-64': '799db0d801c7248924e93ca5a0b770020498da69' },
    },
  ],
  windows32Regression: [
    {
      title: 'MotionMark HTML suite',
      secondLink: '/quantum/windows7-32/motionmark_htmlsuite',
      secondTitle: 'Breakdown',
      signatures: { 'windows7-32': 'f90f8f88d6397a66fb9a586ddf19064f41ee3ce3' },
    },
    {
      title: 'MotionMark Animometer',
      secondLink: '/quantum/windows7-32/motionmark_animometer',
      secondTitle: 'Breakdown',
      signatures: { 'windows7-32': '4bbe842bb4e492b5f546291db455660287d10d84' },
    },
    {
      title: 'ARES6',
      secondLink: '/quantum/windows7-32/ARES6',
      secondTitle: 'Breakdown',
      signatures: { 'windows7-32': '9585321f110f16414e272956c8892a38d03e7797' },
    },
    {
      title: 'JetStream',
      secondLink: '/quantum/windows7-32/JetStream',
      secondTitle: 'Breakdown',
      signatures: { 'windows7-32': '95535e0278558bd59ae324920ca0469278faadb4' },
    },
  ],

};


const PLATFORMS = [
  {
    browser: 'Firefox',
    bits: '32',
    os: 'win',
    label: 'Firefox',
    frameworkId: 10,
    platform: 'windows7-32',
    option: 'pgo',
    project: 'mozilla-central',
  },
  {
    browser: 'Firefox',
    bits: '64',
    os: 'win',
    label: 'Firefox',
    frameworkId: 10,
    platform: 'windows10-64',
    option: 'pgo',
    project: 'mozilla-central',
  },
  {
    browser: 'Chrome',
    bits: '32',
    os: 'win',
    label: 'Chrome',
    frameworkId: 10,
    platform: 'windows7-32-nightly',
    option: 'opt',
    project: 'mozilla-central',
  },
  {
    browser: 'Chrome',
    bits: '64',
    os: 'win',
    label: 'Chrome',
    frameworkId: 10,
    platform: 'windows10-64-nightly',
    option: 'opt',
    project: 'mozilla-central',
  },
];

const SUITES = {
  header:
    ['browser', 'title', 'suite'],

  data: [

    ['Firefox', 'Tp6: Facebook', 'raptor-tp6-facebook-firefox'],
    ['Firefox', 'Tp6: Amazon', 'raptor-tp6-amazon-firefox'],
    ['Firefox', 'Tp6: YouTube', 'raptor-tp6-youtube-firefox'],
    ['Firefox', 'Tp6: Google', 'raptor-tp6-google-firefox'],
    ['Firefox', 'Tp6: Imdb', 'raptor-tp6-imdb-firefox'],
    ['Firefox', 'Tp6: Imgur', 'raptor-tp6-imgur-firefox'],
    ['Firefox', 'Tp6: Wikia', 'raptor-tp6-wikia-firefox'],
    ['Firefox', 'Tp6: Bing', 'raptor-tp6-bing-firefox'],
    ['Firefox', 'Tp6: Yandex', 'raptor-tp6-yandex-firefox'],
    ['Firefox', 'Tp6: Apple', 'raptor-tp6-apple-firefox'],
    ['Firefox', 'Tp6: Microsoft', 'raptor-tp6-microsoft-firefox'],
    ['Firefox', 'Tp6: Reddit', 'raptor-tp6-reddit-firefox'],

    ['Chrome', 'Tp6: Facebook', 'raptor-tp6-facebook-chrome'],
    ['Chrome', 'Tp6: Amazon', 'raptor-tp6-amazon-chrome'],
    ['Chrome', 'Tp6: Google', 'raptor-tp6-google-chrome'],
    ['Chrome', 'Tp6: YouTube', 'raptor-tp6-youtube-chrome'],
    ['Chrome', 'Tp6: Imdb', 'raptor-tp6-imdb-chrome'],
    ['Chrome', 'Tp6: Imgur', 'raptor-tp6-imgur-chrome'],
    ['Chrome', 'Tp6: Wikia', 'raptor-tp6-wikia-chrome'],
    ['Chrome', 'Tp6: Bing', 'raptor-tp6-bing-chrome'],
    ['Chrome', 'Tp6: Yandex', 'raptor-tp6-yandex-chrome'],
    ['Chrome', 'Tp6: Apple', 'raptor-tp6-apple-chrome'],
    ['Chrome', 'Tp6: Microsoft', 'raptor-tp6-microsoft-chrome'],
    ['Chrome', 'Tp6: Reddit', 'raptor-tp6-reddit-chrome'],
  ],
};

// ALL PAGE COMBINATIONS
const TP6_PAGES = frum(SUITES.data)
  .map(row => zipObject(SUITES.header, row))
  .join('browser', PLATFORMS, 'browser');

export { CONFIG, PLATFORMS, TP6_PAGES };
