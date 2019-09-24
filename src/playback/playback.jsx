import React from 'react';
import Grid from '@material-ui/core/Grid';
import DashboardPage from '../utils/DashboardPage';
import PlaybackSummary from './summary';
import Section from '../utils/Section';

export default class Playback extends React.Component {
  render() {
    const sections = [
      {
        title: 'Firefox (Desktop)',
        bitsVersions: [64, 32],
        encodings: ['VP9', 'H264'],
        browserId: 'firefox',
      }, {
        title: 'Firefox (Android)',
        bitsVersions: [64],
        encodings: ['VP9', 'H264'],
        browserId: 'geckoview',
      }, {
        title: 'Firefox Preview (Android)',
        bitsVersions: [64],
        encodings: ['VP9', 'H264'],
        browserId: 'fenix',
      },
    ];

    return (
      <DashboardPage
        title="Playback"
        subtitle="Release criteria"
      >
        {sections.map((
          {
            title, bitsVersions, encodings, browserId,
          },
        ) => (
          <Section title={title} key={title}>
            <Grid container spacing={2}>
              {bitsVersions.map(bits => (
                encodings.map(encoding => (
                  <Grid item xs={6} key={`grid_${bits}_${encoding}_${browserId}`}>
                    <PlaybackSummary
                      key={`ps_${bits}_${encoding}_${browserId}`}
                      bits={bits}
                      encoding={encoding}
                      browserId={browserId}
                    />
                  </Grid>
                ))
              ))}
            </Grid>
          </Section>
        ))}
      </DashboardPage>
    );
  }
}
