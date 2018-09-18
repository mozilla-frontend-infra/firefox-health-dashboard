const TARGET1 = 'GV';
const TARGET2 = 'ChromeBeta';

const percentageSymbol = (target1, target2, targetRatio) =>
  ((target1 < (targetRatio * target2)) ? '+' : '');

const ratioWithTarget = (target1, target2, targetRatio) => target1 / (targetRatio * target2);

export const sortSitesByTargetRatio = (a, b) => {
  const aRatio = a[TARGET1] / a[TARGET2];
  const bRatio = b[TARGET1] / b[TARGET2];
  return bRatio - aRatio;
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

export const generateSitesTableContent = (nimbledroidData, targetRatio) => {
  const numSites = Object.keys(nimbledroidData).length;
  const sites = (numSites > 0) ?
    Object.values(nimbledroidData).sort(sortSitesByTargetRatio) : [];
  const count = {
    red: 0,
    yellow: 0,
    green: 0,
  };
  const tableContent = sites.map(({
    title, url, GV, WV, ChromeBeta,
  }) => {
    const { ratio, symbol, color } = siteMetrics(GV, ChromeBeta, targetRatio);
    count[color] += 1;
    // This matches the format expected by the SummaryTable component
    return {
      dataPoints: [GV, WV, ChromeBeta],
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
  const tableHeader = ['GeckoView', 'WebView', 'Chrome beta', '% from target'];
  return {
    tableHeader,
    tableContent,
    summary: generateSitesSummary(count, numSites),
  };
};
