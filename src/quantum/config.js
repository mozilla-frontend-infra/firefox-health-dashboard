/* eslint-disable */
import { selectFrom } from '../vendor/vectors';
import { Data } from '../vendor/datas';
import { first } from '../vendor/utils';

const CONFIG = {
  windows64Regression: [
    {
      title: 'MotionMark HTML suite',
      secondLink:
        '/quantum/10/windows10-64/raptor-motionmark-htmlsuite-firefox/pgo',
      signatures: {
        'windows10-64': '8f014459793e2e94c3244d5edeaada0452b0c627',
      },
      repo: 'mozilla-central',
      framework: 10,
    },
    {
      title: 'MotionMark Animometer',
      secondLink:
        '/quantum/10/windows10-64/raptor-motionmark-animometer-firefox/pgo',
      signatures: {
        'windows10-64': '9ad671fb568a5b3027af35b5d42fc6dd385f25ed',
      },
      repo: 'mozilla-central',
      framework: 10,
    },
  ],
  windows32Regression: [
    {
      title: 'MotionMark HTML suite',
      secondLink:
        '/quantum/10/windows7-32/raptor-motionmark_htmlsuite-firefox/pgo',
      signatures: { 'windows7-32': 'd1984855d038409797bbc8ad82c32489eb04cc23' },
      repo: 'mozilla-central',
      framework: 10,
    },
    {
      title: 'MotionMark Animometer',
      secondLink:
        '/quantum/10/windows7-32/raptor-motionmark_animometer-firefox/pgo',
      signatures: { 'windows7-32': '3d5a0a5e3c37f74770bdcb75bd46347be228495f' },
      repo: 'mozilla-central',
      framework: 10,
    },
  ],
};
const PLATFORMS = [
  {
    browser: 'Firefox',
    bits: 32,
    os: 'win',
    label: 'Firefox (win32)',
    platform: 'win32',
    platformFilter: {
      and: [
        {or: [
            {eq: {
                platform: 'windows7-32',
                options: 'pgo',
              }},
            {eq: {
                platform: 'windows7-32-shippable',
                options: 'opt',
              }},
          ]},
        {eq: {
            framework: 10,
            repo: 'mozilla-central',
          }},
      ],
    },
  },
  {
    browser: 'Firefox',
    bits: 64,
    os: 'win',
    label: 'Firefox (win64)',
    platform: 'win64',
    platformFilter: {and: [
        {or: [
          { eq: { platform: 'windows10-64', options: 'pgo' } },
          { eq: { platform: 'windows10-64-shippable', options: 'opt' } },
        ]},
        { eq: { framework: 10, repo: 'mozilla-central' } },
      ]},
  },
  {
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
        {
          eq: {
            framework: 10,
            repo: 'mozilla-central',
          },
        },
      ],
    },
  },
  {
    browser: 'Firefox',
    bits: 64,
    os: 'linux',
    label: 'Firefox (linux64)',
    platform: 'linux64',
    platformFilter: {and: [
        {or: [
            { eq: { platform: 'linux64-shippable', options: 'opt' } },
          ]},
        { eq: { framework: 10, repo: 'mozilla-central' } },
      ]},
  },
  {
    browser: 'Chromium',
    bits: 32,
    os: 'win',
    label: 'Chromium (win32)',
    platform: 'win32',
    platformFilter: {
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
    bits: 64,
    os: 'win',
    label: 'Chromium (win64)',
    platform: 'win64',
    platformFilter: {and: [
      {eq: {platform: ['windows10-64-nightly', 'windows10-64-shippable']}},
      {eq: {
          framework: 10,
          repo: 'mozilla-central',
      }}
    ]}
  },
  {
    browser: 'Chromium',
    bits: 64,
    os: 'linux',
    label: 'Chromium (linux64)',
    platform: 'linux64',
    platformFilter: {and: [
      {eq: {platform: 'linux64-shippable', options: 'opt'}},
      {eq: {
          framework: 10,
          repo: 'mozilla-central',
      }}
    ]}
  },
  {
    browser: 'geckoview',
    label: 'Geckoview p2',
    platform: 'geckoview-p2',
    platformFilter: {and: [
      {or: [
        {eq: {
          platform: 'android-hw-p2-8-0-arm7-api-16',
          options: ['pgo', 'opt'],
        }},
        {eq: {
          platform: 'android-hw-p2-8-0-arm7-api-16-pgo',
        }}
      ]},
      {eq: {
        framework: 10,
        repo: 'mozilla-central',
      }},
    ]},
  },
  {
    browser: 'geckoview',
    label: 'Geckoview g5',
    platform: 'geckoview-g5',
    platformFilter: {
      and: [
        { prefix: { platform: 'android-hw-g5-7-0-arm7-api-16' } },
        {eq: {
            framework: 10,
            repo: 'mozilla-central',
          }},
      ],
    },
  },
  {
    browser: 'geckoview',
    label: 'Geckoview p2 aarch64',
    platform: 'geckoview-p2-aarch64',
    platformFilter: {eq: {
        framework: 10,
        platform: 'android-hw-p2-8-0-android-aarch64',
        repo: 'mozilla-central',
    }},
  },
  {
    browser: 'fenix',
    label: 'Firefox Preview g5',
    platform: 'fenix-g5',
    platformFilter: {
      and: [
        { prefix: { platform: 'android-hw-g5-7-0-arm7-api-16' } },
        {eq: {
          framework: 10,
          repo: 'fenix',
        }},
      ],
    },
  },
  {
    browser: 'fenix',
    label: 'Firefox Preview p2 (aarch64)',
    platform: 'fenix-p2-aarch64',
    platformFilter: {and: [
        {or: [
          {eq: {
            platform: 'android-hw-p2-8-0-aarch64'
          }},
          {eq: {
            platform: 'android-hw-p2-8-0-android-aarch64'
          }},
        ]},
        {eq: {
          framework: 10,
          repo: 'fenix',
        }},
      ]},
  },
];
PLATFORMS.forEach((p, i)=>{p.ordering=i});

