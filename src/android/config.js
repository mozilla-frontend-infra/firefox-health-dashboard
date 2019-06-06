/* eslint-disable */

import { Data } from "../vendor/datas";
import { selectFrom } from "../vendor/vectors";
import { first, missing } from "../vendor/utils";
import { round } from "../vendor/math";
import { Log } from "../vendor/logs";
import { window } from "../vendor/jx/cubes";
import { PLATFORMS, TP6_TESTS } from "../quantum/config";

const TARGET_NAME = "Fennec64 -20%";



// COLD https://docs.google.com/spreadsheets/d/1xuYdCodmiFY-NmAXq_8WTcO_WMfsZVNNeiGCr-w2xAY/edit#gid=1807088781
const fennec64onP2 = {

  header: ["cold-geomean", "cold-dcf", "dcf-stdev", "cold-fnbpaint", "cold-fnbpaint-stdev", "cold-loadtime", "cold-loaddtime-stdev", "site", "url"],
  data: [
    [851.7, 655.5, 61.53, 887, 54.2, 1062.5, 281.13, 'Tp6 mobile: Amazon', "https://www.amazon.com"],
    [1163.03, 935.5, 64.69, 998.5, 33.64, 1684, 93.8, 'Tp6 mobile: Facebook', "https://m.facebook.com"],
    [429.43, 259.5, 26.03, 513.5, 31.03, 594, 49.13, 'Tp6 mobile: Google', "https://www.google.com"],
    [625.34, 530.5, 26.44, 553, 22.98, 833.5, 31.69, 'Tp6 mobile: YouTube', "https://www.youtube.com"],
    [824.07, 407.5, 49.59, 709, 48.61, 1935.5, 99.03, "Tp6 mobile: Instagram", "https://www.instagram.com"],
    [358.86, 304, 33.6, 420.5, 39.04, 361.5, 32.99, "Tp6 mobile: Bing", "https://www.bing.com"],
    [373.4, 314, 15.58, 434, 42.26, 382, 33.34, "Tp6 mobile: Bing Restaurants", "https://www.bing.com/search?q=restaurants"],
    [1205.51, 705.5, 53.17, 1022, 87.99, 2429, 123.35, "Tp6 mobile: Kleinanzeigen", "https://m.ebay-kleinanzeigen.de"],
    [1377.55, 740.5, 64.63, 969.5, 58.26, 3639.5, 162.26, "Tp6 mobile: Kleinanzeigen Search", "https://m.ebay-kleinanzeigen.de/s-anzeigenulluf-zeit-wg-berlin/zimmer/c199-l3331"],
    [615.62, 493, 18.23, 527.5, 18.88, 897, 95.15, "Tp6 mobile: Google Maps", "https://www.google.com/maps?force=pwa"],
    [null, null, null, null, null, null, null, "Tp6 mobile: Google Restaurants", "https://www.google.com/search?q=restaurants+near+me"],
    [890.24, 906, 86.96, 556.5, 16.53, 1399, 82.35, "Tp6 mobile: Booking", "https://booking.com"],
    // [2745.33, 1427.5, 37.93, 1994.5, 194.08, 7265.5, 593.98, "Tp6 mobile: CNN", "https://cnn.com"],
    [831.88, 281, 13.25, 1011.5, 32.3, 2022.5, 299.86, "Tp6 mobile: CNN AmpStories", "https://cnn.com/ampstories/us/why-hurricane-michael-is-a-monster-unlike-a"],
    [1200.68, 928, 40.24, 978.5, 46.39, 1906, 65.74, "Tp6 mobile: Amazon Search", "https://www.amazon.com/s/ref=nb_sb_noss_2/139-6317191-5622045?url=search"],
    [549.82, 434, 57.98, 633.5, 60.13, 604.5, 59.49, "Tp6 mobile: Wikipedia", "https://en.m.wikipedia.org/wiki/Main_Page"],
    [709.89, 483.5, 118.14, 702.5, 90.51, 1053, 58.34, "Tp6 mobile: YouTube Watch", "https://www.youtube.com/watch?v=COU5T-Wafa4"],
    [1259.39, 566.5, 144.28, 1240, 143.07, 2842, 160.25, "Tp6 mobile: Reddit", "https://www.reddit.com"],
    [2089.24, 1602, 112.63, 1327, 110.09, 4289, 206.28, "Tp6 mobile: Stackoverflow", "https://stackoverflow.com/"],
    [968.38, 703.5, 672.06, 896, 681.16, 1440.5, 667.76, "Tp6 mobile: BBC", "https://www.bbc.com/news/business-4724587"],
    [1996.78, 1209.5, 87.5, 1232.5, 88.83, 5339, 13857.4, "Tp6 mobile: Microsoft", "https://support.microsoft.com/en-us"],
    [1601.32, 964.5, 60.61, 1448.5, 163.47, 2938.5, 98.61, "Tp6 mobile: Jianshu", "https://www.jianshu.com/"],
    [1281.51, 784, 232.74, 1181, 177.61, 2272.5, 229.91, "Tp6 mobile: Imdb", "https://m.imdb.com/"],
    [2565.35, 2780, 633.08, 1375, 266.96, 4416, 363.75, "Tp6 mobile: All Recipes", "https://www.allrecipes.com/"],
    [823.32, 699.5, 130.21, 738, 108.29, 1081, 1156.6, "Tp6 mobile: ESPN", "http://www.espn.com/nba/story/_/page/allstarweekend25788027/the"],
    [417.52, 990, 103.53, 1037.5, 93.87, 2772.5, 145.27, "Tp6 mobile: Web.de", "https://web.de/magazine/politik/politologe-glaubt-grossen-koaliti"],
    [1070.08, 832, 100.99, 917.5, 104.33, 1605, 138.86, "Tp6 mobile: Facebook Cristiano", "https://m.facebook.com/Cristiano"],
    [1071.28, 664.5, 49.42, 716.5, 64.35, 2581, 72.18, "Tp6 mobile: Aframe.io", "https://aframe.io/examples/showcase/animation"],
  ]
};
// Initial platform was geckoview on p2-aarch64
fennec64onP2.header.push("platform");
fennec64onP2.data.forEach(d=>d.push('geckoview-p2-aarch64'));
const flatP2 = fennec64onP2.data.map(row => Data.zip(fennec64onP2.header, row));
// ADD fenix ON P2
flatP2.push(...flatP2.map(row=>({...row, platform: 'fenix-p2-aarch64'})));

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
      // [ 6155.06,  3283.5,            4412  ,         16094.5,  333.21,  5805.18,16570.5 ,    null, 1043   , 3004.5, "Tp6 mobile: CNN",                 "https://cnn.com"],
      [ 1376.46,   400.5,            1642  ,          3961  ,  578.29,   621.27, 1715   ,    null, 3929   ,  133.5, "Tp6 mobile: CNN AmpStories",      "https://cnn.com/ampstories/us/why-hurricane-michael-is-a-monster-unlike-any-other"],
      [ 2400.72,  1799  ,            1890.5,          4068  , 1132.26,  1684.31, 4529.5 ,    null, 1302   , 1049  , "Tp6 mobile: Amazon Search",       "https://www.amazon.com/s/ref=nb_sb_noss_2/139-6317191-5622045?url=search-alias%3Daps&field-keywords=mobile+phone"],
      [  834.43,   659.5,             783  ,          1125  ,  456.05,   555.88,  515   ,    null,  565.5 ,  311  , "Tp6 mobile: Wikipedia",           "https://en.m.wikipedia.org/wiki/Main_Page"],
      [ 1220.69,  1263  ,             707  ,          2036.5,   47.11,   726.52, 1198.5 ,    null,  426.5 ,  585.5, "Tp6 mobile: YouTube Watch",       "https://www.youtube.com/watch?v=COU5T-Wafa4"],
      [ 1760.66,   851.5,            1052.5,          6086.5,  192.6,    849.40,  4865.5,    null,  505.5 ,  248.5, "Tp6 mobile: Reddit",              "https://www.reddit.com"],
      [ 1471.91,  1125.5,            1231.5,          2300.5,  108.27,  2602.35, 5845.5 ,    null, 1035   , 2912  , "Tp6 mobile: Stackoverflow",       "https://stackoverflow.com/"],
      [3825.8 ,   3744.5,            1928  ,          7755.5,  362.56,   707.37, 1406.5 ,    null,  566.5 ,  444  , 'Tp6 mobile: BBC',                                      "https://www.bbc.com/news/business-47245877"],
      [ 2312.38,  1513  ,            1543.5,          5293.5,  112.12,  1328.87, 3561.5 ,    null,  911.5 ,  722.5, 'Tp6 mobile: Microsoft Support',                                      "https://support.microsoft.com/en-us"],
      [ 3027.86,  2507  ,            2534  ,          4369.5,  192.15,  1193.95, 1791.5 ,    null, 1022   ,  929.5, "Tp6 mobile: Jianshu",             "https://www.jianshu.com/"],
      [ 2772.58,  2148  ,            1830  ,          5421.5,  265.56,  1805.07, 3680.5 ,    null, 1511.5 , 1057  , "Tp6 mobile: Imdb",                "https://m.imdb.com/"],
      [ 3957.12,  2760.5,            2130  ,         10536.5,  181.64,  4195.60, 9121.5 ,    null, 1933.5 , 2464  , "Tp6 mobile: All Recipes",         "https://www.allrecipes.com/"],
      [ 2935.63,  1964.5,            2071  ,          6217.5,  300.34,  2783.41, 5732   ,    null, 2411   , 1667  , "Tp6 mobile: ESPN",                "http://www.espn.com/nba/story/_/page/allstarweekend25788027/the-comparison-lebron-james-michael-jordan-their-own-words"],
      [ 1353.86,  1244.5,            1074  ,          1856.5,   60.26,  1471.35, 4655.50,    null,  868   , 1063  , "Tp6 mobile: Web.de",              "https://web.de/magazine/politik/politologe-glaubt-grossen-koalition-herbst-knallen-33563566"],
      [ 1783.27,  1400  ,            1458  ,          2778  ,   71.02,  1024.74, 1794.50,    null,  827.5 ,  724.5, "Tp6 mobile: Facebook Cristiano",  "https://m.facebook.com/Cristiano"],
      [ 2223.17,  1191.5,            1245  ,          7404  ,  359.71,  1509.44, 6001   ,    null,  763.5 ,  750  , "Tp6 mobile: Aframe.io",           "https://aframe.io/examples/showcase/animation"],
    ]
  };
// Initial platform was geckoview on g5
fennec64onG5.header.push("platform");
fennec64onG5.data.forEach(d=>d.push('geckoview-g5'));
const flatG5 = fennec64onG5.data.map(row => Data.zip(fennec64onG5.header, row));
// add fenix on g5
flatG5.push(...flatG5.map(row=>({...row, platform: 'fenix-g5'})));
const tests = selectFrom(TP6_TESTS).select('test').toArray();

const raw = selectFrom(flatG5)
  .append(...flatP2)
  .map(row => tests.map(test => {
    return {test, value: row[test], ...row};
  }))
  .flatten()
  .edges(['test', 'site', 'platform']);

const g5Reference = window({raw}, {
  edges: ['test', 'site', 'platform'],
  value: ({test, site, platform, raw}) => {
    if ([test, site, platform].some(missing)) {return null;}

    if (raw.length > 1) {
      Log.error('expecting only one value for {{combo}}', {
        test,
        site,
        platform,
      });
    }

    if (missing(raw) || missing(first(raw).value)) {return null;}
    return round(first(raw).value * 0.80, {places: 3}); // "onload event is >20% faster than Fennec 64"
  },
});

export { g5Reference, TARGET_NAME };
