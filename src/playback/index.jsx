import React from 'react';
import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { selectFrom } from '../vendor/vectors';
import { BROWSERS, ENCODINGS, PLATFORMS, SIZES, TESTS } from './config';
import { withNavigation } from '../vendor/components/navigation';
import Picker from '../vendor/components/navigation/Picker';
import DashboardPage from '../components/DashboardPage';
import PerfherderGraphContainer from '../containers/PerfherderGraphContainer';
import { Domain } from '../vendor/jx/domains';
import {
  DurationPicker,
  QUERY_TIME_FORMAT,
} from '../vendor/components/navigation/DurationPicker';
import Date from '../vendor/dates';

const styles = {
  chart: {
    justifyContent: 'center',
    padding: '1rem',
  },
};

class Power extends React.Component {
  render() {
    const {
      classes,
      navigation,
      platform,
      browser,
      encoding,
      past,
      ending,
    } = this.props;
    const timeDomain = Domain.newInstance({ type: 'time', past, ending });
    const platformDetails = selectFrom(PLATFORMS)
      .where({ id: platform })
      .first();
    const browserDetails = selectFrom(BROWSERS)
      .where({ id: browser })
      .first();

    return (
      <DashboardPage
        title="Playback"
        key={`page_${platform}_${browser}_${encoding}`}>
        {navigation}
        <Grid container spacing={24}>
          {selectFrom(SIZES).map(({ size }) => (
            <Grid
              item
              xs={6}
              key={`page_${platform}_${browser}_${encoding}_${size}`}
              className={classes.chart}>
              <PerfherderGraphContainer
                timeDomain={timeDomain}
                title={`Percent dropped frames ${size}`}
                style={{
                  'axis.y.format': '{{.|percent}}',
                  'axis.y.max.max': 1,
                }}
                series={selectFrom(TESTS)
                  .where({
                    encoding,
                    size,
                  })
                  .map(({ speed, filter: testFilter }) => ({
                    label: `${speed}x`,
                    filter: {
                      and: [
                        platformDetails.filter,
                        browserDetails.filter,
                        testFilter,
                      ],
                    },
                  }))
                  .toArray()}
              />
            </Grid>
          ))}
        </Grid>
      </DashboardPage>
    );
  }
}

const todayText = Date.today().format(QUERY_TIME_FORMAT);
const nav = [
  {
    type: Picker,
    id: 'platform',
    label: 'Platform',
    defaultValue: 'mac',
    options: PLATFORMS,
  },
  {
    type: Picker,
    id: 'browser',
    label: 'Browser',
    defaultValue: 'firefox',
    options: BROWSERS,
  },
  {
    type: Picker,
    id: 'encoding',
    label: 'Encoding',
    defaultValue: 'VP9',
    options: selectFrom(ENCODINGS).select({
      id: 'encoding',
      label: 'encoding',
    }),
  },
  {
    type: DurationPicker,
    id: 'past',
    label: 'Show past',
    defaultValue: 'month',
    options: [
      { id: 'day', label: '1 day' },
      { id: '2day', label: '2 days' },
      { id: 'week', label: 'week' },
      { id: '2week', label: '2 weeks' },
      { id: 'month', label: 'month' },
      { id: '3month', label: '3 months' },
      { id: 'year', label: 'year' },
    ],
  },
  {
    type: Picker,
    id: 'ending',
    label: 'Ending',
    defaultValue: todayText,
    options: [{ id: todayText, label: 'Today' }],
  },
];

export default withNavigation(nav)(withStyles(styles)(Power));
