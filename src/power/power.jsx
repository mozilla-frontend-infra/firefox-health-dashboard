import React from 'react';
import Grid from '@material-ui/core/Grid';
import DashboardPage from '../utils/DashboardPage';
import Section from '../utils/Section';
import { PowerSummary } from './summary';
import { TimeDomain } from '../vendor/jx/domains';
import { COMBOS, PLATFORMS } from './config';
import { selectFrom } from '../vendor/vectors';

export default class Power extends React.Component {
  render() {
    const timeDomain = new TimeDomain({ past: '2month', interval: 'day' });
    const speedometerCombos = selectFrom(COMBOS).where({ suite: 'speedometer' });

    return (
      <DashboardPage
        title="Power Usage"
      >
        <Section title="Speedometer CPU power usage">
          <Grid container spacing={2}>
            {speedometerCombos.map(({ browser, browserLabel }) => (
              <Grid item xs={6}>
                <PowerSummary
                  key={`power_${browser}_speedometer`}
                  browser={browser}
                  suite="speedometer"
                  timeDomain={timeDomain}
                  title={browserLabel}
                />
              </Grid>
            ))}
          </Grid>
        </Section>
        <Section title="idle">
          <Grid container spacing={2}>
            {PLATFORMS.map(({ browser, browserLabel }) => (
              <Grid item xs={6}>
                <PowerSummary
                  key={`power_${browser}_speedometer`}
                  browser={browser}
                  suite="speedometer"
                  timeDomain={timeDomain}
                  title={browserLabel}
                  newWay
                />
              </Grid>
            ))}
          </Grid>
        </Section>
      </DashboardPage>
    );
  }
}
