const CONFIG = {
  windows64Regression: [
    [
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
    ],
    [
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
  ],
  windows32Regression: [
    [
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
    ],
    [
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
  ],

};

const PLATFORMS = {
  Firefox32: { platform: 'windows7-32', option: 'pgo', project: 'mozilla-central' },
  Firefox64: { platform: 'windows10-64', option: 'pgo', project: 'mozilla-central' },
  Chrome32: { platform: 'windows7-32-nightly', option: 'opt', project: 'mozilla-central' },
  Chrome64: { platform: 'windows10-64-nightly', option: 'opt', project: 'mozilla-central' },
};

const PAGES = {
  header:
    ['title', 'label', 'frameworkId', 'platform', 'option', 'project', 'suite', 'extraOptions'],

  data: [

    ['Tp6: Facebook', 'Firefox', 10, 'windows7-32', 'pgo', 'mozilla-central', 'raptor-tp6-facebook-firefox'],
    ['Tp6: Amazon', 'Firefox', 10, 'windows7-32', 'pgo', 'mozilla-central', 'raptor-tp6-amazon-firefox'],
    ['Tp6: YouTube', 'Firefox', 10, 'windows7-32', 'pgo', 'mozilla-central', 'raptor-tp6-youtube-firefox'],
    ['Tp6: Google', 'Firefox', 10, 'windows7-32', 'pgo', 'mozilla-central', 'raptor-tp6-google-firefox'],
    ['Tp6: imdb', 'Firefox', 10, 'windows7-32', 'pgo', 'mozilla-central', 'raptor-tp6-imdb-firefox'],
    ['Tp6: imgur', 'Firefox', 10, 'windows7-32', 'pgo', 'mozilla-central', 'raptor-tp6-imgur-firefox'],
    ['Tp6: wikia', 'Firefox', 10, 'windows7-32', 'pgo', 'mozilla-central', 'raptor-tp6-wikia-firefox'],
    ['Tp6: bing', 'Firefox', 10, 'windows7-32', 'pgo', 'mozilla-central', 'raptor-tp6-bing-firefox'],
    ['Tp6: yandex', 'Firefox', 10, 'windows7-32', 'pgo', 'mozilla-central', 'raptor-tp6-yandex-firefox'],
    ['Tp6: apple', 'Firefox', 10, 'windows7-32', 'pgo', 'mozilla-central', 'raptor-tp6-apple-firefox'],
    ['Tp6: microsoft', 'Firefox', 10, 'windows7-32', 'pgo', 'mozilla-central', 'raptor-tp6-microsoft-firefox'],
    ['Tp6: reddit', 'Firefox', 10, 'windows7-32', 'pgo', 'mozilla-central', 'raptor-tp6-reddit-firefox'],

    ['Tp6: Facebook', 'Chrome', 10, 'windows7-32-nightly', 'opt', 'mozilla-central', 'raptor-tp6-facebook-chrome'],
    ['Tp6: Amazon', 'Chrome', 10, 'windows7-32-nightly', 'opt', 'mozilla-central', 'raptor-tp6-amazon-chrome'],
    ['Tp6: Google', 'Chrome', 10, 'windows7-32-nightly', 'opt', 'mozilla-central', 'raptor-tp6-google-chrome'],
    ['Tp6: YouTube', 'Chrome', 10, 'windows7-32-nightly', 'opt', 'mozilla-central', 'raptor-tp6-youtube-chrome'],
    ['Tp6: imdb', 'Chrome', 10, 'windows7-32-nightly', 'opt', 'mozilla-central', 'raptor-tp6-imdb-chrome'],
    ['Tp6: imgur', 'Chrome', 10, 'windows7-32-nightly', 'opt', 'mozilla-central', 'raptor-tp6-imgur-chrome'],
    ['Tp6: wikia', 'Chrome', 10, 'windows7-32-nightly', 'opt', 'mozilla-central', 'raptor-tp6-wikia-chrome'],
    ['Tp6: bing', 'Chrome', 10, 'windows7-32-nightly', 'opt', 'mozilla-central', 'raptor-tp6-bing-chrome'],
    ['Tp6: yandex', 'Chrome', 10, 'windows7-32-nightly', 'opt', 'mozilla-central', 'raptor-tp6-yandex-chrome'],
    ['Tp6: apple', 'Chrome', 10, 'windows7-32-nightly', 'opt', 'mozilla-central', 'raptor-tp6-apple-chrome'],
    ['Tp6: microsoft', 'Chrome', 10, 'windows7-32-nightly', 'opt', 'mozilla-central', 'raptor-tp6-microsoft-chrome'],
    ['Tp6: reddit', 'Chrome', 10, 'windows7-32-nightly', 'opt', 'mozilla-central', 'raptor-tp6-reddit-chrome'],

    ['Speedometer', 'Firefox', 10, 'windows7-32', 'pgo', 'mozilla-central', 'raptor-speedometer-firefox'],
    ['Page load (tp5)', 'Firefox', 1, 'windows7-32', 'pgo', 'mozilla-central', 'tp5o', ['e10s', 'stylo']],
    ['Window Opening (tpaint e10s)', 'Firefox', 1, 'windows7-32', 'pgo', 'mozilla-central', 'tpaint', ['e10s', 'stylo']],
    ['Start-up (sessionrestore)', 'Firefox', 1, 'windows7-32', 'pgo', 'mozilla-central', 'sessionrestore', ['e10s', 'stylo']],
    ['Start-up (sessionrestore_no_auto_restore)', 'Firefox', 1, 'windows7-32', 'pgo', 'mozilla-central', 'sessionrestore_no_auto_restore', ['e10s', 'stylo']],
    ['Start-Up (ts_paint)', 'Firefox', 1, 'windows7-32', 'pgo', 'mozilla-central', 'ts_paint', ['e10s', 'stylo']],
    ['Tab Opening (tabpaint)', 'Firefox', 1, 'windows7-32', 'pgo', 'mozilla-central', 'tabpaint', ['e10s', 'stylo']],
    ['Tab Animation (TART)', 'Firefox', 1, 'windows7-32', 'pgo', 'mozilla-central', 'tart', ['e10s', 'stylo']],
    ['Tab Switch (tps)', 'Firefox', 1, 'windows7-32', 'pgo', 'mozilla-central', 'tps', ['e10s', 'stylo']],
    ['SVG (tsvg_static)', 'Firefox', 1, 'windows7-32', 'pgo', 'mozilla-central', 'tsvg_static', ['e10s', 'stylo']],
    ['SVG (tsvgr_opacity)', 'Firefox', 1, 'windows7-32', 'pgo', 'mozilla-central', 'tsvgr_opacity', ['e10s', 'stylo']],
    ['SVG (tsvgx)', 'Firefox', 1, 'windows7-32', 'pgo', 'mozilla-central', 'tsvgx', ['e10s', 'stylo']],

  ],
};


export { CONFIG, PAGES, PLATFORMS };
