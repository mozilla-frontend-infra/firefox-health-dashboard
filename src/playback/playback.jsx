import React from 'react';
import Grid from '@material-ui/core/Grid';
import DashboardPage from '../utils/DashboardPage';
import {
  BROWSERS, STANDARD_ENCODINGS,
} from './config';
import PlaybackSummary from './summary';
import Section from '../utils/Section';

export default class Playback extends React.Component {
  render() {
    return (
      <DashboardPage
        title="Playback"
        subtitle="Release criteria"
      >
        {BROWSERS.map(browser => (
          <Section title={browser.title} key={browser.title}>
            <Grid container spacing={2}>
              {STANDARD_ENCODINGS.map(({ encoding }) => (
                <Grid item xs={6} key={`grid_${encoding}_${browser.id}`}>
                  <PlaybackSummary
                    key={`ps_${encoding}_${browser.id}`}
                    bits={[32, 64]}
                    encoding={encoding}
                    browserId={browser.id}
                  />
                </Grid>
              ))}
            </Grid>
          </Section>
        ))}
      </DashboardPage>
    );
  }
}
