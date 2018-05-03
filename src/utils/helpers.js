// input example:
//  [{"value1":5.1,
//    "value2":10.5,
//    "date":"2018-04-20"
//  }]
// output example:
//  [
//    [{"value1":5.1,
//      "date": Date object
//    }],
//    [{"value2":5.1,
//      "date": Date object
//    }]
//  ]
export const transformGraphData = (keys, data) => {
  const finalData = [];
  for (const key of keys) {
    finalData.push(
      data.map(item => ({ date: new Date(item.date), value: item[key] })),
    );
  }
  return finalData;
};

// determine header status color based on whether most recent graph data point is below target
export const determineStatusColor = (data, key, target) => {
  data.sort((item1, item2) => (item1.date <= item2.date ? -1 : 1));
  if (data[data.length - 1][key] <= target) {
    return 'green';
  }
  return 'red';
};
