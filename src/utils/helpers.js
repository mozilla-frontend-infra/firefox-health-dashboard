// separates an array of objects into the number of desired arrays of objects
// (data structure provided by graphData) each containing a date and value;
// converts date strings into date objects - as required for multi-line MG graphs
export const transformGraphData = (graphData, data) => {
  const finalData = [];
  for (const key of Object.keys(graphData)) {
    for (const item of data) {
      graphData[key].push({ date: new Date(item.date), value: item[key] });
    }
    finalData.push(graphData[key]);
  }
  return finalData;
};

export const sortObjects = (data, sortBy, desc) => {
  data.sort((a, b) => {
    const item1 = (desc ? b[sortBy] : a[sortBy]);
    const item2 = (desc ? a[sortBy] : b[sortBy]);

    if (item1 < item2) {
      return -1;
    }
    if (item1 > item2) {
      return 1;
    }
    return 0;
  });
  return data;
};

// determine header status color based on whether most recent graph data point is below target
export const determineStatusColor = (data, key, target) => {
  const sortedData = sortObjects(data, 'date', false);
  if (sortedData[sortedData.length - 1][key] <= target) {
    return 'green';
  }
  return 'red';
};
