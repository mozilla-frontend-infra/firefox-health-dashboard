/* eslint-disable react/no-array-index-key */
import React from 'react';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { selectFrom } from '../vendor/vectors';
import strings from '../vendor/strings';
import { withNavigation } from '../vendor/components/navigation';
import Picker from '../vendor/components/navigation/Picker';
import DashboardPage from '../utils/DashboardPage';
import PerfherderGraphContainer from '../utils/PerfherderGraphContainer';
import { timePickers } from '../utils/timePickers';
import { TimeDomain } from '../vendor/jx/domains';
import jx from '../vendor/jx/expressions';
import { PERFHERDER, getFramework } from '../vendor/perfherder';

const FRAMEWORK = { framework: 10, repo: 'mozilla-central' };

const styles = {
  body: {
    backgroundColor: 'white',
  },
  chart: {
    justifyContent: 'center',
    padding: '1rem',
  },
};

class Subtests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    await getFramework(FRAMEWORK);
    this.setState({ data: true });
  }

  render() {
    const {
      classes, navigation, suite, platform, past, ending,
    } = this.props;
    const timeDomain = new TimeDomain({ past, ending, interval: 'day' });
    const subtitle = `${suite} on ${platform}`;
    const { data } = this.state;
    if (!data) return null;

    const sigs = selectFrom(PERFHERDER.signatures)
      .filter(jx({
        and: [
          { eq: FRAMEWORK },
          { eq: { platform } },
          { find: { suite } },
        ],
      }))
      .materialize();

    const series = sigs
      .filter(jx({
        and: [
          {
            or: [
              { missing: 'test' },
              { eq: ['test', 'suite'] },
            ],
          },
          { find: { suite } },
          { eq: { platform, ...FRAMEWORK } },
        ],
      }))
      .map(({ suite: fullName, platform, options }) => (
        {
          label: `${strings.between(fullName, `${suite}-`)} (${options})`,
          filter: {
            and: [
              {
                or: [
                  { missing: 'test' },
                  { eq: ['test', 'suite'] },
                ],
              },
              {
                eq: {
                  suite: fullName, platform, options, ...FRAMEWORK,
                },
              },
            ],
          },

        }
      ))
      .toArray();

    return (
      <div className={classes.body}>
        <DashboardPage key={subtitle} title="Performance Subtests" subtitle={subtitle}>
          {navigation}
          <Grid container spacing={24}>
            <Grid
              item
              xs={12}
              key={`page_${suite}_${platform}_${past}_${ending}`}
              className={classes.chart}
            >
              <PerfherderGraphContainer
                timeDomain={timeDomain}
                title={`Overall ${suite}`}
                series={series}
              />
            </Grid>


            {sigs
              .filter(jx({
                and: [
                  { exists: 'test' },
                  { not: { eq: ['test', 'suite'] } },
                ],
              }))
              .groupBy('test')
              .map((series, test) => (
                <Grid
                  item
                  xs={6}
                  key={`page_${test}_${suite}_${platform}_${past}_${ending}`}
                  className={classes.chart}
                >
                  <PerfherderGraphContainer
                    timeDomain={timeDomain}
                    title={test}
                    series={selectFrom(series)
                      .sort(['test'])
                      .map(({ suite: subSuite, test, options }) => (
                        {
                          label: `${strings.between(subSuite, `${suite}-`)} (${options.toUpperCase()})`,
                          filter: {
                            and: [
                              {
                                eq: {
                                  suite: subSuite, test, options, platform,
                                },
                              },
                              { eq: FRAMEWORK },
                            ],
                          },
                        }
                      ))}
                  />
                </Grid>
              ))}
          </Grid>
        </DashboardPage>
      </div>
    );
  }
}

Subtests.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  platform: PropTypes.string.isRequired,
};

const nav = [
  {
    type: Picker,
    id: 'suite',
    label: 'Suite',
    defaultValue: 'motionmark-htmlsuite',
    options: [
      'motionmark-htmlsuite', 'motionmark-animometer', 'speedometer']
      .map(g => (
        { id: g, label: g }
      )),
  },
  {
    type: Picker,
    id: 'platform',
    label: 'Platform',
    defaultValue: 'windows10-64',
    options: ['windows10-64', 'windos7-32', 'linux32', 'linux64']
      .map(g => (
        { id: g, label: g }
      )),
  },
  ...timePickers,
];

export default withNavigation(nav)(withStyles(styles)(Subtests));
