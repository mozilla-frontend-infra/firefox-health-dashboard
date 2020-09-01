/* eslint-disable react/no-array-index-key */
import React from 'react';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { withNavigation } from '../vendor/components/navigation';
import Picker from '../vendor/components/navigation/Picker';
import DashboardPage from '../utils/DashboardPage';
import { PerfherderGraphContainer } from '../utils/PerfherderGraphContainer';
import { timePickers } from '../utils/timePickers';
import { TimeDomain } from '../vendor/jx/domains';
import { PLATFORMS, TP6_FISSION_COMBOS, PERFORMANCE_COMBOS } from './config';
import { selectFrom } from '../vendor/vectors';
import Section from '../utils/Section';

const styles = {
  body: {
    backgroundColor: 'white',
  },
  chart: {
    justifyContent: 'center',
    padding: '1rem',
  },
};

class Fission extends React.Component {
  render() {
    const {
      classes, navigation, platform, past, ending, test,
    } = this.props;
    const timeDomain = new TimeDomain({ past, ending, interval: 'day' });
    const platformFilter = selectFrom(PLATFORMS)
      .where({ id: platform })
      .first().filter;
    const performanceFilter = {
      and: [
        { or: [{ missing: 'test' }, { eq: ['test', 'suite'] }] },
        platformFilter,
        {
          eq: {
            framework: 1,
            repo: 'mozilla-central',
          },
        },
      ],
    };

    const awsyFilter = {
      and: [
        { missing: 'test' },
        platformFilter,
        {
          eq: {
            framework: 4,
            repo: 'mozilla-central',
          },
        },
      ],
    };

    return (
      <div className={classes.body}>
        <DashboardPage title="Fission" subtitle="Comparison">
          {navigation}
          <Section
            title="Raptor (TP6)"
            more="/fission/tp6?test=cold-loadtime&platform=win64-qr"
          >
            <Grid container spacing={1}>
              {selectFrom(TP6_FISSION_COMBOS)
                .where({
                  test: 'cold-loadtime',
                  site: [
                    'Tp6: Facebook',
                    'Tp6: Amazon',
                    'Tp6: YouTube',
                    'Tp6: Google',
                  ],
                })
                .map(({ browser, filter, site }) => (
                  <Grid
                    item
                    xs={6}
                    key={`page_${site}_${test}_${platform}_${past}_${ending}`}
                    className={classes.chart}
                  >
                    <PerfherderGraphContainer
                      timeDomain={timeDomain}
                      title={site}
                      series={[{
                        label: `${browser}`,
                        filter: { and: [platformFilter, filter, { eq: { fission: false } }] },
                      }, {
                        label: `${browser} (fission)`,
                        filter: { and: [platformFilter, filter, { eq: { fission: true } }] },
                      }]}
                    />
                  </Grid>
                ))}
            </Grid>
          </Section>
          <Section
            title="Performance Tests"
          >
            <Grid container spacing={1}>
              {PERFORMANCE_COMBOS.map(({ id, label, suite }) => (
                <Grid
                  item
                  xs={6}
                  key={id}
                  className={classes.chart}
                >
                  <PerfherderGraphContainer
                    timeDomain={timeDomain}
                    key={id}
                    title={label}
                    series={[
                      {
                        label: 'Firefox',
                        filter: {
                          and: [performanceFilter, { eq: { suite, fission: false } }],
                        },
                      }, {
                        label: 'Firefox (fission)',
                        filter: {
                          and: [performanceFilter, { eq: { suite, fission: true } }],
                        },
                      },
                    ]}
                  />
                </Grid>
              ))}
            </Grid>
          </Section>
          <Section
            title="AWSY"
          >
            <Grid container spacing={1}>
              <Grid
                item
                xs={6}
                key="awsy-explicit-memory"
                className={classes.chart}
              >
                <PerfherderGraphContainer
                  timeDomain={timeDomain}
                  key="awsy-explicit-memory"
                  title="Explicit Memory"
                  series={[
                    {
                      label: 'Firefox',
                      filter: {
                        and: [awsyFilter, { eq: { suite: 'Explicit Memory', fission: false } }],
                      },
                    }, {
                      label: 'Firefox (fission)',
                      filter: {
                        and: [awsyFilter, { eq: { suite: 'Explicit Memory', fission: true } }],
                      },
                    },
                  ]}
                />
              </Grid>
            </Grid>
          </Section>
        </DashboardPage>
      </div>
    );
  }
}

Fission.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  platform: PropTypes.string.isRequired,
};

const nav = [
  {
    type: Picker,
    id: 'platform',
    label: 'Platform',
    defaultValue: 'win64-qr',
    options: selectFrom(PLATFORMS)
      .select({ id: 'id', label: 'label' })
      .toArray(),
  },
  ...timePickers,
];

export default withNavigation(nav)(withStyles(styles)(Fission));
