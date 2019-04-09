/* eslint-disable */

import { selectFrom } from '../vendor/vectors';
import { Data } from '../vendor/Data';
import { Log } from '../vendor/logs';

const CONFIG = {
  windows64Regression: [
    {
      title: 'MotionMark HTML suite',
      secondLink:
        '/quantum/10/windows10-64/raptor-motionmark-htmlsuite-firefox/pgo',
      secondTitle: 'Breakdown',
      signatures: {
        'windows10-64': '8f014459793e2e94c3244d5edeaada0452b0c627',
      },
      framework: 10,
    },
    {
      title: 'MotionMark Animometer',
      secondLink:
        '/quantum/10/windows10-64/raptor-motionmark_animometer-firefox/pgo',
      secondTitle: 'Breakdown',
      signatures: {
        'windows10-64': '9ad671fb568a5b3027af35b5d42fc6dd385f25ed',
      },
      framework: 10,
    },
  ],
  windows32Regression: [
    {
      title: 'MotionMark HTML suite',
      secondLink:
        '/quantum/10/windows7-32/raptor-motionmark_htmlsuite-firefox/pgo',
      secondTitle: 'Breakdown',
      signatures: {'windows7-32': 'd1984855d038409797bbc8ad82c32489eb04cc23'},
      framework: 10,
    },
    {
      title: 'MotionMark Animometer',
      secondLink:
        '/quantum/10/windows7-32/raptor-motionmark_animometer-firefox/pgo',
      secondTitle: 'Breakdown',
      signatures: {'windows7-32': '3d5a0a5e3c37f74770bdcb75bd46347be228495f'},
      framework: 10,
    },
  ],
};
const PLATFORMS = [
  {
    browser: 'Firefox',
    ordering: 1,
    bits: 32,
    os: 'win',
    label: 'Firefox',
    platform: "win32",
    seriesConfig: {
      and: [
        {
          or: [
            {
              eq: {
                platform: 'windows7-32',
                options: "pgo"
              }
            },
            {
              eq: {
                platform: 'windows7-32-shippable',
                options: "opt"

              }
            }

          ]
        },
        {
          eq: {
            framework: 10,
            repo: 'mozilla-central',
          }
        },

      ]
    }
  },
  {
    browser: 'Firefox',
    ordering: 1,
    bits: 64,
    os: 'win',
    label: 'Firefox',
    platform: "win64",
    seriesConfig: {
      and: [
        {
          or: [
            {
              eq: {
                platform: 'windows10-64',
                options: "pgo"
              }
            },
            {
              eq: {
                platform: 'windows10-64-shippable',
                options: "opt"

              }
            }

          ]
        },
        {
          eq: {
            framework: 10,
            repo: 'mozilla-central',
          }
        },
      ]
    }
  },
  {
    browser: 'Chromium',
    ordering: 2,
    bits: 32,
    os: 'win',
    label: 'Chromium',
    platform: "chromium32",
    seriesConfig: {
      and: [
        {eq: {platform: ['windows7-32-nightly', 'windows7-32-shippable']}},
        {
          eq: {

            framework: 10,
            repo: 'mozilla-central',
          }
        }
      ]
    }
  },
  {
    browser: 'Chromium',
    ordering: 2,
    bits: 64,
    os: 'win',
    label: 'Chromium',
    platform: "chromium64",
    seriesConfig: {
      and: [
        {eq: {platform: ['windows10-64-nightly', 'windows10-64-shippable']}},
        {
          eq: {

            framework: 10,
            repo: 'mozilla-central',
          }
        }]
    }
  },
  {
    browser: 'Firefox (aarch64)',
    ordering: 3,
    bits: 64,
    os: 'win',
    label: 'Firefox (aarch64)',
    platform: "win64-aarch",
    seriesConfig: {
      and: [
          {
            eq: {
              platform: 'windows10-aarch64',
              options: "opt"
            }
          },
        {
          eq: {
            framework: 10,
            repo: 'mozilla-central',
          }
        },
      ]
    }
  },
  {
    browser: 'geckoview',
    label: 'Geckoview p2 aarch64',
    platform: "android-p2-aarch64",
    seriesConfig: {
      eq: {
        framework: 10,
        platform: 'android-hw-p2-8-0-android-aarch64',
        repo: 'mozilla-central',
      }
    }
  },
  {
    browser: 'geckoview',
    label: 'Geckoview p2',
    platform: "android-p2",
    seriesConfig: {
      and: [
        {
          or: [
            {
              eq: {
                platform: 'android-hw-p2-8-0-arm7-api-16',
                options: ["pgo", "opt"]
              }
            },
            {
              eq: {
                platform: 'android-hw-p2-8-0-arm7-api-16-pgo',
              }
            },
          ]
        },
        {
          eq: {
            framework: 10,
            repo: 'mozilla-central',
          }
        },
      ]
    }
  },
  {
    browser: 'geckoview',
    label: 'Geckoview g5',
    platform: "android-g5",
    seriesConfig: {
      and: [
        {"prefix": {platform: 'android-hw-g5-7-0-arm7-api-16'}},
        {
          eq: {
            framework: 10,
            repo: 'mozilla-central',
          }
        },
      ]
    }
  },
];
const TP6_TESTS = [
  {
    id: 'fnbpaint',
    label: 'First non-blank paint',
  },
  {
    id: 'loadtime',
    label: 'Load time',
    default: true,
  },
  {
    id: 'fcp',
    label: 'First contentful paint',
  },
  {
    id: 'dcf',
    label: 'DOM content flushed',
  },
  {
    id: 'ttfi',
    label: 'Time to first interactive',
  },
];
const SUITES = {
  header: ['browser', 'title', 'suite'],

  data: [
    ['Firefox', 'Tp6: Facebook', 'raptor-tp6-facebook-firefox'],
    ['Firefox', 'Tp6: Amazon', 'raptor-tp6-amazon-firefox'],
    ['Firefox', 'Tp6: YouTube', 'raptor-tp6-youtube-firefox'],
    ['Firefox', 'Tp6: Google', 'raptor-tp6-google-firefox'],
    ['Firefox', 'Tp6: Imdb', 'raptor-tp6-imdb-firefox'],
    // ['Firefox', 'Tp6: Imgur', 'raptor-tp6-imgur-firefox'],
    ['Firefox', 'Tp6: Wikia', 'raptor-tp6-wikia-firefox'],
    ['Firefox', 'Tp6: Bing', 'raptor-tp6-bing-firefox'],
    ['Firefox', 'Tp6: Yandex', 'raptor-tp6-yandex-firefox'],
    ['Firefox', 'Tp6: Apple', 'raptor-tp6-apple-firefox'],
    // ['Firefox', 'Tp6: Microsoft', 'raptor-tp6-microsoft-firefox'],
    ['Firefox', 'Tp6: Reddit', 'raptor-tp6-reddit-firefox'],

    ['Firefox (aarch64)', 'Tp6: Facebook', 'raptor-tp6-facebook-firefox'],
    ['Firefox (aarch64)', 'Tp6: Amazon', 'raptor-tp6-amazon-firefox'],
    ['Firefox (aarch64)', 'Tp6: YouTube', 'raptor-tp6-youtube-firefox'],
    ['Firefox (aarch64)', 'Tp6: Google', 'raptor-tp6-google-firefox'],
    ['Firefox (aarch64)', 'Tp6: Imdb', 'raptor-tp6-imdb-firefox'],
    // ['Firefox (aarch64)', 'Tp6: Imgur', 'raptor-tp6-imgur-firefox'],
    ['Firefox (aarch64)', 'Tp6: Wikia', 'raptor-tp6-wikia-firefox'],
    ['Firefox (aarch64)', 'Tp6: Bing', 'raptor-tp6-bing-firefox'],
    ['Firefox (aarch64)', 'Tp6: Yandex', 'raptor-tp6-yandex-firefox'],
    ['Firefox (aarch64)', 'Tp6: Apple', 'raptor-tp6-apple-firefox'],
    // ['Firefox (aarch64)', 'Tp6: Microsoft', 'raptor-tp6-microsoft-firefox'],
    ['Firefox (aarch64)', 'Tp6: Reddit', 'raptor-tp6-reddit-firefox'],

    ['Chromium', 'Tp6: Facebook', 'raptor-tp6-facebook-chrome'],
    ['Chromium', 'Tp6: Amazon', 'raptor-tp6-amazon-chrome'],
    ['Chromium', 'Tp6: Google', 'raptor-tp6-google-chrome'],
    ['Chromium', 'Tp6: YouTube', 'raptor-tp6-youtube-chrome'],
    ['Chromium', 'Tp6: Imdb', 'raptor-tp6-imdb-chrome'],
    // ['Chromium', 'Tp6: Imgur', 'raptor-tp6-imgur-chrome'],
    ['Chromium', 'Tp6: Wikia', 'raptor-tp6-wikia-chrome'],
    ['Chromium', 'Tp6: Bing', 'raptor-tp6-bing-chrome'],
    ['Chromium', 'Tp6: Yandex', 'raptor-tp6-yandex-chrome'],
    ['Chromium', 'Tp6: Apple', 'raptor-tp6-apple-chrome'],
    // ['Chromium', 'Tp6: Microsoft', 'raptor-tp6-microsoft-chrome'],
    ['Chromium', 'Tp6: Reddit', 'raptor-tp6-reddit-chrome'],


    ['geckoview', 'Tp6 mobile: Amazon', 'raptor-tp6m-amazon-geckoview'],
    ['geckoview', 'Tp6 mobile: Amazon Search', "raptor-tp6m-amazon-search-geckoview"],
    ['geckoview', 'Tp6 mobile: All Recipes', "raptor-tp6m-allrecipes-geckoview"],
    ['geckoview', 'Tp6 mobile: Bing', "raptor-tp6m-bing-geckoview"],
    ['geckoview', 'Tp6 mobile: Bing Restaurants', "raptor-tp6m-bing-restaurants-geckoview"],
    ['geckoview', 'Tp6 mobile: Booking', "raptor-tp6m-booking-geckoview"],
    // ['geckoview', 'Tp6 mobile: CNN', "raptor-tp6m-cnn-geckoview"],
    // ['geckoview', 'Tp6 mobile: CNN AmpStories', "raptor-tp6m-cnn-ampstories-geckoview"],
    ['geckoview', 'Tp6 mobile: Kleinanzeigen', "raptor-tp6m-ebay-kleinanzeigen-geckoview"],
    ['geckoview', 'Tp6 mobile: Kleinanzeigen Search', "raptor-tp6m-ebay-kleinanzeigen-search-geckoview"],
    ['geckoview', 'Tp6 mobile: ESPN', "raptor-tp6m-espn-geckoview"],
    ['geckoview', 'Tp6 mobile: Facebook', 'raptor-tp6m-facebook-geckoview'],
    ['geckoview', 'Tp6 mobile: Google', 'raptor-tp6m-google-geckoview'],
    ['geckoview', 'Tp6 mobile: Google Maps', "raptor-tp6m-google-maps-geckoview"],
    ['geckoview', 'Tp6 mobile: Instagram', "raptor-tp6m-instagram-geckoview"],
    ['geckoview', 'Tp6 mobile: Imdb', "raptor-tp6m-imdb-geckoview"],
    ['geckoview', 'Tp6 mobile: Jianshu', "raptor-tp6m-jianshu-geckoview"],
    ['geckoview', 'Tp6 mobile: Reddit', "raptor-tp6m-reddit-geckoview"],
    ['geckoview', 'Tp6 mobile: Stackoverflow', "raptor-tp6m-stackoverflow-geckoview"],
    ['geckoview', 'Tp6 mobile: Web de', "raptor-tp6m-web-de-geckoview"],
    ['geckoview', 'Tp6 mobile: Wikipedia', "raptor-tp6m-wikipedia-geckoview"],
    ['geckoview', 'Tp6 mobile: YouTube', 'raptor-tp6m-youtube-geckoview'],
    ['geckoview', 'Tp6 mobile: YouTube Watch', "raptor-tp6m-youtube-watch-geckoview"],

  ],
};
// ALL PAGE COMBINATIONS
const temp = selectFrom(SUITES.data)
  .map(row => Data.zip(SUITES.header, row))
  .toArray();

Log.note("tesmp");

const TP6_PAGES = selectFrom(temp).leftJoin('browser', PLATFORMS, 'browser')
  .map(row => {
    row.seriesConfig = {"and": [{"eq": {suite: row.suite}}, row.seriesConfig]};
    return row;
  })
  .toArray();
const TP6M_PAGES = selectFrom(TP6_PAGES).where({browser: 'geckoview'});

export { CONFIG, PLATFORMS, TP6_PAGES, TP6M_PAGES, TP6_TESTS };
