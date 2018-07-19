const percentageSymbol = (GV, WV, targetRatio) => ((GV < (targetRatio * WV)) ? '+' : '');

const ratioWithTarget = (GV, WV, targetRatio) => GV / (targetRatio * WV);

export const sortSitesByTargetRatio = (a, b) => {
  const aRatio = a.GV / a.WV;
  const bRatio = b.GV / b.WV;
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

export const siteMetrics = (GV, WV, targetRatio) => {
  const ratio = ratioWithTarget(GV, WV, targetRatio);
  return {
    ratio,
    symbol: percentageSymbol(GV, WV, targetRatio),
    color: statusColor(ratio, targetRatio).widgetColor,
  };
};

const generateSitesSummary = (count, numSites) => (
  [
    {
      title: {
        text: 'GeckoView > 20% slower than WebView',
      },
      statusColor: 'red',
      summary: `${count.red}/${numSites}`,
    },
    {
      title: {
        text: 'GeckoView > 0% and <= 20% slower than WebView',
      },
      statusColor: 'yellow',
      summary: `${count.yellow}/${numSites}`,
    },
    {
      title: {
        text: 'GeckoView <= 0% (i.e. faster than) WebView',
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
  const tableContent = sites.map(({ title, url, GV, WV }) => {
    const { ratio, symbol, color } = siteMetrics(GV, WV, targetRatio);
    count[color] += 1;
    // This matches the format expected by the SummaryTable component
    return {
      dataPoints: [GV, WV],
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
    tableContent,
    summary: generateSitesSummary(count, numSites),
  };
};
