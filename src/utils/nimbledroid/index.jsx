import CONFIG from './config';

const percentageSymbol = (target1, target2, targetRatio) => ((target1 < (targetRatio * target2)) ? '+' : '');

const ratioWithTarget = (target1, target2, targetRatio) => target1 / (targetRatio * target2);

export const sortSitesByTargetRatio = (a, b) => {
  return b.ratio - a.ratio;
};

const statusColor = (ratio, targetRatio) => {
  let smileyFace = 'pass';
  let widgetColor = 'green';

  if (targetRatio <= 1) {
    throw Error('Change the code to handle a ratio below 1.');
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
  const ratio = ratioWithTarget(target1, target2, targetRatio);
  return {
    ratio,
    symbol: percentageSymbol(target1, target2, targetRatio),
    color: statusColor(ratio, targetRatio).widgetColor,
    // TODO: This could be improved
    widgetLabel: `Target: GeckoView <= Chrome Beta + ${targetRatio}%`,
  };
};

const generateSitesSummary = (count, numSites) => (
  [
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
  ]
);

export const generateSitesTableContent = (
  nimbledroidData,
  { baseProduct, compareProduct, targetRatio },
  ) => {
  const { meta, scenarios } = nimbledroidData;
  const packageIds = Object.keys(meta);
  const numSites = Object.keys(scenarios).length;
  const sites = (numSites > 0)
    ? Object.values(scenarios)
      .map((scenario) => {
        scenario.ratio = scenario[baseProduct] / scenario[compareProduct];
        return scenario;
      })
      .sort(sortSitesByTargetRatio) : [];
  const count = {
    red: 0,
    yellow: 0,
    green: 0,
  };
  const tableHeader = packageIds.map(packageId => CONFIG.packageIdLabels[packageId]);
  tableHeader.push('% from target');
  const tableContent = sites.map((scenario) => {
    const { title, url } = scenario;
    const { ratio, symbol, color } = siteMetrics(
      scenario[baseProduct],
      scenario[compareProduct], targetRatio);
    count[color] += 1;
    // This matches the format expected by the SummaryTable component
    return {
      dataPoints: packageIds.map(packageId => scenario[packageId]),
      statusColor: color,
      summary: `${symbol}${((1 - ratio) * 100).toFixed(2)}%`,
      title: {
        text: title,
        hyperlink: `android/graph?site=${url}`,
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