const TP6_TESTS_DATA = [
  {
    test: 'cold-fnbpaint',
    testFilter: {eq: {test: 'fnbpaint'}},
    mode: 'cold',
    label: 'Cold first non-blank paint',
  },
  {
    test: 'cold-loadtime',
    testFilter: {eq: {test: 'loadtime'}},
    mode: 'cold',
    label: 'Cold load time',
    default: true,
  },
  {
    test: 'cold-fcp',
    testFilter: {eq: {test: 'fcp'}},
    mode: 'cold',
    label: 'Cold first contentful paint',
  },
  {
    test: 'cold-dcf',
    testFilter: {eq: {test: 'dcf'}},
    mode: 'cold',
    label: 'Cold DOM content flushed',
  },
  {
    test: 'cold-ttfi',
    testFilter: {eq: {test: 'ttfi'}},
    mode: 'cold',
    label: 'Cold time to first interactive',
  },
  {
    test: 'warm-fnbpaint',
    testFilter: {eq: {test: 'fnbpaint'}},
    mode: 'warm',
    label: 'Warm first non-blank paint',
  },
  {
    test: 'warm-loadtime',
    testFilter: {eq: {test: 'loadtime'}},
    mode: 'warm',
    label: 'Warm load time',
  },
  {
    test: 'warm-fcp',
    testFilter: {eq: {test: 'fcp'}},
    mode: 'warm',
    label: 'Warm first contentful paint',
  },
  {
    test: 'warm-dcf',
    testFilter: {eq: {test: 'dcf'}},
    mode: 'warm',
    label: 'Warm DOM content flushed',
  },
  {
    test: 'warm-ttfi',
    testFilter: {eq: {test: 'ttfi'}},
    mode: 'warm',
    label: 'Warm time to first interactive',
  },
];


