import { selectFrom } from '../vendor/vectors';
import { Data } from '../vendor/datas';
import { first } from '../vendor/utils';


const BENCHMARK_SUITES = {
  header: ['browser', 'suite', 'suiteFilter'],

  data: [
    ['Firefox', 'MotionMark HTML', {
      eq: {
        suite: 'raptor-motionmark-htmlsuite-firefox',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chromium', 'MotionMark HTML', {
      eq: {
        suite: 'raptor-motionmark-htmlsuite-chromium',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chrome', 'MotionMark HTML', {
      eq: {
        suite: 'raptor-motionmark-htmlsuite-chrome',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'MotionMark Animometer', {
      eq: {
        suite: 'raptor-motionmark-animometer-firefox',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chromium', 'MotionMark Animometer', {
      eq: {
        suite: 'raptor-motionmark-animometer-chromium',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chrome', 'MotionMark Animometer', {
      eq: {
        suite: 'raptor-motionmark-animometer-chrome',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'Speedometer', {
      eq: {
        suite: 'raptor-speedometer-firefox',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chromium', 'Speedometer', {
      eq: {
        suite: 'raptor-speedometer-chromium',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chrome', 'Speedometer', {
      eq: {
        suite: 'raptor-speedometer-chrome',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
  ],
};


const BROWSER_PLATFORMS = selectFrom([
  {
    id: 'firefox-win32',
    browser: 'Firefox',
    bits: 32,
    os: 'win',
    label: 'Firefox (win32)',
    platform: 'win32',
    platformFilter: {
      or: [
        {
          eq: {
            platform: 'windows7-32',
            options: 'pgo',
          },
        },
        {
          eq: {
            platform: 'windows7-32-shippable',
            options: 'opt',
          },
        },
      ],
    },
  },
  {
    id: 'firefox-win64',
    browser: 'Firefox',
    bits: 64,
    os: 'win',
    label: 'Firefox (win64)',
    platform: 'win64',
    platformFilter: {
      or: [
        { eq: { platform: 'windows10-64', options: 'pgo' } },
        { eq: { platform: 'windows10-64-shippable', options: 'opt' } },
      ],
    },
  },
  {
    id: 'firefox-win-aarch64',
    browser: 'Firefox',
    bits: 64,
    os: 'win',
    label: 'Firefox (aarch64)',
    platform: 'aarch64',
    platformFilter: {
      and: [
        {
          eq: {
            platform: 'windows10-aarch64',
            options: 'opt',
          },
        },
      ],
    },
  },
  {
    id: 'firefox-linux64',
    browser: 'Firefox',
    bits: 64,
    os: 'linux',
    label: 'Firefox (linux64)',
    platform: 'linux64',
    platformFilter:
            { eq: { platform: 'linux64-shippable', options: 'opt' } },
  },
  {
    id: 'chromium-win32',
    browser: 'Chromium',
    bits: 32,
    os: 'win',
    label: 'Chromium (win32)',
    platform: 'win32',
    platformFilter:
        { eq: { platform: ['windows7-32-nightly', 'windows7-32-shippable'] } },
  },
  {
    id: 'chromium-win64',
    browser: 'Chromium',
    bits: 64,
    os: 'win',
    label: 'Chromium (win64)',
    platform: 'win64',
    platformFilter:
        { eq: { platform: ['windows10-64-nightly', 'windows10-64-shippable'] } },
  },
  {
    id: 'chromium-linux64',
    browser: 'Chromium',
    bits: 64,
    os: 'linux',
    label: 'Chromium (linux64)',
    platform: 'linux64',
    platformFilter:
        { eq: { platform: 'linux64-shippable', options: 'opt' } },
  },
  {
    id: 'chrome-win32',
    browser: 'Chrome',
    bits: 32,
    os: 'win',
    label: 'Chromium (win32)',
    platform: 'win32',
    platformFilter:
        { eq: { platform: ['windows7-32-nightly', 'windows7-32-shippable'] } },
  },
  {
    id: 'chrome-win64',
    browser: 'Chrome',
    bits: 64,
    os: 'win',
    label: 'Chrome (win64)',
    platform: 'win64',
    platformFilter:
        { eq: { platform: ['windows10-64-nightly', 'windows10-64-shippable'] } },
  },
  {
    id: 'chrome-linux64',
    browser: 'Chrome',
    bits: 64,
    os: 'linux',
    label: 'Chrome (linux64)',
    platform: 'linux64',
    platformFilter:
        { eq: { platform: 'linux64-shippable', options: 'opt' } },
  },
  {
    id: 'firefox-mac',
    browser: 'Firefox',
    bits: 64,
    os: 'macosx',
    label: 'Firefox (MacOSX)',
    platform: 'macosx',
    platformFilter: {
      eq: {
        platform: ['macosx1010-64-shippable', 'macosx1014-64-shippable', 'macosx64-shippable'],
        framework: 10,
        repo: 'mozilla-central',
      },
    },
  },
  {
    id: 'chromium-mac',
    browser: 'Chromium',
    bits: 64,
    os: 'macosx',
    label: 'Chromium (MacOSX)',
    platform: 'macosx',
    platformFilter: {
      eq: {
        platform: ['macosx1010-64-shippable', 'macosx1014-64-shippable', 'macosx64-shippable'],
        framework: 10,
        repo: 'mozilla-central',
      },
    },
  },
  {
    id: 'chrome-mac',
    browser: 'Chrome',
    bits: 64,
    os: 'macosx',
    label: 'Chrome (MacOSX)',
    platform: 'macosx',
    platformFilter: {
      eq: {
        platform: ['macosx1010-64-shippable', 'macosx1014-64-shippable', 'macosx64-shippable'],
      },
    },
  },
  {
    id: 'geckoview-g5',
    browser: 'geckoview',
    label: 'Geckoview g5',
    platform: 'g5',
    platformFilter:
        { prefix: { platform: 'android-hw-g5-7-0-arm7-api-16' } },
  },
  {
    id: 'geckoview-p2-aarch64',
    browser: 'geckoview',
    label: 'Geckoview p2 aarch64',
    platform: 'p2-aarch64',
    platformFilter: {
      eq: {
        platform: ['android-hw-p2-8-0-android-aarch64-shippable', 'android-hw-p2-8-0-android-aarch64'],
      },
    },
  },
  {
    id: 'fenix-g5',
    browser: 'fenix',
    label: 'Firefox Preview g5',
    platform: 'g5',
    platformFilter:
        { prefix: { platform: 'android-hw-g5-7-0-arm7-api-16' } },
  },
  {
    id: 'fenix-p2-aarch64',
    browser: 'fenix',
    label: 'Firefox Preview p2 (aarch64)',
    platform: 'p2-aarch64',
    platformFilter: {
      eq: {
        platform: [
          'android-hw-p2-8-0-aarch64-shippable',
          'android-hw-p2-8-0-android-aarch64-shippable',
          'android-hw-p2-8-0-aarch64',
          'android-hw-p2-8-0-android-aarch64',
        ],
      },
    },
  },
  {
    id: 'fennec68-g5',
    browser: 'fennec68',
    label: 'Fennec 68 g5',
    platform: 'g5',
    platformFilter:
        { prefix: { platform: 'android-hw-g5-7-0-arm7-api-16' } },
  },
  {
    id: 'fennec68-p2-aarch64',
    browser: 'fennec68',
    label: 'Fennec 68 p2 (aarch64)',
    platform: 'p2-aarch64',
    platformFilter: {
      eq: {
        platform: [
          'android-hw-p2-8-0-aarch64-shippable',
          'android-hw-p2-8-0-android-aarch64-shippable',
          'android-hw-p2-8-0-aarch64',
          'android-hw-p2-8-0-android-aarch64',
        ],
      },
    },
  },
]);
// eslint-disable-next-line no-param-reassign
BROWSER_PLATFORMS.forEach((p, i) => { p.ordering = i; });

const TP6_TESTS_DATA = [
  {
    test: 'cold-fnbpaint',
    testFilter: { eq: { test: 'fnbpaint' } },
    mode: 'cold',
    label: 'Cold first non-blank paint',
  },
  {
    test: 'cold-loadtime',
    testFilter: { eq: { test: 'loadtime' } },
    mode: 'cold',
    label: 'Cold load time',
    default: true,
  },
  {
    test: 'cold-fcp',
    testFilter: { eq: { test: 'fcp' } },
    mode: 'cold',
    label: 'Cold first contentful paint',
  },
  {
    test: 'cold-dcf',
    testFilter: { eq: { test: 'dcf' } },
    mode: 'cold',
    label: 'Cold DOM content flushed',
  },
  {
    test: 'cold-ttfi',
    testFilter: { eq: { test: 'ttfi' } },
    mode: 'cold',
    label: 'Cold time to first interactive',
  },
  {
    test: 'warm-fnbpaint',
    testFilter: { eq: { test: 'fnbpaint' } },
    mode: 'warm',
    label: 'Warm first non-blank paint',
  },
  {
    test: 'warm-loadtime',
    testFilter: { eq: { test: 'loadtime' } },
    mode: 'warm',
    label: 'Warm load time',
  },
  {
    test: 'warm-fcp',
    testFilter: { eq: { test: 'fcp' } },
    mode: 'warm',
    label: 'Warm first contentful paint',
  },
  {
    test: 'warm-dcf',
    testFilter: { eq: { test: 'dcf' } },
    mode: 'warm',
    label: 'Warm DOM content flushed',
  },
  {
    test: 'warm-ttfi',
    testFilter: { eq: { test: 'ttfi' } },
    mode: 'warm',
    label: 'Warm time to first interactive',
  },
];


const TP6_SITES_DATA = {
  header: ['browser', 'mode', 'site', 'siteFilter'],

  data: [
    ['Firefox', 'warm', 'Tp6: Facebook', {
      eq: {
        suite: 'raptor-tp6-facebook-firefox',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'warm', 'Tp6: Amazon', {
      eq: {
        suite: 'raptor-tp6-amazon-firefox',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'warm', 'Tp6: YouTube', {
      eq: {
        suite: 'raptor-tp6-youtube-firefox',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'warm', 'Tp6: Google', {
      eq: {
        suite: 'raptor-tp6-google-firefox',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'warm', 'Tp6: Imdb', {
      eq: {
        suite: 'raptor-tp6-imdb-firefox',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'warm', 'Tp6: Imgur', {
      eq: {
        suite: 'raptor-tp6-imgur-firefox',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'warm', 'Tp6: Netflix', {
      eq: {
        suite: 'raptor-tp6-netflix-firefox',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'warm', 'Tp6: Fandom', {
      eq: {
        suite: 'raptor-tp6-fandom-firefox',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'warm', 'Tp6: Bing', {
      eq: {
        suite: 'raptor-tp6-bing-firefox',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'warm', 'Tp6: Yandex', {
      eq: {
        suite: 'raptor-tp6-yandex-firefox',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'warm', 'Tp6: Apple', {
      eq: {
        suite: 'raptor-tp6-apple-firefox',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'warm', 'Tp6: Microsoft', {
      eq: {
        suite: 'raptor-tp6-microsoft-firefox',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'warm', 'Tp6: Office', {
      eq: {
        suite: 'raptor-tp6-office-firefox',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'warm', 'Tp6: Reddit', {
      eq: {
        suite: 'raptor-tp6-reddit-firefox',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'warm', 'Tp6: eBay', {
      eq: {
        suite: 'raptor-tp6-ebay-firefox',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'warm', 'Tp6: Instagram', {
      eq: {
        suite: 'raptor-tp6-instagram-firefox',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'warm', 'Tp6: PayPal', {
      eq: {
        suite: 'raptor-tp6-paypal-firefox',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'warm', 'Tp6: Pinterest', {
      eq: {
        suite: 'raptor-tp6-pinterest-firefox',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'warm', 'Tp6: Docs', {
      eq: {
        suite: 'raptor-tp6-docs-firefox',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'warm', 'Tp6: Google Mail', {
      eq: {
        suite: 'raptor-tp6-google-mail-firefox',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'warm', 'Tp6: LinkedIn', {
      eq: {
        suite: 'raptor-tp6-linkedin-firefox',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'warm', 'Tp6: Outlook', {
      eq: {
        suite: 'raptor-tp6-outlook-firefox',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'warm', 'Tp6: Sheets', {
      eq: {
        suite: 'raptor-tp6-sheets-firefox',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'warm', 'Tp6: Slides', {
      eq: {
        suite: 'raptor-tp6-slides-firefox',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'warm', 'Tp6: Tumblr', {
      eq: {
        suite: 'raptor-tp6-tumblr-firefox',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'warm', 'Tp6: Twitter', {
      eq: {
        suite: 'raptor-tp6-twitter-firefox',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'warm', 'Tp6: Twitch', {
      eq: {
        suite: 'raptor-tp6-twitch-firefox',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'warm', 'Tp6: Wikipedia', {
      eq: {
        suite: 'raptor-tp6-wikipedia-firefox',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'warm', 'Tp6: Yahoo Mail', {
      eq: {
        suite: 'raptor-tp6-yahoo-mail-firefox',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'warm', 'Tp6: Yahoo News', {
      eq: {
        suite: 'raptor-tp6-yahoo-news-firefox',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'cold', 'Tp6: Facebook', {
      eq: {
        suite: 'raptor-tp6-facebook-firefox-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'cold', 'Tp6: Amazon', {
      eq: {
        suite: 'raptor-tp6-amazon-firefox-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'cold', 'Tp6: YouTube', {
      eq: {
        suite: 'raptor-tp6-youtube-firefox-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'cold', 'Tp6: Google', {
      eq: {
        suite: 'raptor-tp6-google-firefox-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'cold', 'Tp6: Imdb', {
      eq: {
        suite: 'raptor-tp6-imdb-firefox-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'cold', 'Tp6: Imgur', {
      eq: {
        suite: 'raptor-tp6-imgur-firefox-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'cold', 'Tp6: Netflix', {
      eq: {
        suite: 'raptor-tp6-netflix-firefox-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'cold', 'Tp6: Fandom', {
      eq: {
        suite: 'raptor-tp6-fandom-firefox-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'cold', 'Tp6: Bing', {
      eq: {
        suite: 'raptor-tp6-bing-firefox-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'cold', 'Tp6: Yandex', {
      eq: {
        suite: 'raptor-tp6-yandex-firefox-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'cold', 'Tp6: Apple', {
      eq: {
        suite: 'raptor-tp6-apple-firefox-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'cold', 'Tp6: Microsoft', {
      eq: {
        suite: 'raptor-tp6-microsoft-firefox-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'cold', 'Tp6: Office', {
      eq: {
        suite: 'raptor-tp6-office-firefox-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'cold', 'Tp6: Reddit', {
      eq: {
        suite: 'raptor-tp6-reddit-firefox-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'cold', 'Tp6: eBay', {
      eq: {
        suite: 'raptor-tp6-ebay-firefox-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'cold', 'Tp6: Instagram', {
      eq: {
        suite: 'raptor-tp6-instagram-firefox-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'cold', 'Tp6: PayPal', {
      eq: {
        suite: 'raptor-tp6-paypal-firefox-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'cold', 'Tp6: Pinterest', {
      eq: {
        suite: 'raptor-tp6-pinterest-firefox-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'cold', 'Tp6: Docs', {
      eq: {
        suite: 'raptor-tp6-docs-firefox-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'cold', 'Tp6: Google Mail', {
      eq: {
        suite: 'raptor-tp6-google-mail-firefox-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'cold', 'Tp6: LinkedIn', {
      eq: {
        suite: 'raptor-tp6-linkedin-firefox-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'cold', 'Tp6: Outlook', {
      eq: {
        suite: 'raptor-tp6-outlook-firefox-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'cold', 'Tp6: Sheets', {
      eq: {
        suite: 'raptor-tp6-sheets-firefox-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'cold', 'Tp6: Slides', {
      eq: {
        suite: 'raptor-tp6-slides-firefox-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'cold', 'Tp6: Tumblr', {
      eq: {
        suite: 'raptor-tp6-tumblr-firefox-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'cold', 'Tp6: Twitter', {
      eq: {
        suite: 'raptor-tp6-twitter-firefox-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'cold', 'Tp6: Twitch', {
      eq: {
        suite: 'raptor-tp6-twitch-firefox-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'cold', 'Tp6: Wikipedia', {
      eq: {
        suite: 'raptor-tp6-wikipedia-firefox-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'cold', 'Tp6: Yahoo Mail', {
      eq: {
        suite: 'raptor-tp6-yahoo-mail-firefox-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Firefox', 'cold', 'Tp6: Yahoo News', {
      eq: {
        suite: 'raptor-tp6-yahoo-news-firefox-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],

    // YOU MAY REMOVE THE push_timestamp RESTRICTION AFTER APRIL 2020
    ['Chromium', 'warm', 'Tp6: Facebook', {
      or: [{
        and: [{ lt: { push_timestamp: { date: '2019-09-01' } } }, {
          eq: {
            suite: 'raptor-tp6-facebook-chrome',
            framework: 10,
            repo: 'mozilla-central',
          },
        }],
      }, {
        eq: {
          suite: 'raptor-tp6-facebook-chromium',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chromium', 'warm', 'Tp6: Amazon', {
      or: [{
        and: [{ lt: { push_timestamp: { date: '2019-09-01' } } }, {
          eq: {
            suite: 'raptor-tp6-amazon-chrome',
            framework: 10,
            repo: 'mozilla-central',
          },
        }],
      }, {
        eq: {
          suite: 'raptor-tp6-amazon-chromium',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chromium', 'warm', 'Tp6: Google', {
      or: [{
        and: [{ lt: { push_timestamp: { date: '2019-09-01' } } }, {
          eq: {
            suite: 'raptor-tp6-google-chrome',
            framework: 10,
            repo: 'mozilla-central',
          },
        }],
      }, {
        eq: {
          suite: 'raptor-tp6-google-chromium',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chromium', 'warm', 'Tp6: YouTube', {
      or: [{
        and: [{ lt: { push_timestamp: { date: '2019-09-01' } } }, {
          eq: {
            suite: 'raptor-tp6-youtube-chrome',
            framework: 10,
            repo: 'mozilla-central',
          },
        }],
      }, {
        eq: {
          suite: 'raptor-tp6-youtube-chromium',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chromium', 'warm', 'Tp6: Imdb', {
      or: [{
        and: [{ lt: { push_timestamp: { date: '2019-09-01' } } }, {
          eq: {
            suite: 'raptor-tp6-imdb-chrome',
            framework: 10,
            repo: 'mozilla-central',
          },
        }],
      }, {
        eq: {
          suite: 'raptor-tp6-imdb-chromium',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chromium', 'warm', 'Tp6: Imgur', {
      or: [{
        and: [{ lt: { push_timestamp: { date: '2019-09-01' } } }, {
          eq: {
            suite: 'raptor-tp6-imgur-chrome',
            framework: 10,
            repo: 'mozilla-central',
          },
        }],
      }, {
        eq: {
          suite: 'raptor-tp6-imgur-chromium',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chromium', 'warm', 'Tp6: Netflix', {
      or: [{
        and: [{ lt: { push_timestamp: { date: '2019-09-01' } } }, {
          eq: {
            suite: 'raptor-tp6-netflix-chrome',
            framework: 10,
            repo: 'mozilla-central',
          },
        }],
      }, {
        eq: {
          suite: 'raptor-tp6-netflix-chromium',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chromium', 'warm', 'Tp6: Fandom', {
      or: [{
        and: [{ lt: { push_timestamp: { date: '2019-09-01' } } }, {
          eq: {
            suite: 'raptor-tp6-fandom-chrome',
            framework: 10,
            repo: 'mozilla-central',
          },
        }],
      }, {
        eq: {
          suite: 'raptor-tp6-fandom-chromium',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chromium', 'warm', 'Tp6: Bing', {
      or: [{
        and: [{ lt: { push_timestamp: { date: '2019-09-01' } } }, {
          eq: {
            suite: 'raptor-tp6-bing-chrome',
            framework: 10,
            repo: 'mozilla-central',
          },
        }],
      }, {
        eq: {
          suite: 'raptor-tp6-bing-chromium',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chromium', 'warm', 'Tp6: Yandex', {
      or: [{
        and: [{ lt: { push_timestamp: { date: '2019-09-01' } } }, {
          eq: {
            suite: 'raptor-tp6-yandex-chrome',
            framework: 10,
            repo: 'mozilla-central',
          },
        }],
      }, {
        eq: {
          suite: 'raptor-tp6-yandex-chromium',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chromium', 'warm', 'Tp6: Apple', {
      or: [{
        and: [{ lt: { push_timestamp: { date: '2019-09-01' } } }, {
          eq: {
            suite: 'raptor-tp6-apple-chrome',
            framework: 10,
            repo: 'mozilla-central',
          },
        }],
      }, {
        eq: {
          suite: 'raptor-tp6-apple-chromium',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chromium', 'warm', 'Tp6: Microsoft', {
      or: [{
        and: [{ lt: { push_timestamp: { date: '2019-09-01' } } }, {
          eq: {
            suite: 'raptor-tp6-microsoft-chrome',
            framework: 10,
            repo: 'mozilla-central',
          },
        }],
      }, {
        eq: {
          suite: 'raptor-tp6-microsoft-chromium',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chromium', 'warm', 'Tp6: Office', {
      eq: {
        suite: 'raptor-tp6-office-chromium',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chromium', 'warm', 'Tp6: Reddit', {
      or: [{
        and: [{ lt: { push_timestamp: { date: '2019-09-01' } } }, {
          eq: {
            suite: 'raptor-tp6-reddit-chrome',
            framework: 10,
            repo: 'mozilla-central',
          },
        }],
      }, {
        eq: {
          suite: 'raptor-tp6-reddit-chromium',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chromium', 'warm', 'Tp6: Docs', {
      or: [{
        and: [{ lt: { push_timestamp: { date: '2019-09-01' } } }, {
          eq: {
            suite: 'raptor-tp6-docs-chrome',
            framework: 10,
            repo: 'mozilla-central',
          },
        }],
      }, {
        eq: {
          suite: 'raptor-tp6-docs-chromium',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chromium', 'warm', 'Tp6: eBay', {
      or: [{
        and: [{ lt: { push_timestamp: { date: '2019-09-01' } } }, {
          eq: {
            suite: 'raptor-tp6-ebay-chrome',
            framework: 10,
            repo: 'mozilla-central',
          },
        }],
      }, {
        eq: {
          suite: 'raptor-tp6-ebay-chromium',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chromium', 'warm', 'Tp6: Google Mail', {
      or: [{
        and: [{ lt: { push_timestamp: { date: '2019-09-01' } } }, {
          eq: {
            suite: 'raptor-tp6-google-mail-chrome',
            framework: 10,
            repo: 'mozilla-central',
          },
        }],
      }, {
        eq: {
          suite: 'raptor-tp6-google-mail-chromium',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chromium', 'warm', 'Tp6: Instagram', {
      or: [{
        and: [{ lt: { push_timestamp: { date: '2019-09-01' } } }, {
          eq: {
            suite: 'raptor-tp6-instagram-chrome',
            framework: 10,
            repo: 'mozilla-central',
          },
        }],
      }, {
        eq: {
          suite: 'raptor-tp6-instagram-chromium',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chromium', 'warm', 'Tp6: PayPal', {
      and: [{ lt: { push_timestamp: { date: '2019-09-01' } } }, {
        eq: {
          suite: 'raptor-tp6-paypal-chrome',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chromium', 'warm', 'Tp6: Pinterest', {
      or: [{
        and: [{ lt: { push_timestamp: { date: '2019-09-01' } } }, {
          eq: {
            suite: 'raptor-tp6-pinterest-chrome',
            framework: 10,
            repo: 'mozilla-central',
          },
        }],
      }, {
        eq: {
          suite: 'raptor-tp6-pinterest-chromium',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chromium', 'warm', 'Tp6: Sheets', {
      or: [{
        and: [{ lt: { push_timestamp: { date: '2019-09-01' } } }, {
          eq: {
            suite: 'raptor-tp6-sheets-chrome',
            framework: 10,
            repo: 'mozilla-central',
          },
        }],
      }, {
        eq: {
          suite: 'raptor-tp6-sheets-chromium',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chromium', 'warm', 'Tp6: Slides', {
      or: [{
        and: [{ lt: { push_timestamp: { date: '2019-09-01' } } }, {
          eq: {
            suite: 'raptor-tp6-slides-chrome',
            framework: 10,
            repo: 'mozilla-central',
          },
        }],
      }, {
        eq: {
          suite: 'raptor-tp6-slides-chromium',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chromium', 'warm', 'Tp6: Tumblr', {
      or: [{
        and: [{ lt: { push_timestamp: { date: '2019-09-01' } } }, {
          eq: {
            suite: 'raptor-tp6-tumblr-chrome',
            framework: 10,
            repo: 'mozilla-central',
          },
        }],
      }, {
        eq: {
          suite: 'raptor-tp6-tumblr-chromium',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chromium', 'warm', 'Tp6: Twitter', {
      or: [{
        and: [{ lt: { push_timestamp: { date: '2019-09-01' } } }, {
          eq: {
            suite: 'raptor-tp6-twitter-chrome',
            framework: 10,
            repo: 'mozilla-central',
          },
        }],
      }, {
        eq: {
          suite: 'raptor-tp6-twitter-chromium',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chromium', 'warm', 'Tp6: Twitch', {
      or: [{
        and: [{ lt: { push_timestamp: { date: '2019-09-01' } } }, {
          eq: {
            suite: 'raptor-tp6-twitch-chrome',
            framework: 10,
            repo: 'mozilla-central',
          },
        }],
      }, {
        eq: {
          suite: 'raptor-tp6-twitch-chromium',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chromium', 'warm', 'Tp6: Wikipedia', {
      or: [{
        and: [{ lt: { push_timestamp: { date: '2019-09-01' } } }, {
          eq: {
            suite: 'raptor-tp6-wikipedia-chrome',
            framework: 10,
            repo: 'mozilla-central',
          },
        }],
      }, {
        eq: {
          suite: 'raptor-tp6-wikipedia-chromium',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chromium', 'warm', 'Tp6: Yahoo Mail', {
      or: [{
        and: [{ lt: { push_timestamp: { date: '2019-09-01' } } }, {
          eq: {
            suite: 'raptor-tp6-yahoo-mail-chrome',
            framework: 10,
            repo: 'mozilla-central',
          },
        }],
      }, {
        eq: {
          suite: 'raptor-tp6-yahoo-mail-chromium',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chromium', 'warm', 'Tp6: Yahoo News', {
      or: [{
        and: [{ lt: { push_timestamp: { date: '2019-09-01' } } }, {
          eq: {
            suite: 'raptor-tp6-yahoo-news-chrome',
            framework: 10,
            repo: 'mozilla-central',
          },
        }],
      }, {
        eq: {
          suite: 'raptor-tp6-yahoo-news-chromium',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],

    ['Chromium', 'cold', 'Tp6: Facebook', {
      eq: {
        suite: 'raptor-tp6-facebook-chromium-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chromium', 'cold', 'Tp6: Amazon', {
      eq: {
        suite: 'raptor-tp6-amazon-chromium-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chromium', 'cold', 'Tp6: Google', {
      eq: {
        suite: 'raptor-tp6-google-chromium-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chromium', 'cold', 'Tp6: YouTube', {
      eq: {
        suite: 'raptor-tp6-youtube-chromium-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chromium', 'cold', 'Tp6: Imdb', {
      eq: {
        suite: 'raptor-tp6-imdb-chromium-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chromium', 'cold', 'Tp6: Imgur', {
      eq: {
        suite: 'raptor-tp6-imgur-chromium-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chromium', 'cold', 'Tp6: Netflix', {
      eq: {
        suite: 'raptor-tp6-netflix-chromium-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chromium', 'cold', 'Tp6: Fandom', {
      eq: {
        suite: 'raptor-tp6-fandom-chromium-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chromium', 'cold', 'Tp6: Bing', {
      eq: {
        suite: 'raptor-tp6-bing-chromium-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chromium', 'cold', 'Tp6: Yandex', {
      eq: {
        suite: 'raptor-tp6-yandex-chromium-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chromium', 'cold', 'Tp6: Apple', {
      eq: {
        suite: 'raptor-tp6-apple-chromium-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chromium', 'cold', 'Tp6: Microsoft', {
      eq: {
        suite: 'raptor-tp6-microsoft-chromium-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chromium', 'cold', 'Tp6: Office', {
      eq: {
        suite: 'raptor-tp6-office-chromium-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chromium', 'cold', 'Tp6: Reddit', {
      eq: {
        suite: 'raptor-tp6-reddit-chromium-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chromium', 'cold', 'Tp6: eBay', {
      eq: {
        suite: 'raptor-tp6-ebay-chromium-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chromium', 'cold', 'Tp6: Instagram', {
      eq: {
        suite: 'raptor-tp6-instagram-chromium-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chromium', 'cold', 'Tp6: PayPal', {
      eq: {
        suite: 'raptor-tp6-paypal-chromium-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chromium', 'cold', 'Tp6: Pinterest', {
      eq: {
        suite: 'raptor-tp6-pinterest-chromium-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chromium', 'cold', 'Tp6: Docs', {
      eq: {
        suite: 'raptor-tp6-docs-chromium-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chromium', 'cold', 'Tp6: Google Mail', {
      eq: {
        suite: 'raptor-tp6-google-mail-chromium-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    // ['Chromium', 'cold', 'Tp6: LinkedIn', {eq:{suite:'raptor-tp6-linkedin-chromium-cold'}}],
    // ['Chromium', 'cold', 'Tp6: Outlook', {eq:{suite:'raptor-tp6-outlook-chromium-cold'}}],
    ['Chromium', 'cold', 'Tp6: Sheets', {
      eq: {
        suite: 'raptor-tp6-sheets-chromium-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chromium', 'cold', 'Tp6: Slides', {
      eq: {
        suite: 'raptor-tp6-slides-chromium-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chromium', 'cold', 'Tp6: Tumblr', {
      eq: {
        suite: 'raptor-tp6-tumblr-chromium-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chromium', 'cold', 'Tp6: Twitter', {
      eq: {
        suite: 'raptor-tp6-twitter-chromium-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chromium', 'cold', 'Tp6: Twitch', {
      eq: {
        suite: 'raptor-tp6-twitch-chromium-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chromium', 'cold', 'Tp6: Wikipedia', {
      eq: {
        suite: 'raptor-tp6-wikipedia-chromium-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chromium', 'cold', 'Tp6: Yahoo Mail', {
      eq: {
        suite: 'raptor-tp6-yahoo-mail-chromium-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chromium', 'cold', 'Tp6: Yahoo News', {
      eq: {
        suite: 'raptor-tp6-yahoo-news-chromium-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],


    ['Chrome', 'warm', 'Tp6: Facebook', {
      and: [{ gte: { push_timestamp: { date: '2019-09-01' } } }, {
        eq: {
          suite: 'raptor-tp6-facebook-chrome',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chrome', 'warm', 'Tp6: Amazon', {
      and: [{ gte: { push_timestamp: { date: '2019-09-01' } } }, {
        eq: {
          suite: 'raptor-tp6-amazon-chrome',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chrome', 'warm', 'Tp6: Google', {
      and: [{ gte: { push_timestamp: { date: '2019-09-01' } } }, {
        eq: {
          suite: 'raptor-tp6-google-chrome',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chrome', 'warm', 'Tp6: YouTube', {
      and: [{ gte: { push_timestamp: { date: '2019-09-01' } } }, {
        eq: {
          suite: 'raptor-tp6-youtube-chrome',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chrome', 'warm', 'Tp6: Imdb', {
      and: [{ gte: { push_timestamp: { date: '2019-09-01' } } }, {
        eq: {
          suite: 'raptor-tp6-imdb-chrome',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chrome', 'warm', 'Tp6: Imgur', {
      and: [{ gte: { push_timestamp: { date: '2019-09-01' } } }, {
        eq: {
          suite: 'raptor-tp6-imgur-chrome',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chrome', 'warm', 'Tp6: Netflix', {
      and: [{ gte: { push_timestamp: { date: '2019-09-01' } } }, {
        eq: {
          suite: 'raptor-tp6-netflix-chrome',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chrome', 'warm', 'Tp6: Fandom', {
      and: [{ gte: { push_timestamp: { date: '2019-09-01' } } }, {
        eq: {
          suite: 'raptor-tp6-fandom-chrome',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chrome', 'warm', 'Tp6: Bing', {
      and: [{ gte: { push_timestamp: { date: '2019-09-01' } } }, {
        eq: {
          suite: 'raptor-tp6-bing-chrome',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chrome', 'warm', 'Tp6: Yandex', {
      and: [{ gte: { push_timestamp: { date: '2019-09-01' } } }, {
        eq: {
          suite: 'raptor-tp6-yandex-chrome',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chrome', 'warm', 'Tp6: Apple', {
      and: [{ gte: { push_timestamp: { date: '2019-09-01' } } }, {
        eq: {
          suite: 'raptor-tp6-apple-chrome',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chrome', 'warm', 'Tp6: Microsoft', {
      and: [{ gte: { push_timestamp: { date: '2019-09-01' } } }, {
        eq: {
          suite: 'raptor-tp6-microsoft-chrome',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chrome', 'warm', 'Tp6: Office', {
      and: [{ gte: { push_timestamp: { date: '2019-09-01' } } }, {
        eq: {
          suite: 'raptor-tp6-office-chromium',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chrome', 'warm', 'Tp6: Reddit', {
      and: [{ gte: { push_timestamp: { date: '2019-09-01' } } }, {
        eq: {
          suite: 'raptor-tp6-reddit-chrome',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chrome', 'warm', 'Tp6: Docs', {
      and: [{ gte: { push_timestamp: { date: '2019-09-01' } } }, {
        eq: {
          suite: 'raptor-tp6-docs-chrome',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chrome', 'warm', 'Tp6: eBay', {
      and: [{ gte: { push_timestamp: { date: '2019-09-01' } } }, {
        eq: {
          suite: 'raptor-tp6-ebay-chrome',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chrome', 'warm', 'Tp6: Google Mail', {
      and: [{ gte: { push_timestamp: { date: '2019-09-01' } } }, {
        eq: {
          suite: 'raptor-tp6-google-mail-chrome',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chrome', 'warm', 'Tp6: Instagram', {
      and: [{ gte: { push_timestamp: { date: '2019-09-01' } } }, {
        eq: {
          suite: 'raptor-tp6-instagram-chrome',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chrome', 'warm', 'Tp6: PayPal', {
      and: [{ gte: { push_timestamp: { date: '2019-09-01' } } }, {
        eq: {
          suite: 'raptor-tp6-paypal-chrome',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chrome', 'warm', 'Tp6: Pinterest', {
      and: [{ gte: { push_timestamp: { date: '2019-09-01' } } }, {
        eq: {
          suite: 'raptor-tp6-pinterest-chrome',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chrome', 'warm', 'Tp6: Sheets', {
      and: [{ gte: { push_timestamp: { date: '2019-09-01' } } }, {
        eq: {
          suite: 'raptor-tp6-sheets-chrome',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chrome', 'warm', 'Tp6: Slides', {
      and: [{ gte: { push_timestamp: { date: '2019-09-01' } } }, {
        eq: {
          suite: 'raptor-tp6-slides-chrome',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chrome', 'warm', 'Tp6: Tumblr', {
      and: [{ gte: { push_timestamp: { date: '2019-09-01' } } }, {
        eq: {
          suite: 'raptor-tp6-tumblr-chrome',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chrome', 'warm', 'Tp6: Twitter', {
      and: [{ gte: { push_timestamp: { date: '2019-09-01' } } }, {
        eq: {
          suite: 'raptor-tp6-twitter-chrome',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chrome', 'warm', 'Tp6: Twitch', {
      and: [{ gte: { push_timestamp: { date: '2019-09-01' } } }, {
        eq: {
          suite: 'raptor-tp6-twitch-chrome',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chrome', 'warm', 'Tp6: Wikipedia', {
      and: [{ gte: { push_timestamp: { date: '2019-09-01' } } }, {
        eq: {
          suite: 'raptor-tp6-wikipedia-chrome',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chrome', 'warm', 'Tp6: Yahoo Mail', {
      and: [{ gte: { push_timestamp: { date: '2019-09-01' } } }, {
        eq: {
          suite: 'raptor-tp6-yahoo-mail-chrome',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],
    ['Chrome', 'warm', 'Tp6: Yahoo News', {
      and: [{ gte: { push_timestamp: { date: '2019-09-01' } } }, {
        eq: {
          suite: 'raptor-tp6-yahoo-news-chrome',
          framework: 10,
          repo: 'mozilla-central',
        },
      }],
    }],

    ['Chrome', 'cold', 'Tp6: Facebook', {
      eq: {
        suite: 'raptor-tp6-facebook-chrome-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chrome', 'cold', 'Tp6: Amazon', {
      eq: {
        suite: 'raptor-tp6-amazon-chrome-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chrome', 'cold', 'Tp6: Google', {
      eq: {
        suite: 'raptor-tp6-google-chrome-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chrome', 'cold', 'Tp6: YouTube', {
      eq: {
        suite: 'raptor-tp6-youtube-chrome-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chrome', 'cold', 'Tp6: Imdb', {
      eq: {
        suite: 'raptor-tp6-imdb-chrome-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chrome', 'cold', 'Tp6: Imgur', {
      eq: {
        suite: 'raptor-tp6-imgur-chrome-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chrome', 'cold', 'Tp6: Netflix', {
      eq: {
        suite: 'raptor-tp6-netflix-chrome-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chrome', 'cold', 'Tp6: Fandom', {
      eq: {
        suite: 'raptor-tp6-fandom-chrome-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chrome', 'cold', 'Tp6: Bing', {
      eq: {
        suite: 'raptor-tp6-bing-chrome-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chrome', 'cold', 'Tp6: Yandex', {
      eq: {
        suite: 'raptor-tp6-yandex-chrome-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chrome', 'cold', 'Tp6: Apple', {
      eq: {
        suite: 'raptor-tp6-apple-chrome-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chrome', 'cold', 'Tp6: Microsoft', {
      eq: {
        suite: 'raptor-tp6-microsoft-chrome-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chrome', 'cold', 'Tp6: Office', {
      eq: {
        suite: 'raptor-tp6-office-chrome-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chrome', 'cold', 'Tp6: Reddit', {
      eq: {
        suite: 'raptor-tp6-reddit-chrome-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chrome', 'cold', 'Tp6: eBay', {
      eq: {
        suite: 'raptor-tp6-ebay-chrome-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chrome', 'cold', 'Tp6: Instagram', {
      eq: {
        suite: 'raptor-tp6-instagram-chrome-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chrome', 'cold', 'Tp6: PayPal', {
      eq: {
        suite: 'raptor-tp6-paypal-chrome-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chrome', 'cold', 'Tp6: Pinterest', {
      eq: {
        suite: 'raptor-tp6-pinterest-chrome-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chrome', 'cold', 'Tp6: Docs', {
      eq: {
        suite: 'raptor-tp6-docs-chrome-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chrome', 'cold', 'Tp6: Google Mail', {
      eq: {
        suite: 'raptor-tp6-google-mail-chrome-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    // ['Chrome', 'cold', 'Tp6: LinkedIn', {eq:{suite:'raptor-tp6-linkedin-chrome-cold'}}],
    // ['Chrome', 'cold', 'Tp6: Outlook', {eq:{suite:'raptor-tp6-outlook-chrome-cold'}}],
    ['Chrome', 'cold', 'Tp6: Sheets', {
      eq: {
        suite: 'raptor-tp6-sheets-chrome-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chrome', 'cold', 'Tp6: Slides', {
      eq: {
        suite: 'raptor-tp6-slides-chrome-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chrome', 'cold', 'Tp6: Tumblr', {
      eq: {
        suite: 'raptor-tp6-tumblr-chrome-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chrome', 'cold', 'Tp6: Twitter', {
      eq: {
        suite: 'raptor-tp6-twitter-chrome-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chrome', 'cold', 'Tp6: Twitch', {
      eq: {
        suite: 'raptor-tp6-twitch-chrome-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chrome', 'cold', 'Tp6: Wikipedia', {
      eq: {
        suite: 'raptor-tp6-wikipedia-chrome-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chrome', 'cold', 'Tp6: Yahoo Mail', {
      eq: {
        suite: 'raptor-tp6-yahoo-mail-chrome-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],
    ['Chrome', 'cold', 'Tp6: Yahoo News', {
      eq: {
        suite: 'raptor-tp6-yahoo-news-chrome-cold',
        framework: 10,
        repo: 'mozilla-central',
      },
    }],


    ['geckoview', 'cold', 'Tp6 mobile: Amazon', {
      eq: {
        application: 'geckoview', suite: 'amazon', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'cold', 'Tp6 mobile: Amazon Search', {
      eq: {
        application: 'geckoview', suite: 'amazon-search', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'cold', 'Tp6 mobile: All Recipes', {
      eq: {
        application: 'geckoview', suite: 'allrecipes', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'cold', 'Tp6 mobile: BBC', {
      eq: {
        application: 'geckoview', suite: 'bbc', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'cold', 'Tp6 mobile: Bing', {
      eq: {
        application: 'geckoview', suite: 'bing', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'cold', 'Tp6 mobile: Bing Restaurants', {
      eq: {
        application: 'geckoview', suite: 'bing-search-restaurants', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'cold', 'Tp6 mobile: Booking', {
      eq: {
        application: 'geckoview', suite: 'booking', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'cold', 'Tp6 mobile: CNN', {
      eq: {
        application: 'geckoview', suite: 'cnn', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'cold', 'Tp6 mobile: CNN AmpStories', {
      eq: {
        application: 'geckoview', suite: 'cnn-ampstories', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'cold', 'Tp6 mobile: Kleinanzeigen', {
      eq: {
        application: 'geckoview', suite: 'ebay-kleinanzeigen', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'cold', 'Tp6 mobile: Kleinanzeigen Search', {
      eq: {
        application: 'geckoview', suite: 'ebay-kleinanzeigen-search', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'cold', 'Tp6 mobile: ESPN', {
      eq: {
        application: 'geckoview', suite: 'espn', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'cold', 'Tp6 mobile: Facebook', {
      eq: {
        application: 'geckoview', suite: 'facebook', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'cold', 'Tp6 mobile: Facebook Cristiano', {
      eq: {
        application: 'geckoview', suite: 'facebook-cristiano', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'cold', 'Tp6 mobile: Google', {
      eq: {
        application: 'geckoview', suite: 'google', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'cold', 'Tp6 mobile: Google Maps', {
      eq: {
        application: 'geckoview', suite: 'google-maps', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'cold', 'Tp6 mobile: Google Restaurants', {
      eq: {
        application: 'geckoview', suite: 'google-search-restaurants', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'cold', 'Tp6 mobile: Instagram', {
      eq: {
        application: 'geckoview', suite: 'instagram', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'cold', 'Tp6 mobile: Imdb', {
      eq: {
        application: 'geckoview', suite: 'imdb', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'cold', 'Tp6 mobile: Jianshu', {
      eq: {
        application: 'geckoview', suite: 'jianshu', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'cold', 'Tp6 mobile: Microsoft Support', {
      eq: {
        application: 'geckoview', suite: 'microsoft-support', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'cold', 'Tp6 mobile: Reddit', {
      eq: {
        application: 'geckoview', suite: 'reddit', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'cold', 'Tp6 mobile: Stackoverflow', {
      eq: {
        application: 'geckoview', suite: 'stackoverflow', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'cold', 'Tp6 mobile: Web.de', {
      eq: {
        application: 'geckoview', suite: 'web-de', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'cold', 'Tp6 mobile: Wikipedia', {
      eq: {
        application: 'geckoview', suite: 'wikipedia', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'cold', 'Tp6 mobile: YouTube', {
      eq: {
        application: 'geckoview', suite: 'youtube', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'cold', 'Tp6 mobile: YouTube Watch', {
      eq: {
        application: 'geckoview', suite: 'youtube-watch', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],

    ['geckoview', 'warm', 'Tp6 mobile: Amazon', {
      eq: {
        application: 'geckoview', suite: 'amazon', cold: false, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'warm', 'Tp6 mobile: Amazon Search', {
      eq: {
        application: 'geckoview', suite: 'amazon-search', cold: false, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'warm', 'Tp6 mobile: All Recipes', {
      eq: {
        application: 'geckoview', suite: 'allrecipes', cold: false, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'warm', 'Tp6 mobile: BBC', {
      eq: {
        application: 'geckoview', suite: 'bbc', cold: false, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'warm', 'Tp6 mobile: Bing', {
      eq: {
        application: 'geckoview', suite: 'bing', cold: false, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'warm', 'Tp6 mobile: Bing Restaurants', {
      eq: {
        application: 'geckoview', suite: 'bing-search-restaurants', cold: false, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'warm', 'Tp6 mobile: Booking', {
      eq: {
        application: 'geckoview', suite: 'booking', cold: false, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'warm', 'Tp6 mobile: CNN', {
      eq: {
        application: 'geckoview', suite: 'cnn', cold: false, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'warm', 'Tp6 mobile: CNN AmpStories', {
      eq: {
        application: 'geckoview', suite: 'cnn-ampstories', cold: false, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'warm', 'Tp6 mobile: Kleinanzeigen', {
      eq: {
        application: 'geckoview', suite: 'ebay-kleinanzeigen', cold: false, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'warm', 'Tp6 mobile: Kleinanzeigen Search', {
      eq: {
        application: 'geckoview', suite: 'ebay-kleinanzeigen-search', cold: false, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'warm', 'Tp6 mobile: ESPN', {
      eq: {
        application: 'geckoview', suite: 'espn', cold: false, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'warm', 'Tp6 mobile: Facebook', {
      eq: {
        application: 'geckoview', suite: 'facebook', cold: false, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'warm', 'Tp6 mobile: Facebook Cristiano', {
      eq: {
        application: 'geckoview', suite: 'facebook-cristiano', cold: false, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'warm', 'Tp6 mobile: Google', {
      eq: {
        application: 'geckoview', suite: 'google', cold: false, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'warm', 'Tp6 mobile: Google Maps', {
      eq: {
        application: 'geckoview', suite: 'google-maps', cold: false, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'warm', 'Tp6 mobile: Google Restaurants', {
      eq: {
        application: 'geckoview', suite: 'google-search-restaurants', cold: false, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'warm', 'Tp6 mobile: Instagram', {
      eq: {
        application: 'geckoview', suite: 'instagram', cold: false, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'warm', 'Tp6 mobile: Imdb', {
      eq: {
        application: 'geckoview', suite: 'imdb', cold: false, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'warm', 'Tp6 mobile: Jianshu', {
      eq: {
        application: 'geckoview', suite: 'jianshu', cold: false, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'warm', 'Tp6 mobile: Microsoft Support', {
      eq: {
        application: 'geckoview', suite: 'microsoft-support', cold: false, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'warm', 'Tp6 mobile: Reddit', {
      eq: {
        application: 'geckoview', suite: 'reddit', cold: false, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'warm', 'Tp6 mobile: Stackoverflow', {
      eq: {
        application: 'geckoview', suite: 'stackoverflow', cold: false, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'warm', 'Tp6 mobile: Web.de', {
      eq: {
        application: 'geckoview', suite: 'web-de', cold: false, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'warm', 'Tp6 mobile: Wikipedia', {
      eq: {
        application: 'geckoview', suite: 'wikipedia', cold: false, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'warm', 'Tp6 mobile: YouTube', {
      eq: {
        application: 'geckoview', suite: 'youtube', cold: false, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['geckoview', 'warm', 'Tp6 mobile: YouTube Watch', {
      eq: {
        application: 'geckoview', suite: 'youtube-watch', cold: false, framework: 13, repo: 'mozilla-central',
      },
    }],

    ['fenix', 'cold', 'Tp6 mobile: Amazon', {
      eq: {
        application: 'fenix', suite: 'amazon', cold: true, framework: 13, repo: 'fenix',
      },
    }],
    ['fenix', 'cold', 'Tp6 mobile: Amazon Search', {
      eq: {
        application: 'fenix', suite: 'amazon-search', cold: true, framework: 13, repo: 'fenix',
      },
    }],
    ['fenix', 'cold', 'Tp6 mobile: All Recipes', {
      eq: {
        application: 'fenix', suite: 'allrecipes', cold: true, framework: 13, repo: 'fenix',
      },
    }],
    ['fenix', 'cold', 'Tp6 mobile: BBC', {
      eq: {
        application: 'fenix', suite: 'bbc', cold: true, framework: 13, repo: 'fenix',
      },
    }],
    ['fenix', 'cold', 'Tp6 mobile: Bing', {
      eq: {
        application: 'fenix', suite: 'bing', cold: true, framework: 13, repo: 'fenix',
      },
    }],
    ['fenix', 'cold', 'Tp6 mobile: Bing Restaurants', {
      eq: {
        application: 'fenix', suite: 'bing-search-restaurants', cold: true, framework: 13, repo: 'fenix',
      },
    }],
    ['fenix', 'cold', 'Tp6 mobile: Booking', {
      eq: {
        application: 'fenix', suite: 'booking', cold: true, framework: 13, repo: 'fenix',
      },
    }],
    ['fenix', 'cold', 'Tp6 mobile: CNN', {
      eq: {
        application: 'fenix', suite: 'cnn', cold: true, framework: 13, repo: 'fenix',
      },
    }],
    ['fenix', 'cold', 'Tp6 mobile: CNN AmpStories', {
      eq: {
        application: 'fenix', suite: 'cnn-ampstories', cold: true, framework: 13, repo: 'fenix',
      },
    }],
    ['fenix', 'cold', 'Tp6 mobile: Kleinanzeigen', {
      eq: {
        application: 'fenix', suite: 'ebay-kleinanzeigen', cold: true, framework: 13, repo: 'fenix',
      },
    }],
    ['fenix', 'cold', 'Tp6 mobile: Kleinanzeigen Search', {
      eq: {
        application: 'fenix', suite: 'ebay-kleinanzeigen-search', cold: true, framework: 13, repo: 'fenix',
      },
    }],
    ['fenix', 'cold', 'Tp6 mobile: ESPN', {
      eq: {
        application: 'fenix', suite: 'espn', cold: true, framework: 13, repo: 'fenix',
      },
    }],
    ['fenix', 'cold', 'Tp6 mobile: Facebook', {
      eq: {
        application: 'fenix', suite: 'facebook', cold: true, framework: 13, repo: 'fenix',
      },
    }],
    ['fenix', 'cold', 'Tp6 mobile: Facebook Cristiano', {
      eq: {
        application: 'fenix', suite: 'facebook-cristiano', cold: true, framework: 13, repo: 'fenix',
      },
    }],
    ['fenix', 'cold', 'Tp6 mobile: Google', {
      eq: {
        application: 'fenix', suite: 'google', cold: true, framework: 13, repo: 'fenix',
      },
    }],
    ['fenix', 'cold', 'Tp6 mobile: Google Maps', {
      eq: {
        application: 'fenix', suite: 'google-maps', cold: true, framework: 13, repo: 'fenix',
      },
    }],
    ['fenix', 'cold', 'Tp6 mobile: Google Restaurants', {
      eq: {
        application: 'fenix', suite: 'google-search-restaurants', cold: true, framework: 13, repo: 'fenix',
      },
    }],
    ['fenix', 'cold', 'Tp6 mobile: Instagram', {
      eq: {
        application: 'fenix', suite: 'instagram', cold: true, framework: 13, repo: 'fenix',
      },
    }],
    ['fenix', 'cold', 'Tp6 mobile: Imdb', {
      eq: {
        application: 'fenix', suite: 'imdb', cold: true, framework: 13, repo: 'fenix',
      },
    }],
    ['fenix', 'cold', 'Tp6 mobile: Jianshu', {
      eq: {
        application: 'fenix', suite: 'jianshu', cold: true, framework: 13, repo: 'fenix',
      },
    }],
    ['fenix', 'cold', 'Tp6 mobile: Microsoft Support', {
      eq: {
        application: 'fenix', suite: 'microsoft-support', cold: true, framework: 13, repo: 'fenix',
      },
    }],
    ['fenix', 'cold', 'Tp6 mobile: Reddit', {
      eq: {
        application: 'fenix', suite: 'reddit', cold: true, framework: 13, repo: 'fenix',
      },
    }],
    ['fenix', 'cold', 'Tp6 mobile: Stackoverflow', {
      eq: {
        application: 'fenix', suite: 'stackoverflow', cold: true, framework: 13, repo: 'fenix',
      },
    }],
    ['fenix', 'cold', 'Tp6 mobile: Web.de', {
      eq: {
        application: 'fenix', suite: 'web-de', cold: true, framework: 13, repo: 'fenix',
      },
    }],
    ['fenix', 'cold', 'Tp6 mobile: Wikipedia', {
      eq: {
        application: 'fenix', suite: 'wikipedia', cold: true, framework: 13, repo: 'fenix',
      },
    }],
    ['fenix', 'cold', 'Tp6 mobile: YouTube', {
      eq: {
        application: 'fenix', suite: 'youtube', cold: true, framework: 13, repo: 'fenix',
      },
    }],
    ['fenix', 'cold', 'Tp6 mobile: YouTube Watch', {
      eq: {
        application: 'fenix', suite: 'youtube-watch', cold: true, framework: 13, repo: 'fenix',
      },
    }],

    ['fennec68', 'cold', 'Tp6 mobile: Amazon', {
      eq: {
        application: 'fennec', suite: 'amazon', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['fennec68', 'cold', 'Tp6 mobile: Amazon Search', {
      eq: {
        application: 'fennec', suite: 'amazon-search', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['fennec68', 'cold', 'Tp6 mobile: All Recipes', {
      eq: {
        application: 'fennec', suite: 'allrecipes', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['fennec68', 'cold', 'Tp6 mobile: BBC', {
      eq: {
        application: 'fennec', suite: 'bbc', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['fennec68', 'cold', 'Tp6 mobile: Bing', {
      eq: {
        application: 'fennec', suite: 'bing', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['fennec68', 'cold', 'Tp6 mobile: Bing Restaurants', {
      eq: {
        application: 'fennec', suite: 'bing-search-restaurants', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['fennec68', 'cold', 'Tp6 mobile: Booking', {
      eq: {
        application: 'fennec', suite: 'booking', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['fennec68', 'cold', 'Tp6 mobile: CNN', {
      eq: {
        application: 'fennec', suite: 'cnn', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['fennec68', 'cold', 'Tp6 mobile: CNN AmpStories', {
      eq: {
        application: 'fennec', suite: 'cnn-ampstories', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['fennec68', 'cold', 'Tp6 mobile: Kleinanzeigen', {
      eq: {
        application: 'fennec', suite: 'ebay-kleinanzeigen', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['fennec68', 'cold', 'Tp6 mobile: Kleinanzeigen Search', {
      eq: {
        application: 'fennec', suite: 'ebay-kleinanzeigen-search', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['fennec68', 'cold', 'Tp6 mobile: ESPN', {
      eq: {
        application: 'fennec', suite: 'espn', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['fennec68', 'cold', 'Tp6 mobile: Facebook', {
      eq: {
        application: 'fennec', suite: 'facebook', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['fennec68', 'cold', 'Tp6 mobile: Facebook Cristiano', {
      eq: {
        application: 'fennec', suite: 'facebook-cristiano', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['fennec68', 'cold', 'Tp6 mobile: Google', {
      eq: {
        application: 'fennec', suite: 'google', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['fennec68', 'cold', 'Tp6 mobile: Google Maps', {
      eq: {
        application: 'fennec', suite: 'google-maps', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['fennec68', 'cold', 'Tp6 mobile: Google Restaurants', {
      eq: {
        application: 'fennec', suite: 'google-search-restaurants', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['fennec68', 'cold', 'Tp6 mobile: Instagram', {
      eq: {
        application: 'fennec', suite: 'instagram', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['fennec68', 'cold', 'Tp6 mobile: Imdb', {
      eq: {
        application: 'fennec', suite: 'imdb', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['fennec68', 'cold', 'Tp6 mobile: Jianshu', {
      eq: {
        application: 'fennec', suite: 'jianshu', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['fennec68', 'cold', 'Tp6 mobile: Microsoft Support', {
      eq: {
        application: 'fennec', suite: 'microsoft-support', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['fennec68', 'cold', 'Tp6 mobile: Reddit', {
      eq: {
        application: 'fennec', suite: 'reddit', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['fennec68', 'cold', 'Tp6 mobile: Stackoverflow', {
      eq: {
        application: 'fennec', suite: 'stackoverflow', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['fennec68', 'cold', 'Tp6 mobile: Web.de', {
      eq: {
        application: 'fennec', suite: 'web-de', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['fennec68', 'cold', 'Tp6 mobile: Wikipedia', {
      eq: {
        application: 'fennec', suite: 'wikipedia', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['fennec68', 'cold', 'Tp6 mobile: YouTube', {
      eq: {
        application: 'fennec', suite: 'youtube', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],
    ['fennec68', 'cold', 'Tp6 mobile: YouTube Watch', {
      eq: {
        application: 'fennec', suite: 'youtube-watch', cold: true, framework: 13, repo: 'mozilla-central',
      },
    }],

  ],
};

// Ensure "site" covers both cold and warm tests
const TP6M_SITES = selectFrom(TP6_SITES_DATA.data)
  .map(row => Data.zip(TP6_SITES_DATA.header, row))
  .where({ browser: ['geckoview', 'fenix', 'fennec68'] })
  .groupBy('site')
  .map((ss, site) => ({
    site,
    mode: selectFrom(ss).select('mode').union().toArray(),
    siteFilter: { or: selectFrom(ss).select('siteFilter') },
  }))
  .materialize();

// Ensure "test" covers all suites for given mode
const TP6_TESTS = selectFrom(TP6_SITES_DATA.data)
  .map(row => Data.zip(TP6_SITES_DATA.header, row))
  .leftJoin('mode', TP6_TESTS_DATA, 'mode')
  .groupBy('test')
  .map((combos, test) => ({
    test,
    label: first(combos).label,
    mode: first(combos).mode,
    testFilter: {
      and: [
        first(combos).testFilter,
        { or: selectFrom(combos).select('siteFilter').toArray() },
      ],
    },
  }))
  .materialize();


// ALL PAGE COMBINATIONS
const TP6_COMBOS = selectFrom(TP6_SITES_DATA.data)
  .map(row => Data.zip(TP6_SITES_DATA.header, row))
  .sort('site')
  .leftJoin('browser', BROWSER_PLATFORMS, 'browser')
  .leftJoin('mode', TP6_TESTS_DATA, 'mode')
  .map(({
    siteFilter, testFilter, platformFilter, ...rest
  }) => ({
    ...rest,
    filter: { and: [siteFilter, testFilter, platformFilter] },
  }))
  .materialize();

const BENCHMARKS = selectFrom(BENCHMARK_SUITES.data)
  .map(row => Data.zip(BENCHMARK_SUITES.header, row))
  .leftJoin('browser', BROWSER_PLATFORMS, 'browser')
  .where({ platform: ['win32', 'win64', 'linux64', 'macosx'] })
  .map(({
    id, label, suiteFilter, platformFilter, ...rest
  }) => ({
    ...rest,
    filter: { and: [suiteFilter, platformFilter] },
  }))
  .materialize();


export {
  BENCHMARKS, TP6_COMBOS, TP6M_SITES, BROWSER_PLATFORMS, TP6_TESTS, TP6_SITES_DATA, TP6_TESTS_DATA,
};
