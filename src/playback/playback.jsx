import React from 'react';
import Grid from '@material-ui/core/Grid';
import DashboardPage from '../utils/DashboardPage';
import PlaybackSummary from './summary';
import Section from '../utils/Section';

export default class Playback extends React.Component {
  render() {
    return (
      <DashboardPage
        title="Playback"
        subtitle="Release criteria"
      >
        <Section title="Firefox (Desktop)">
          <Grid container spacing={24}>
            <Grid item xs={6} key="1">
              <PlaybackSummary
                key="VP9_firefox"
                bits={64}
                encoding="VP9"
                browserId="firefox"
              />
            </Grid>
            <Grid item xs={6} key="2">
              <PlaybackSummary
                key="H264_firefox"
                bits={64}
                encoding="H264"
                browserId="firefox"
              />
            </Grid>
          </Grid>
        </Section>
        <Section title="Firefox (Android)">
          <Grid container spacing={24}>
            <Grid item xs={6} key="3">
              <PlaybackSummary
                key="VP9_geckoview"
                bits={64}
                encoding="VP9"
                browserId="geckoview"
              />
            </Grid>
            <Grid item xs={6} key="4">
              <PlaybackSummary
                key="H264_geckoview"
                bits={64}
                encoding="H264"
                browserId="geckoview"
              />
            </Grid>
          </Grid>
        </Section>
        <Section title="Firefox Preview (Android)">
          <Grid container spacing={24}>
            <Grid item xs={6} key="5">
              <PlaybackSummary
                key="VP9_fenix"
                bits={64}
                encoding="VP9"
                browserId="fenix"
              />
            </Grid>
            <Grid item xs={6} key="6">
              <PlaybackSummary
                key="H264_fenix"
                bits={64}
                encoding="H264"
                browserId="fenix"
              />
            </Grid>
          </Grid>
        </Section>
      </DashboardPage>
    );
  }
}