const TP6_SITES_DATA = {
  header: ['browser', 'mode', 'site', 'siteFilter'],

  data: [
    ['Firefox', 'warm', 'Tp6: Facebook', {eq: {suite: 'raptor-tp6-facebook-firefox'}}],
    ['Firefox', 'warm', 'Tp6: Amazon', {eq: {suite: 'raptor-tp6-amazon-firefox'}}],
    ['Firefox', 'warm', 'Tp6: YouTube', {eq: {suite: 'raptor-tp6-youtube-firefox'}}],
    ['Firefox', 'warm', 'Tp6: Google', {eq: {suite: 'raptor-tp6-google-firefox'}}],
    ['Firefox', 'warm', 'Tp6: Imdb', {eq: {suite: 'raptor-tp6-imdb-firefox'}}],
    ['Firefox', 'warm', 'Tp6: Imgur', {eq: {suite: 'raptor-tp6-imgur-firefox'}}],
    ['Firefox', 'warm', 'Tp6: Netflix', {eq: {suite: 'raptor-tp6-netflix-firefox'}}],
    ['Firefox', 'warm', 'Tp6: Fandom', {eq: {suite: 'raptor-tp6-fandom-firefox'}}],
    ['Firefox', 'warm', 'Tp6: Bing', {eq: {suite: 'raptor-tp6-bing-firefox'}}],
    ['Firefox', 'warm', 'Tp6: Yandex', {eq: {suite: 'raptor-tp6-yandex-firefox'}}],
    ['Firefox', 'warm', 'Tp6: Apple', {eq: {suite: 'raptor-tp6-apple-firefox'}}],
    ['Firefox', 'warm', 'Tp6: Microsoft', {eq: {suite: 'raptor-tp6-microsoft-firefox'}}],
    ['Firefox', 'warm', 'Tp6: Office', {eq:{suite:'raptor-tp6-office-firefox'} }],
    ['Firefox', 'warm', 'Tp6: Reddit', {eq: {suite: 'raptor-tp6-reddit-firefox'}}],
    ['Firefox', 'warm', 'Tp6: eBay', {eq: {suite: 'raptor-tp6-ebay-firefox'}}],
    ['Firefox', 'warm', 'Tp6: Instagram', {eq: {suite: 'raptor-tp6-instagram-firefox'}}],
    ['Firefox', 'warm', 'Tp6: PayPal', {eq: {suite: 'raptor-tp6-paypal-firefox'}}],
    ['Firefox', 'warm', 'Tp6: Pinterest', {eq: {suite: 'raptor-tp6-pinterest-firefox'}}],
    ['Firefox', 'warm', 'Tp6: Instagram (binast)', {eq:{suite:'raptor-tp6-binast-instagram-firefox'} }],
    ['Firefox', 'warm', 'Tp6: Docs', {eq:{suite:'raptor-tp6-docs-firefox'} }],
    ['Firefox', 'warm', 'Tp6: Google Mail', {eq:{suite:'raptor-tp6-google-mail-firefox'} }],
    ['Firefox', 'warm', 'Tp6: LinkedIn', {eq:{suite:'raptor-tp6-linkedin-firefox'} }],
    ['Firefox', 'warm', 'Tp6: Outlook', {eq:{suite:'raptor-tp6-outlook-firefox'} }],
    ['Firefox', 'warm', 'Tp6: Sheets', {eq:{suite:'raptor-tp6-sheets-firefox'} }],
    ['Firefox', 'warm', 'Tp6: Slides', {eq:{suite:'raptor-tp6-slides-firefox'} }],
    ['Firefox', 'warm', 'Tp6: Tumblr', {eq:{suite:'raptor-tp6-tumblr-firefox'} }],
    ['Firefox', 'warm', 'Tp6: Twitter', {eq:{suite:'raptor-tp6-twitter-firefox'} }],
    ['Firefox', 'warm', 'Tp6: Twitch', {eq: {suite: 'raptor-tp6-twitch-firefox'}}],
    ['Firefox', 'warm', 'Tp6: Wikipedia', {eq:{suite:'raptor-tp6-wikipedia-firefox'} }],
    ['Firefox', 'warm', 'Tp6: Yahoo Mail', {eq:{suite:'raptor-tp6-yahoo-mail-firefox'} }],
    ['Firefox', 'warm', 'Tp6: Yahoo News', {eq:{suite:'raptor-tp6-yahoo-news-firefox'} }],

    ['Firefox', 'cold', 'Tp6: Facebook', {eq: {suite: 'raptor-tp6-facebook-firefox-cold'}}],
    ['Firefox', 'cold', 'Tp6: Amazon', {eq: {suite: 'raptor-tp6-amazon-firefox-cold'}}],
    ['Firefox', 'cold', 'Tp6: YouTube', {eq: {suite: 'raptor-tp6-youtube-firefox-cold'}}],
    ['Firefox', 'cold', 'Tp6: Google', {eq: {suite: 'raptor-tp6-google-firefox-cold'}}],

    ['Chromium', 'warm', 'Tp6: Facebook', {or: [{and: [{lt: {push_timestamp: {date: '2019-09-01'}}}, {eq: {suite: 'raptor-tp6-facebook-chrome'}}]}, {eq: {suite: 'raptor-tp6-facebook-chromium'}}]}],
    ['Chromium', 'warm', 'Tp6: Amazon', {or: [{and: [{lt: {push_timestamp: {date: '2019-09-01'}}}, {eq: {suite: 'raptor-tp6-amazon-chrome'}}]}, {eq: {suite: 'raptor-tp6-amazon-chromium'}}]}],
    ['Chromium', 'warm', 'Tp6: Google', {or: [{and: [{lt: {push_timestamp: {date: '2019-09-01'}}}, {eq: {suite: 'raptor-tp6-google-chrome'}}]}, {eq: {suite: 'raptor-tp6-google-chromium'}}]}],
    ['Chromium', 'warm', 'Tp6: YouTube', {or: [{and: [{lt: {push_timestamp: {date: '2019-09-01'}}}, {eq: {suite: 'raptor-tp6-youtube-chrome'}}]}, {eq: {suite: 'raptor-tp6-youtube-chromium'}}]}],
    ['Chromium', 'warm', 'Tp6: Imdb', {or: [{and: [{lt: {push_timestamp: {date: '2019-09-01'}}}, {eq: {suite: 'raptor-tp6-imdb-chrome'}}]}, {eq: {suite: 'raptor-tp6-imdb-chromium'}}]}],
    ['Chromium', 'warm', 'Tp6: Imgur', {or: [{and: [{lt: {push_timestamp: {date: '2019-09-01'}}}, {eq: {suite: 'raptor-tp6-imgur-chrome'}}]}, {eq: {suite: 'raptor-tp6-imgur-chromium'}}]}],
    ['Chromium', 'warm', 'Tp6: Netflix', {or: [{and: [{lt: {push_timestamp: {date: '2019-09-01'}}}, {eq: {suite: 'raptor-tp6-netflix-chrome'}}]}, {eq: {suite: 'raptor-tp6-netflix-chromium'}}]}],
    ['Chromium', 'warm', 'Tp6: Fandom', {or: [{and: [{lt: {push_timestamp: {date: '2019-09-01'}}}, {eq: {suite: 'raptor-tp6-fandom-chrome'}}]}, {eq: {suite: 'raptor-tp6-fandom-chromium'}}]}],
    ['Chromium', 'warm', 'Tp6: Bing', {or: [{and: [{lt: {push_timestamp: {date: '2019-09-01'}}}, {eq: {suite: 'raptor-tp6-bing-chrome'}}]}, {eq: {suite: 'raptor-tp6-bing-chromium'}}]}],
    ['Chromium', 'warm', 'Tp6: Yandex', {or: [{and: [{lt: {push_timestamp: {date: '2019-09-01'}}}, {eq: {suite: 'raptor-tp6-yandex-chrome'}}]}, {eq: {suite: 'raptor-tp6-yandex-chromium'}}]}],
    ['Chromium', 'warm', 'Tp6: Apple', {or: [{and: [{lt: {push_timestamp: {date: '2019-09-01'}}}, {eq: {suite: 'raptor-tp6-apple-chrome'}}]}, {eq: {suite: 'raptor-tp6-apple-chromium'}}]}],
    ['Chromium', 'warm', 'Tp6: Microsoft', {or: [{and: [{lt: {push_timestamp: {date: '2019-09-01'}}}, {eq: {suite: 'raptor-tp6-microsoft-chrome'}}]}, {eq: {suite: 'raptor-tp6-microsoft-chromium'}}]}],
    ['Chromium', 'warm', 'Tp6: Office', {eq: {suite: 'raptor-tp6-office-chromium'}}],
    ['Chromium', 'warm', 'Tp6: Reddit', {or: [{and: [{lt: {push_timestamp: {date: '2019-09-01'}}}, {eq: {suite: 'raptor-tp6-reddit-chrome'}}]}, {eq: {suite: 'raptor-tp6-reddit-chromium'}}]}],
    ['Chromium', 'warm', 'Tp6: Docs', {or: [{and: [{lt: {push_timestamp: {date: '2019-09-01'}}}, {eq: {suite: 'raptor-tp6-docs-chrome'}}]}, {eq: {suite: 'raptor-tp6-docs-chromium'}}]}],
    ['Chromium', 'warm', 'Tp6: eBay', {or: [{and: [{lt: {push_timestamp: {date: '2019-09-01'}}}, {eq: {suite: 'raptor-tp6-ebay-chrome'}}]}, {eq: {suite: 'raptor-tp6-ebay-chromium'}}]}],
    ['Chromium', 'warm', 'Tp6: Google Mail', {or: [{and: [{lt: {push_timestamp: {date: '2019-09-01'}}}, {eq: {suite: 'raptor-tp6-google-mail-chrome'}}]}, {eq: {suite: 'raptor-tp6-google-mail-chromium'}}]}],
    ['Chromium', 'warm', 'Tp6: Instagram', {or: [{and: [{lt: {push_timestamp: {date: '2019-09-01'}}}, {eq: {suite: 'raptor-tp6-instagram-chrome'}}]}, {eq: {suite: 'raptor-tp6-instagram-chromium'}}]}],
    ['Chromium', 'warm', 'Tp6: PayPal', {and: [{lt: {push_timestamp: {date: '2019-09-01'}}}, {eq: {suite: 'raptor-tp6-paypal-chrome'}}]}],
    ['Chromium', 'warm', 'Tp6: Pinterest', {or: [{and: [{lt: {push_timestamp: {date: '2019-09-01'}}}, {eq: {suite: 'raptor-tp6-pinterest-chrome'}}]}, {eq: {suite: 'raptor-tp6-pinterest-chromium'}}]}],
    ['Chromium', 'warm', 'Tp6: Sheets', {or: [{and: [{lt: {push_timestamp: {date: '2019-09-01'}}}, {eq: {suite: 'raptor-tp6-sheets-chrome'}}]}, {eq: {suite: 'raptor-tp6-sheets-chromium'}}]}],
    ['Chromium', 'warm', 'Tp6: Slides', {or: [{and: [{lt: {push_timestamp: {date: '2019-09-01'}}}, {eq: {suite: 'raptor-tp6-slides-chrome'}}]}, {eq: {suite: 'raptor-tp6-slides-chromium'}}]}],
    ['Chromium', 'warm', 'Tp6: Tumblr', {or: [{and: [{lt: {push_timestamp: {date: '2019-09-01'}}}, {eq: {suite: 'raptor-tp6-tumblr-chrome'}}]}, {eq: {suite: 'raptor-tp6-tumblr-chromium'}}]}],
    ['Chromium', 'warm', 'Tp6: Twitter', {or: [{and: [{lt: {push_timestamp: {date: '2019-09-01'}}}, {eq: {suite: 'raptor-tp6-twitter-chrome'}}]}, {eq: {suite: 'raptor-tp6-twitter-chromium'}}]}],
    ['Chromium', 'warm', 'Tp6: Twitch', {or: [{and: [{lt: {push_timestamp: {date: '2019-09-01'}}}, {eq: {suite: 'raptor-tp6-twitch-chrome'}}]}, {eq: {suite: 'raptor-tp6-twitch-chromium'}}]}],
    ['Chromium', 'warm', 'Tp6: Wikipedia', {or: [{and: [{lt: {push_timestamp: {date: '2019-09-01'}}}, {eq: {suite: 'raptor-tp6-wikipedia-chrome'}}]}, {eq: {suite: 'raptor-tp6-wikipedia-chromium'}}]}],
    ['Chromium', 'warm', 'Tp6: Yahoo Mail', {or: [{and: [{lt: {push_timestamp: {date: '2019-09-01'}}}, {eq: {suite: 'raptor-tp6-yahoo-mail-chrome'}}]}, {eq: {suite: 'raptor-tp6-yahoo-mail-chromium'}}]}],
    ['Chromium', 'warm', 'Tp6: Yahoo News', {or: [{and: [{lt: {push_timestamp: {date: '2019-09-01'}}}, {eq: {suite: 'raptor-tp6-yahoo-news-chrome'}}]}, {eq: {suite: 'raptor-tp6-yahoo-news-chromium'}}]}],

    ['Chromium', 'cold', 'Tp6: Facebook', {eq: {suite: 'raptor-tp6-facebook-chromium-cold'}}],
    ['Chromium', 'cold', 'Tp6: Amazon', {eq: {suite: 'raptor-tp6-amazon-chromium-cold'}}],
    ['Chromium', 'cold', 'Tp6: Google', {eq: {suite: 'raptor-tp6-google-chromium-cold'}}],
    ['Chromium', 'cold', 'Tp6: YouTube', {eq: {suite: 'raptor-tp6-youtube-chromium-cold'}}],


    ['geckoview',         'cold', 'Tp6 mobile: Amazon',               { eq: { suite: ['raptor-tp6m-cold-amazon-geckoview', 'raptor-tp6m-amazon-geckoview-cold']}}],
    ['geckoview',         'cold', 'Tp6 mobile: Amazon Search',        { eq: { suite: ['raptor-tp6m-cold-amazon-search-geckoview', 'raptor-tp6m-amazon-search-geckoview-cold']}}],
    ['geckoview',         'cold', 'Tp6 mobile: Aframe.io',            { eq: { suite: ['raptor-tp6m-cold-aframeio-animation-geckoview', 'raptor-tp6m-aframeio-animation-geckoview-cold']}}],
    ['geckoview',         'cold', 'Tp6 mobile: All Recipes',          { eq: { suite: ['raptor-tp6m-cold-allrecipes-geckoview', 'raptor-tp6m-allrecipes-geckoview-cold']}}],
    ['geckoview',         'cold', 'Tp6 mobile: BBC',                  { eq: { suite: ['raptor-tp6m-cold-bbc-geckoview', 'raptor-tp6m-bbc-geckoview-cold']} }],
    ['geckoview',         'cold', 'Tp6 mobile: Bing',                 { eq: { suite: ['raptor-tp6m-cold-bing-geckoview', 'raptor-tp6m-bing-geckoview-cold']}}],
    ['geckoview',         'cold', 'Tp6 mobile: Bing Restaurants',     { eq: { suite: ['raptor-tp6m-cold-bing-restaurants-geckoview', 'raptor-tp6m-bing-restaurants-geckoview-cold']}}],
    ['geckoview',         'cold', 'Tp6 mobile: Booking',              { eq: { suite: ['raptor-tp6m-cold-booking-geckoview', 'raptor-tp6m-booking-geckoview-cold']}}],
    ['geckoview',         'cold', 'Tp6 mobile: CNN',                  { eq: { suite: ['raptor-tp6m-cold-cnn-geckoview', 'raptor-tp6m-cnn-geckoview-cold']}}],
    ['geckoview',         'cold', 'Tp6 mobile: CNN AmpStories',       { eq: { suite: ['raptor-tp6m-cold-cnn-ampstories-geckoview', 'raptor-tp6m-cnn-ampstories-geckoview-cold']}}],
    ['geckoview',         'cold', 'Tp6 mobile: Kleinanzeigen',        { eq: { suite: ['raptor-tp6m-cold-ebay-kleinanzeigen-geckoview', 'raptor-tp6m-ebay-kleinanzeigen-geckoview-cold']}}],
    ['geckoview',         'cold', 'Tp6 mobile: Kleinanzeigen Search', { eq: { suite: ['raptor-tp6m-cold-ebay-kleinanzeigen-search-geckoview', 'raptor-tp6m-ebay-kleinanzeigen-search-geckoview-cold']}}],
    ['geckoview',         'cold', 'Tp6 mobile: ESPN',                 { eq: { suite: ['raptor-tp6m-cold-espn-geckoview', 'raptor-tp6m-espn-geckoview-cold']}}],
    ['geckoview',         'cold', 'Tp6 mobile: Facebook',             { eq: { suite: ['raptor-tp6m-cold-facebook-geckoview', 'raptor-tp6m-facebook-geckoview-cold']}}],
    ['geckoview',         'cold', 'Tp6 mobile: Facebook Cristiano',   { eq: { suite: ['raptor-tp6m-cold-facebook-cristiano-geckoview', 'raptor-tp6m-facebook-cristiano-geckoview-cold']}}],
    ['geckoview',         'cold', 'Tp6 mobile: Google',               { eq: { suite: ['raptor-tp6m-cold-google-geckoview', 'raptor-tp6m-google-geckoview-cold']}}],
    ['geckoview',         'cold', 'Tp6 mobile: Google Maps',          { eq: { suite: ['raptor-tp6m-cold-google-maps-geckoview', 'raptor-tp6m-google-maps-geckoview-cold']}}],
    ['geckoview',         'cold', 'Tp6 mobile: Google Restaurants',   { eq: { suite: ['raptor-tp6m-cold-google-restaurants-geckoview', 'raptor-tp6m-google-restaurants-geckoview-cold']} }],
    ['geckoview',         'cold', 'Tp6 mobile: Instagram',            { eq: { suite: ['raptor-tp6m-cold-instagram-geckoview', 'raptor-tp6m-instagram-geckoview-cold']}}],
    ['geckoview',         'cold', 'Tp6 mobile: Imdb',                 { eq: { suite: ['raptor-tp6m-cold-imdb-geckoview', 'raptor-tp6m-imdb-geckoview-cold']}}],
    ['geckoview',         'cold', 'Tp6 mobile: Jianshu',              { eq: { suite: ['raptor-tp6m-cold-jianshu-geckoview', 'raptor-tp6m-jianshu-geckoview-cold']}}],
    ['geckoview',         'cold', 'Tp6 mobile: Microsoft Support',    { eq: { suite: ['raptor-tp6m-cold-microsoft-support-geckoview', 'raptor-tp6m-microsoft-support-geckoview-cold']} }],
    ['geckoview',         'cold', 'Tp6 mobile: Reddit',               { eq: { suite: ['raptor-tp6m-cold-reddit-geckoview', 'raptor-tp6m-reddit-geckoview-cold']}}],
    ['geckoview',         'cold', 'Tp6 mobile: Stackoverflow',        { eq: { suite: ['raptor-tp6m-cold-stackoverflow-geckoview', 'raptor-tp6m-stackoverflow-geckoview-cold']}}],
    ['geckoview',         'cold', 'Tp6 mobile: Web.de',               { eq: { suite: ['raptor-tp6m-cold-web-de-geckoview', 'raptor-tp6m-web-de-geckoview-cold']}}],
    ['geckoview',         'cold', 'Tp6 mobile: Wikipedia',            { eq: { suite: ['raptor-tp6m-cold-wikipedia-geckoview', 'raptor-tp6m-wikipedia-geckoview-cold']}}],
    ['geckoview',         'cold', 'Tp6 mobile: YouTube',              { eq: { suite: ['raptor-tp6m-cold-youtube-geckoview', 'raptor-tp6m-youtube-geckoview-cold']}}],
    ['geckoview',         'cold', 'Tp6 mobile: YouTube Watch',        { eq: { suite: ['raptor-tp6m-cold-youtube-watch-geckoview', 'raptor-tp6m-youtube-watch-geckoview-cold']}}],


    ['geckoview',         'warm', 'Tp6 mobile: Amazon',               { eq: { suite: 'raptor-tp6m-amazon-geckoview'}}],
    ['geckoview',         'warm', 'Tp6 mobile: Amazon Search',        { eq: { suite: 'raptor-tp6m-amazon-search-geckoview'}}],
    ['geckoview',         'warm', 'Tp6 mobile: Aframe.io',            { eq: { suite: 'raptor-tp6m-aframeio-animation-geckoview'}}],
    ['geckoview',         'warm', 'Tp6 mobile: All Recipes',          { eq: { suite: 'raptor-tp6m-allrecipes-geckoview'}}],
    ['geckoview',         'warm', 'Tp6 mobile: BBC',                  { eq: { suite: 'raptor-tp6m-bbc-geckoview'} }],
    ['geckoview',         'warm', 'Tp6 mobile: Bing',                 { eq: { suite: 'raptor-tp6m-bing-geckoview'}}],
    ['geckoview',         'warm', 'Tp6 mobile: Bing Restaurants',     { eq: { suite: 'raptor-tp6m-bing-restaurants-geckoview'}}],
    ['geckoview',         'warm', 'Tp6 mobile: Booking',              { eq: { suite: 'raptor-tp6m-booking-geckoview'}}],
    ['geckoview',         'warm', 'Tp6 mobile: CNN',                  { eq: { suite: 'raptor-tp6m-cnn-geckoview'}}],
    ['geckoview',         'warm', 'Tp6 mobile: CNN AmpStories',       { eq: { suite: 'raptor-tp6m-cnn-ampstories-geckoview'}}],
    ['geckoview',         'warm', 'Tp6 mobile: Kleinanzeigen',        { eq: { suite: 'raptor-tp6m-ebay-kleinanzeigen-geckoview'}}],
    ['geckoview',         'warm', 'Tp6 mobile: Kleinanzeigen Search', { eq: { suite: 'raptor-tp6m-ebay-kleinanzeigen-search-geckoview'}}],
    ['geckoview',         'warm', 'Tp6 mobile: ESPN',                 { eq: { suite: 'raptor-tp6m-espn-geckoview'}}],
    ['geckoview',         'warm', 'Tp6 mobile: Facebook',             { eq: { suite: 'raptor-tp6m-facebook-geckoview'}}],
    ['geckoview',         'warm', 'Tp6 mobile: Facebook Cristiano',   { eq: { suite: 'raptor-tp6m-facebook-cristiano-geckoview'}}],
    ['geckoview',         'warm', 'Tp6 mobile: Google',               { eq: { suite: 'raptor-tp6m-google-geckoview'}}],
    ['geckoview',         'warm', 'Tp6 mobile: Google Maps',          { eq: { suite: 'raptor-tp6m-google-maps-geckoview'}}],
    ['geckoview',         'warm', 'Tp6 mobile: Google Restaurants',   { eq: { suite: 'raptor-tp6m-google-restaurants-geckoview'} }],
    ['geckoview',         'warm', 'Tp6 mobile: Instagram',            { eq: { suite: 'raptor-tp6m-instagram-geckoview'}}],
    ['geckoview',         'warm', 'Tp6 mobile: Imdb',                 { eq: { suite: 'raptor-tp6m-imdb-geckoview'}}],
    ['geckoview',         'warm', 'Tp6 mobile: Jianshu',              { eq: { suite: 'raptor-tp6m-jianshu-geckoview'}}],
    ['geckoview',         'warm', 'Tp6 mobile: Microsoft Support',    { eq: { suite: 'raptor-tp6m-microsoft-support-geckoview'} }],
    ['geckoview',         'warm', 'Tp6 mobile: Reddit',               { eq: { suite: 'raptor-tp6m-reddit-geckoview'}}],
    ['geckoview',         'warm', 'Tp6 mobile: Stackoverflow',        { eq: { suite: 'raptor-tp6m-stackoverflow-geckoview'}}],
    ['geckoview',         'warm', 'Tp6 mobile: Web.de',               { eq: { suite: 'raptor-tp6m-web-de-geckoview'}}],
    ['geckoview',         'warm', 'Tp6 mobile: Wikipedia',            { eq: { suite: 'raptor-tp6m-wikipedia-geckoview'}}],
    ['geckoview',         'warm', 'Tp6 mobile: YouTube',              { eq: { suite: 'raptor-tp6m-youtube-geckoview'}}],
    ['geckoview',         'warm', 'Tp6 mobile: YouTube Watch',        { eq: { suite: 'raptor-tp6m-youtube-watch-geckoview'}}],

    ['fenix',         'cold', 'Tp6 mobile: Amazon',               { eq: { suite: ['raptor-tp6m-cold-amazon-fenix', 'raptor-tp6m-amazon-fenix-cold']}}],
    ['fenix',         'cold', 'Tp6 mobile: Amazon Search',        { eq: { suite: ['raptor-tp6m-cold-amazon-search-fenix', 'raptor-tp6m-amazon-search-fenix-cold']}}],
    ['fenix',         'cold', 'Tp6 mobile: Aframe.io',            { eq: { suite: ['raptor-tp6m-cold-aframeio-animation-fenix', 'raptor-tp6m-aframeio-animation-fenix-cold']}}],
    ['fenix',         'cold', 'Tp6 mobile: All Recipes',          { eq: { suite: ['raptor-tp6m-cold-allrecipes-fenix', 'raptor-tp6m-allrecipes-fenix-cold']}}],
    ['fenix',         'cold', 'Tp6 mobile: BBC',                  { eq: { suite: ['raptor-tp6m-cold-bbc-fenix-cold', 'raptor-tp6m-bbc-fenix-cold']} }],
    ['fenix',         'cold', 'Tp6 mobile: Bing',                 { eq: { suite: ['raptor-tp6m-cold-bing-fenix', 'raptor-tp6m-bing-fenix-cold']}}],
    ['fenix',         'cold', 'Tp6 mobile: Bing Restaurants',     { eq: { suite: ['raptor-tp6m-cold-bing-restaurants-fenix', 'raptor-tp6m-bing-restaurants-fenix-cold']}}],
    ['fenix',         'cold', 'Tp6 mobile: Booking',              { eq: { suite: ['raptor-tp6m-cold-booking-fenix', 'raptor-tp6m-booking-fenix-cold']}}],
    ['fenix',         'cold', 'Tp6 mobile: CNN',                  { eq: { suite: ['raptor-tp6m-cold-cnn-fenix', 'raptor-tp6m-cnn-fenix-cold']}}],
    ['fenix',         'cold', 'Tp6 mobile: CNN AmpStories',       { eq: { suite: ['raptor-tp6m-cold-cnn-ampstories-fenix', 'raptor-tp6m-cnn-ampstories-fenix-cold']}}],
    ['fenix',         'cold', 'Tp6 mobile: Kleinanzeigen',        { eq: { suite: ['raptor-tp6m-cold-ebay-kleinanzeigen-fenix', 'raptor-tp6m-ebay-kleinanzeigen-fenix-cold']}}],
    ['fenix',         'cold', 'Tp6 mobile: Kleinanzeigen Search', { eq: { suite: ['raptor-tp6m-cold-ebay-kleinanzeigen-search-fenix', 'raptor-tp6m-ebay-kleinanzeigen-search-fenix-cold']}}],
    ['fenix',         'cold', 'Tp6 mobile: ESPN',                 { eq: { suite: ['raptor-tp6m-cold-espn-fenix', 'raptor-tp6m-espn-fenix-cold']}}],
    ['fenix',         'cold', 'Tp6 mobile: Facebook',             { eq: { suite: ['raptor-tp6m-cold-facebook-fenix', 'raptor-tp6m-facebook-fenix-cold']}}],
    ['fenix',         'cold', 'Tp6 mobile: Facebook Cristiano',   { eq: { suite: ['raptor-tp6m-cold-facebook-cristiano-fenix', 'raptor-tp6m-facebook-cristiano-fenix-cold']}}],
    ['fenix',         'cold', 'Tp6 mobile: Google',               { eq: { suite: ['raptor-tp6m-cold-google-fenix', 'raptor-tp6m-google-fenix-cold']}}],
    ['fenix',         'cold', 'Tp6 mobile: Google Maps',          { eq: { suite: ['raptor-tp6m-cold-google-maps-fenix', 'raptor-tp6m-google-maps-fenix-cold']}}],
    ['fenix',         'cold', 'Tp6 mobile: Instagram',            { eq: { suite: ['raptor-tp6m-cold-instagram-fenix', 'raptor-tp6m-instagram-fenix-cold']}}],
    ['fenix',         'cold', 'Tp6 mobile: Imdb',                 { eq: { suite: ['raptor-tp6m-cold-imdb-fenix', 'raptor-tp6m-imdb-fenix-cold']}}],
    ['fenix',         'cold', 'Tp6 mobile: Jianshu',              { eq: { suite: ['raptor-tp6m-cold-jianshu-fenix', 'raptor-tp6m-jianshu-fenix-cold']}}],
    ['fenix',         'cold', 'Tp6 mobile: Microsoft Support',    { eq: { suite: ['raptor-tp6m-cold-microsoft-support-fenix', 'raptor-tp6m-microsoft-support-fenix-cold']} }],
    ['fenix',         'cold', 'Tp6 mobile: Reddit',               { eq: { suite: ['raptor-tp6m-cold-reddit-fenix', 'raptor-tp6m-reddit-fenix-cold']}}],
    ['fenix',         'cold', 'Tp6 mobile: Stackoverflow',        { eq: { suite: ['raptor-tp6m-cold-stackoverflow-fenix', 'raptor-tp6m-stackoverflow-fenix-cold']}}],
    ['fenix',         'cold', 'Tp6 mobile: Web.de',               { eq: { suite: ['raptor-tp6m-cold-web-de-fenix', 'raptor-tp6m-web-de-fenix-cold']}}],
    ['fenix',         'cold', 'Tp6 mobile: Wikipedia',            { eq: { suite: ['raptor-tp6m-cold-wikipedia-fenix', 'raptor-tp6m-wikipedia-fenix-cold']}}],
    ['fenix',         'cold', 'Tp6 mobile: YouTube',              { eq: { suite: ['raptor-tp6m-cold-youtube-fenix', 'raptor-tp6m-youtube-fenix-cold']}}],
    ['fenix',         'cold', 'Tp6 mobile: YouTube Watch',        { eq: { suite: ['raptor-tp6m-cold-youtube-watch-fenix', 'raptor-tp6m-youtube-watch-fenix-cold']}}],
  ],
};

