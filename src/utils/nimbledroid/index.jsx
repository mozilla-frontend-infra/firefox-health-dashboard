/* eslint-disable no-param-reassign */
import CONFIG from './config';
import { error } from '../../vendor/errors';

export const sortSitesByTargetRatio = (a, b) => b.ratio - a.ratio;

const statusColor = (ratio, targetRatio) => {
  let smileyFace = 'pass';
  let widgetColor = 'green';

  if (targetRatio <= 1) {
    throw error('Change the code to handle a ratio below 1.');
  }

  if (ratio > targetRatio) {
    widgetColor = 'red';
  } else if (ratio >= 1) {
    widgetColor = 'yellow';
  }

  if (widgetColor !== 'green') {
    smileyFace = 'fail';
  }

  return { smileyFace, widgetColor };
};

export const siteMetrics = (target1, target2, targetRatio) => {
  const ratio = target1 == null ? 1 : target1 / target2;

  return {
    ratio,
    color: statusColor(ratio, targetRatio).widgetColor,
    // TODO: This could be improved
    widgetLabel: `Target: GeckoView <= Chrome Beta + ${targetRatio}%`,
  };
};

const generateSitesSummary = (count, numSites) => [
  {
    title: {
      text: 'GeckoView > 20% slower than Chrome Beta',
    },
    statusColor: 'red',
    summary: `${count.red}/${numSites}`,
  },
  {
    title: {
      text: 'GeckoView > 0% and <= 20% slower than Chrome Beta',
    },
    statusColor: 'yellow',
    summary: `${count.yellow}/${numSites}`,
  },
  {
    title: {
      text: 'GeckoView <= 0% (i.e. faster than) Chrome Beta',
    },
    statusColor: 'green',
    summary: `${count.green}/${numSites}`,
  },
];
const FILTERED_OUT_SITES = [
  'http://m.spiegel.de',
  'http://m.spiegel.de/netzwelt/web/firefox-quantum-so-schlaegt-sich-der-mozilla-browser-gegen-google-chrome-a-1178579.html',
  'http://www.wikia.com/fandom',
  'https://abcnews.go.com/US/nfl-owners-stand-players-trump-kneeling-rebuke/story?id=50060482',
  'https://gizmodo.com',
  'https://gizmodo.com/you-can-actually-do-something-good-with-those-eclipse-g-1798289914',
  'https://lifehacker.com',
  'https://lifehacker.com/how-to-turn-your-raspberry-pi-into-a-retro-game-console-498561192',
  'https://m.imgur.com',
  'https://m.imgur.com/gallery/IayLJ',
  'https://mashable.com/2018/02/13/reels-guide-to-black-panther.amp',
  'https://mic.com/stories/262/the-art-of-an-organized-refrigerator',
  'https://mobile.nytimes.com/2017/08/21/science/solar-eclipse.html',
  'https://mobile.twitter.com',
  'https://rumble.com',
  'https://www.buzzfeed.com',
  'https://www.cnbc.com',
  'https://www.cnbc.com/2015/05/21/american-diversity-cities-where-it-works.html',
  'https://www.cosmopolitan.com/stamp/apple-cider-vinegar',
  'https://www.expedia.com',
  'https://www.flipkart.com',
  'https://www.flipkart.com/search?q=moto%20g5%20plus&sid=tyy/4io&as=on&as-show=on&otracker=start&as-pos=1_1_ic_Moto%20G5',
  'https://www.google.com/maps/place/Mozilla,+331+E+Evelyn+Ave,+Mountain+View,+CA+94041,+USA/@37.3873148,-122.0600095,17z/data=!4m2!3m1!1s0x808fba016663a837:0x1d64663c633a9e5?force=pwa',
  'https://www.healthyway.com/content/brilliant-ways-to-use-common-baby-products-for-adults',
  'https://www.nytimes.com',
  'https://www.reddit.com',
  'https://www.reddit.com/r/IAmA/comments/7eojwf/protect_net_neutrality_save_the_internet',
  'https://www.theguardian.com/football/2018/may/14/premier-league-2017-18-review-signing-of-the-season',
  'https://www.washingtonpost.com/graphics/2018/national/amp-stories/border-wall',
  'https://www.wired.com/amp-stories/space-photos-of-the-week-111817',
];
const includeScenario = scenario =>
  scenario.includes('http') && !FILTERED_OUT_SITES.includes(scenario);

export const generateSitesTableContent = (
  nimbledroidData,
  { baseProduct, compareProduct, targetRatio }
) => {
  const { meta, scenarios } = nimbledroidData;
  const filteredScenarios = Object.keys(scenarios)
    .filter(scenario => includeScenario(scenario))
    .map(scenario => scenarios[scenario]);
  const packageIds = Object.keys(meta);
  const numSites = Object.keys(filteredScenarios).length;
  const sites =
    numSites > 0
      ? Object.values(filteredScenarios)
          .map(scenario => {
            scenario.ratio = scenario[baseProduct] / scenario[compareProduct];

            return scenario;
          })
          .sort(sortSitesByTargetRatio)
      : [];
  const count = {
    red: 0,
    yellow: 0,
    green: 0,
  };
  const { packageIdLabels } = CONFIG;
  const tableHeader = packageIds.map(packageId => packageIdLabels[packageId]);

  tableHeader.push(`% from ${packageIdLabels[compareProduct]}`);

  const tableContent = sites.map(scenario => {
    const { title, url } = scenario;
    const { ratio, color } = siteMetrics(
      scenario[baseProduct],
      scenario[compareProduct],
      targetRatio
    );

    count[color] += 1;

    // This matches the format expected by the SummaryTable component
    return {
      dataPoints: packageIds.map(packageId => scenario[packageId]) || [],
      statusColor: color,
      summary: `${((1 - ratio) * 100).toFixed(2)}%`,
      title: {
        text: title,
        hyperlink: `/android/graph?site=${url}`,
        tooltip: url,
      },
      uid: url,
    };
  });

  return {
    tableHeader,
    tableContent,
    summary: generateSitesSummary(count, numSites),
  };
};
