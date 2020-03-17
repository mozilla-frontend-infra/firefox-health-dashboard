/* eslint-disable react/no-array-index-key */
import React from 'react';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { selectFrom } from '../vendor/vectors';
import { withNavigation } from '../vendor/components/navigation';
import Picker from '../vendor/components/navigation/Picker';
import DashboardPage from '../utils/DashboardPage';
import { PerfherderGraphContainer } from '../utils/PerfherderGraphContainer';
import { timePickers } from '../utils/timePickers';
import { TimeDomain } from '../vendor/jx/domains';
import jx from '../vendor/jx/expressions';
import { getFramework, PERFHERDER } from '../vendor/perfherder';
import { BENCHMARKS } from './config';

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


    const focus = BENCHMARKS.where({ suite, platform });
    const sigs = selectFrom(PERFHERDER.signatures)
      .filter(jx({ or: focus.select('filter') }))
      .materialize();

    const tests = sigs
      .filter(jx({ exists: 'test' }))
      .groupBy('test')
      .map((_, g) => g)
      .materialize();
    const series = focus
      .map(({ repo, browser, filter }) => ({
        repo,
        label: browser,
        filter: { and: [{ missing: 'test' }, filter] },
      }));

    return (
      <div className={classes.body}>
        <DashboardPage key={subtitle} title="Performance Subtests" subtitle={subtitle}>
          {navigation}
          <Grid container spacing={1}>
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


            {tests
              .map(test => (
                <Grid
                  item
                  xs={6}
                  key={`page_${test}_${suite}_${platform}_${past}_${ending}`}
                  className={classes.chart}
                >
                  <PerfherderGraphContainer
                    timeDomain={timeDomain}
                    title={test}
                    series={focus
                      .map(({ repo, browser, filter }) => (
                        {
                          repo,
                          label: browser,
                          filter: { and: [{ eq: { test } }, filter] },
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
    defaultValue: 'MotionMark HTML',
    options: BENCHMARKS
      .groupBy('suite')
      .map((_, g) => (
        { id: g, label: g }
      )),
  },
  {
    type: Picker,
    id: 'platform',
    label: 'Platform',
    defaultValue: 'win64',
    options: BENCHMARKS
      .groupBy('platform')
      .map((_, g) => (
        { id: g, label: g }
      )),
  },
  ...timePickers,
];

export default withNavigation(nav)(withStyles(styles)(Subtests));