// Ensure "site" covers both cold and warm tests
const TP6M_SITES = selectFrom(TP6_SITES_DATA.data)
  .map(row => Data.zip(TP6_SITES_DATA.header, row))
  .where({browser: ['geckoview', 'fenix']})
  .groupBy("site")
  .map((ss, site)=>{
    return {
      site,
      mode: selectFrom(ss).select("mode").union().toArray(),
      siteFilter: {or: selectFrom(ss).select("siteFilter")}
    }
  })
  .materialize();

// Ensure "test" covers all suites for given mode
const TP6_TESTS = selectFrom(TP6_SITES_DATA.data)
  .map(row => Data.zip(TP6_SITES_DATA.header, row))
  .leftJoin('mode', TP6_TESTS_DATA, 'mode')
  .groupBy('test')
  .map((combos, test) => {
    return {
      test,
      label: first(combos).label,
      mode: first(combos).mode,
      testFilter: {
        and: [
          first(combos).testFilter,
          {or: selectFrom(combos).select('siteFilter').toArray()},
        ],
      },
    };
  })
  .materialize();


// ALL PAGE COMBINATIONS
const TP6_COMBOS = selectFrom(TP6_SITES_DATA.data)
  .map(row => Data.zip(TP6_SITES_DATA.header, row))
  .sort("site")
  .leftJoin('browser', PLATFORMS, 'browser')
  .leftJoin('mode', TP6_TESTS_DATA, 'mode')
  .map(row => {
    row.filter = {
      and: [row.siteFilter, row.testFilter, row.platformFilter],
    };

    return row;
  })
  .materialize();


export { CONFIG, TP6_COMBOS, TP6M_SITES, PLATFORMS, TP6_TESTS };
