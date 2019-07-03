import React from 'react';
import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import { selectFrom } from '../vendor/vectors';
import { BROWSERS, ENCODINGS, PLATFORMS, TESTS } from './config';
import { getData } from '../vendor/perfherder';
import jx from '../vendor/jx/expressions';
import { coalesce } from '../vendor/utils';
import { URL } from '../vendor/requests';

const styles = {
  border: '1px',
  borderStyle: 'none',

  line: {
    '&:hover': {
      backgroundColor: '#f8f8f8',
    },
  },
  chart: {
    justifyContent: 'center',
    display: 'inline-block',
    border: '1rem',
    width: '100%',
  },
  title: {
    width: '100%',
    color: '#56565a',
    fontSize: '1rem',
    backgroundColor: '#d1d2d3',
    padding: '.2rem .3rem .3rem .3rem',
    margin: '0 1rem 0 0',
  },
  name: {
    fontSize: '1rem',
    height: '3rem',
    width: '100%',
  },
  pass: {
    fontSize: '1rem',
    backgroundColor: '#77cc00',
    width: '100%',
    height: '3rem',
  },
  bad: {
    fontSize: '1rem',
    backgroundColor: '#ffcd02',
    width: '100%',
    height: '3rem',
  },
  fail: {
    fontSize: '1rem',
    backgroundColor: '#ff3333',
    width: '100%',
    height: '3rem',
  },
};
const SPECIAL_SIZES = [
  { id: '480p30', label: '480' }, // .4M pixels
  { id: '720p60', label: '720' }, // 1M pixels
  { id: '1080p60', label: '1080' }, // 2M pixels
  { id: '1440p60', label: '1440' }, // 4M pixels
  { id: '2160p60', label: '2160' }, // 8M pixels
];
const lookupType = {
  '0': 'pass',
  '1': 'bad',
  '2': 'fail',
};
const browserId = 'firefox';

class PlaybackSummary extends React.Component {
  state = { scores: null };

  async update() {
    const { bits, encoding } = this.props;
    const browser = selectFrom(BROWSERS)
      .where({ id: browserId })
      .first();
    const sizes = selectFrom(SPECIAL_SIZES)
      .select('id')
      .toArray();
    const temp = selectFrom(PLATFORMS);
    const combos = temp
      .where({ bits })
      .map(platform =>
        selectFrom(ENCODINGS)
          .where({ encoding })
          .map(({ encoding }) =>
            selectFrom(TESTS)
              .where({
                encoding,
                size: sizes,
              })
              .map(test => {
                const filter = {
                  and: [browser.filter, platform.filter, test.filter],
                };

                return {
                  platform: platform.id,
                  encoding,
                  size: test.size,
                  speed: test.speed,
                  filter,
                };
              })
          )
          .flatten()
      )
      .flatten()
      .toArray();
    const results = await Promise.all(
      combos.map(async g => {
        const perfData = await getData(g.filter);
        const loss = coalesce(
          selectFrom(perfData)
            .select('data')
            .flatten()
            .filter(jx({ gte: { push_timestamp: { date: 'today-week' } } }))
            .select('value')
            .average(),
          0
        );

        return { ...g, loss };
      })
    );
    const result = selectFrom(results)
      .groupBy(['encoding', 'platform', 'size'])
      .map((speeds, g) => ({
        ...g,
        score:
          lookupType[
            selectFrom(speeds)
              .map(({ speed, loss }) => {
                if (loss <= 1) return 0;

                if (speed === 1) return 2;

                return 1;
              })
              .max()
          ],
      }))
      .toArray();

    this.setState({ scores: result });
  }

  async componentDidMount() {
    await this.update();
  }

  render() {
    const { scores } = this.state;
    const { bits, encoding, classes } = this.props;

    if (!scores) {
      return (
        <div
          style={{
            position: 'relative',
          }}>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              right: '50%',
            }}>
            <CircularProgress />
          </div>
        </div>
      );
    }

    return (
      <div key="1">
        <h2 className={classes.title}>
          {encoding} (one, or less, dropped frames per test)
        </h2>
        {selectFrom(PLATFORMS)
          .where({ bits })
          .map(platform => (
            // https://health.graphics/playback?platform=mac&browser=firefox&encoding=VP9&past=month&ending=2019-07-03
            <div
              key={platform}
              className={classes.line}
              onClick={() => {
                const url = URL({
                  path: '/playback',
                  query: {
                    platform: platform.id,
                    encoding,
                    browser: browserId,
                    past: 'week',
                  },
                });

                window.open(url, '_blank');
              }}>
              <Grid container spacing={1}>
                <Grid item xs={5} style={{ position: 'relative' }}>
                  <div className={classes.name}>
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        right: 0,
                        whiteSpace: 'nowrap',
                        transform: 'translate(0, -50%)',
                      }}>
                      {platform.label}:
                    </div>
                  </div>
                </Grid>
                {selectFrom(SPECIAL_SIZES).map(({ id, label }) => {
                  const { score } = selectFrom(scores)
                    .where({ platform: platform.id, encoding, size: id })
                    .first();

                  return (
                    <Grid
                      key={`${platform.id}_${encoding}_${id}`}
                      item
                      xs={1}
                      style={{ position: 'relative', padding: '0.1rem' }}>
                      <div className={classes[score]}>
                        <div
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                          }}>
                          {label}
                        </div>
                      </div>
                    </Grid>
                  );
                })}
              </Grid>
            </div>
          ))}
      </div>
    );
  }
}

export default withStyles(styles)(PlaybackSummary);
