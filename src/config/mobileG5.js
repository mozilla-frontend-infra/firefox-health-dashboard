/* eslint-disable */

import { Data } from "../vendor/Data";
import { selectFrom } from "../vendor/vectors";
import { first, missing } from "../vendor/utils";
import { round } from "../vendor/math";
import { Log } from "../vendor/logs";
import { window } from "../vendor/jx/cubes";
import { PLATFORMS, TP6_TESTS } from "../quantum/config";

const TARGET_NAME = "Fennec64 -20%";

// COLD https://docs.google.com/spreadsheets/d/1xuYdCodmiFY-NmAXq_8WTcO_WMfsZVNNeiGCr-w2xAY/edit#gid=265906020
// WARM https://docs.google.com/spreadsheets/d/1xuYdCodmiFY-NmAXq_8WTcO_WMfsZVNNeiGCr-w2xAY/edit#gid=476650517
const fennec64onG5 =
  {
    "header": [
      "cold-geomean", "cold-dcf", "cold-fnbpaint",  "cold-loadtime", "cold-loadtime-stdev",
      "warm-geomean", "warm-loadtime", "warm-fcp", "warm-fnbpaint", "warm-dcf", "site", "url"
    ],


    "data": [
      [ 1285.57,  1044.5,            1214  ,          1675.5,  141.11,   821.43, 1011.5 ,    null,  885.5 ,  675  , 'Tp6 mobile: Amazon',              "https://www.amazon.com"],
      [ 2061.64,  1688.5,            1735  ,          2991  ,   50.71,  1278.02, 2103.5 ,    null, 1093   , 1061.5, 'Tp6 mobile: Facebook',            "https://m.facebook.com"],
      [  676.3 ,   377  ,             790.5,          1037.5,   36.95,   281.26,  412   ,    null,  374.5 ,  121  , 'Tp6 mobile: Google',              "https://www.google.com"],
      [  989.47,  1020  ,             613  ,          1549  ,   81.23,   566.39,  746   ,    null,  469   ,  479  , 'Tp6 mobile: YouTube',             "https://www.youtube.com"],
      [ 1270.33,   726.5,             752  ,          3750  ,  388.32,  1057.80, 4070.5 ,    null,  664   ,  641  , "Tp6 mobile: Instagram",           "https://www.instagram.com"],
      [  497.42,   426.5,             580  ,           497.5,   51.04,   272.30,  188   ,    null,  232.5 ,  184.5, "Tp6 mobile: Bing",                "https://www.bing.com"],
      [  536.01,   454  ,             634  ,           535  ,   62.59,   377.99,  240   ,    null,  297.5 ,  225  , "Tp6 mobile: Bing Restaurants",    "https://www.bing.com/search?q=restaurants"],
      [ 2028.9 ,  1197.5,            1425  ,          4893  ,  135.71,  1100.66, 3611.5 ,    null, 1175.5 ,  524.5, "Tp6 mobile: Kleinanzeigen",       "https://m.ebay-kleinanzeigen.de"],
      [ 2499.24,  1251  ,            1401.5,          8900  ,  178.86,  1782.52, 7862   ,    null, 1492   ,  870.5, "Tp6 mobile: Kleinanzeigen Search","https://m.ebay-kleinanzeigen.de/s-anzeigenulluf-zeit-wg-berlin/zimmer/c199-l3331"],
      [ 1170.26,   960.5,             974  ,          1713  ,   23.93,   609.49,  878.5 ,    null,  888   ,  290  , "Tp6 mobile: Google Maps",         "https://www.google.com/maps?force=pwa"],
      // [    null,    null,              null,            null,    null,     null,    null,    null,    null,   null, "Tp6 mobile: Google Restaurants",  "https://www.google.com/search?q=restaurants+near+me"],
      [ 1370.8 ,    1521,             676.5,          2502.5,  199.24,   870.6 , 1345   ,    null,  723.5 ,  678  , "Tp6 mobile: Booking",             "https://booking.com"],
      [ 6155.06,  3283.5,            4412  ,         16094.5,  333.21,  5805.18,16570.5 ,    null, 1043   , 3004.5, "Tp6 mobile: CNN",                 "https://cnn.com"],
      [ 1376.46,   400.5,            1642  ,          3961  ,  578.29,   621.27, 1715   ,    null, 3929   ,  133.5, "Tp6 mobile: CNN AmpStories",      "https://cnn.com/ampstories/us/why-hurricane-michael-is-a-monster-unlike-any-other"],
      [ 2400.72,  1799  ,            1890.5,          4068  , 1132.26,  1684.31, 4529.5 ,    null, 1302   , 1049  , "Tp6 mobile: Amazon Search",       "https://www.amazon.com/s/ref=nb_sb_noss_2/139-6317191-5622045?url=search-alias%3Daps&field-keywords=mobile+phone"],
      [  834.43,   659.5,             783  ,          1125  ,  456.05,   555.88,  515   ,    null,  565.5 ,  311  , "Tp6 mobile: Wikipedia",           "https://en.m.wikipedia.org/wiki/Main_Page"],
      [ 1220.69,  1263  ,             707  ,          2036.5,   47.11,   726.52, 1198.5 ,    null,  426.5 ,  585.5, "Tp6 mobile: YouTube Watch",       "https://www.youtube.com/watch?v=COU5T-Wafa4"],
      [ 1760.66,   851.5,            1052.5,          6086.5,  192.6,    849.40,  4865.5,    null,  505.5 ,  248.5, "Tp6 mobile: Reddit",              "https://www.reddit.com"],
      [ 1471.91,  1125.5,            1231.5,          2300.5,  108.27,  2602.35, 5845.5 ,    null, 1035   , 2912  , "Tp6 mobile: Stackoverflow",       "https://stackoverflow.com/"],
      // [3825.8 ,   3744.5,            1928  ,          7755.5,  362.56,   707.37, 1406.5 ,    null,  566.5 ,  444  , null,                                      "https://www.bbc.com/news/business-47245877"],
      // [ 2312.38,  1513  ,            1543.5,          5293.5,  112.12,  1328.87, 3561.5 ,    null,  911.5 ,  722.5, null,                                      "https://support.microsoft.com/en-us"],
      [ 3027.86,  2507  ,            2534  ,          4369.5,  192.15,  1193.95, 1791.5 ,    null, 1022   ,  929.5, "Tp6 mobile: Jianshu",             "https://www.jianshu.com/"],
      [ 2772.58,  2148  ,            1830  ,          5421.5,  265.56,  1805.07, 3680.5 ,    null, 1511.5 , 1057  , "Tp6 mobile: Imdb",                "https://m.imdb.com/"],
      [ 3957.12,  2760.5,            2130  ,         10536.5,  181.64,  4195.60, 9121.5 ,    null, 1933.5 , 2464  , "Tp6 mobile: All Recipes",         "https://www.allrecipes.com/"],
      [ 2935.63,  1964.5,            2071  ,          6217.5,  300.34,  2783.41, 5732   ,    null, 2411   , 1667  , "Tp6 mobile: ESPN",                "http://www.espn.com/nba/story/_/page/allstarweekend25788027/the-comparison-lebron-james-michael-jordan-their-own-words"],
      [ 1353.86,  1244.5,            1074  ,          1856.5,   60.26,  1471.35, 4655.50,    null,  868   , 1063  , "Tp6 mobile: Web.de",              "https://web.de/magazine/politik/politologe-glaubt-grossen-koalition-herbst-knallen-33563566"],
      [ 1783.27,  1400  ,            1458  ,          2778  ,   71.02,  1024.74, 1794.50,    null,  827.5 ,  724.5, "Tp6 mobile: Facebook Cristiano",  "https://m.facebook.com/Cristiano"],
      [ 2223.17,  1191.5,            1245  ,          7404  ,  359.71,  1509.44, 6001   ,    null,  763.5 ,  750  , "Tp6 mobile: Aframe.io",           "https://aframe.io/examples/showcase/animation"],
    ]
  };

const tests = selectFrom(TP6_TESTS).select('test');
const platform = 'android-g5';

const raw = selectFrom(fennec64onG5.data)
  .map(row => Data.zip(fennec64onG5.header, row))
  .leftJoin("nothing", selectFrom(PLATFORMS).where({platform}), "nothing")
  .map(row => tests.map(test => {
    return {test, value: row[test], ...row};
  }))
  .flatten()
  .edges(['test', 'site', 'platform']);

const g5Reference = window({raw}, {
  edges: ['test', 'site', 'platform'],
  value: ({test, site, platform, raw}) => {
    if ([test, site, platform].some(missing)) return null;

    if (raw.length > 1) {
      Log.error('expecting only one value for {{combo}}', {
        test,
        site,
        platform,
      });
    }

    if (missing(raw) || missing(first(raw).value)) return null;
    return round(first(raw).value * 0.80, {places: 2}); // "onload event is >20% faster than Fennec 64"
  },
});

export { g5Reference, TARGET_NAME };
