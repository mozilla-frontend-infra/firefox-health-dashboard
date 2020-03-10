import React from 'react';
import Grid from '@material-ui/core/Grid';
import { PerfherderGraphContainer } from '../utils/PerfherderGraphContainer';
import { COMBOS, PLATFORMS } from './config';
import { selectFrom } from '../vendor/vectors';
import { TimeDomain } from '../vendor/jx/domains';

const timeDomain = new TimeDomain({ past: '3month', interval: 'day' });

const PerfChart = ({ title, suite }) => PLATFORMS.map(({ label, filter, id }) => (
  <Grid item xs={6} key={id}>
    <PerfherderGraphContainer
      timeDomain={timeDomain}
      title={`${title} ${label}`}
      series={selectFrom(COMBOS)
        .where({ suite: `${suite}` })
        .map(({ browserLabel, filter: browserSuiteFilter }) => ({
          label: browserLabel,
          filter: {
            and: [{ missing: 'test' }, filter, browserSuiteFilter],
          },
        }))
        .toArray()}
      missingDataInterval={10}
    />
  </Grid>
));

export default PerfChart;
