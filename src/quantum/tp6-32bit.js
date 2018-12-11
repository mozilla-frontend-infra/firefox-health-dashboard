import _ from 'lodash';
import React from 'react';
import { PAGES } from './config';
import DashboardPage from '../components/DashboardPage/index';
import PerfherderGraphContainer from '../containers/PerfherderGraphContainer/index';


export default class TP6_32 extends React.Component {
  render() {
    const a = 42;
    return (
      <DashboardPage title='TP6 - Page load on 32bit'>
        {_
        .chain(PAGES.data)
        // ZIP HEADER WITH ROWS TO GET OBJECTS
        .map(row => _.zipObject(PAGES.header, row))
        // GROUP BY title
        .groupBy(row => row.title)
        // LOOP OVER EACH KEY/VALUE
        .toPairs()
        .map(([title, series], _i) => {
          return (
            <PerfherderGraphContainer
              // key={`pages${i}`}
              title={title}
              series={
                _
                  .chain(series)
                  .map((s) => {
                    return {
                      label: s.label,
                      seriesConfig: s,
                    };
                  })
                  .value()
              }
            />
          );
        })
        // GROUP IN PAIRS
        .chunk(2)
        // ADD BLANK IF REQUIRED
        .value()
      }
      </DashboardPage>
);
}
}
