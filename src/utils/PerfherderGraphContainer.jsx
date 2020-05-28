/* eslint-disable react/no-multi-comp */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { LinkIcon } from './icons';
import ChartJsWrapper from '../vendor/components/chartJs/ChartJsWrapper';
import { Data, isEqual } from '../vendor/datas';
import { withErrorBoundary } from '../vendor/errors';
import {
  coalesce, exists, literalField, missing, toArray,
} from '../vendor/utils';
import { URL } from '../vendor/requests';
import { GMTDate as Date } from '../vendor/dates';
import { getData, TREEHERDER } from '../vendor/perfherder';
import { ArrayWrapper, selectFrom } from '../vendor/vectors';
import { Log } from '../vendor/logs';
import { round } from '../vendor/math';
import { sleep } from '../vendor/signals';
import SETTINGS from '../config.json';
import { Auth0Client } from '../vendor/auth0/client';
import { Template } from '../vendor/Template';

const REFERENCE_COLOR = '#45a1ff44';

// treeherder can only accept particular time ranges
const ALLOWED_TREEHERDER_TIMERANGES = [1, 2, 7, 14, 30, 60, 90].map(
  x => x * 24 * 60 * 60,
);

const MOZILLA_CENTRAL = {
  name: 'mozilla-central',
  revisionURL: 'https://hg.mozilla.org/mozilla-central/pushloghtml?changeset={{revision}}',
};

const FENIX = {
  name: 'fenix',
  revisionURL: 'https://github.com/mozilla-mobile/fenix/commit/{{revision}}',
};


const tipStyles = {
  tooltipKey: {
    display: 'inline-block',
    width: '10px',
    height: '10px',
    marginRight: '10px',
  },
  lockMessage: {
    color: '#ccc',
  },
  value: {
    fontSize: '1rem',
  },
  title: {
    fontWeight: 'bold',
    display: 'inline-block',
  },
};
const tip = withStyles(tipStyles)(
  ({
    record, index, data, series, classes, isLocked,
  }) => {
    if (missing(series.meta)) {
      return (
        <div>
          {' '}
          {series.label}
          {' '}
        </div>
      );
    }

    const higherOrLower = series.meta.lowerIsBetter
      ? 'lower is better'
      : 'higher is better';

    const repo = coalesce(series.repo, MOZILLA_CENTRAL);
    const revisionURL = new Template(repo.revisionURL).expand({ revision: record.revision });

    const jobURL = URL({
      path: 'https://treeherder.mozilla.org/#/jobs',
      query: {
        repo: repo.name,
        revision: record.revision,
        selectedJob: record.job_id,
        group_state: 'expanded',
      },
    });

    return (
      <div>
        <div className={classes.title}>
          {`${Date.newInstance(record.push_timestamp).format(
            'MMM dd, yyyy - HH:mm',
          )}GMT`}
        </div>
        <div>
          <span
            style={{ backgroundColor: series.style.color }}
            className={classes.tooltipKey}
          />
          {series.label}
        </div>
        <span className={classes.value}>
          {round(record.value, { places: 3 })}
        </span>

        (
        {higherOrLower}
        )
        {(() => {
          if (index === 0) return null;
          const prev = data[index - 1];
          const delta = record.value - prev.value;

          if (delta === 0) return null;

          const deltaPercentage = (delta / prev.value) * 100;

          if (missing(deltaPercentage)) {
            return (
              <div>
                Δ
                {delta.toFixed(2)}
              </div>
            );
          }

          return (
            <div>
              Δ
              {' '}
              {delta.toFixed(2)}
              {' '}
              (
              {deltaPercentage.toFixed(1)}
              {' '}
              %)
            </div>
          );
        })()}
        <div>
          <a href={revisionURL} target="_blank" rel="noopener noreferrer">
            {record.revision.slice(0, 12)}
          </a>

          (
          <a href={jobURL} target="_blank" rel="noopener noreferrer">
            job
          </a>
          )
        </div>

        <div style={{ backgroundColor: series.style.color }}>
          {record.note}
        </div>
        <div className={classes.lockMessage}>
          {isLocked ? 'Click to unlock' : 'Click to lock'}
        </div>
      </div>
    );
  },
);
const generateStandardOptions = (series, timeDomain) => {
  const { lowerIsBetter, unit } = series[0].meta;
  const data = selectFrom(series)
    .enumerate()
    .map(s => selectFrom(s.data)
      .sort('push_timestamp')
      .enumerate()
      .map(d => {
        // eslint-disable-next-line no-param-reassign
        d[s.label] = d.value; // IMPORTANT: WE DO NOT CREATE NEW DATA

        return d;
      })
      .toArray())
    .flatten()
    .sort('push_timestamp')
    .toArray();

  return {
    tip,
    series: selectFrom(series)
      .map(s => ({
        type: 'scatter',
        ...s,
        select: { value: literalField(s.label) },
      }))
      .append({
        label: 'Push Date',
        select: { value: 'push_timestamp', axis: 'x' },
      })
      .toArray(),
    data,
    'axis.y.label': unit,
    'axis.y.reverse': !lowerIsBetter,
    'axis.x.domain.min': timeDomain.min,
    'axis.x.domain.max': timeDomain.max,
  };
};

/* This function combines Perfherder series and transforms it
into ChartJS formatting */
const perfherderFormatter = (series, timeDomain) => {
  const firstTime = timeDomain.min.unix();
  const timeRange = Date.today().unix() - firstTime;
  const bestRange = ALLOWED_TREEHERDER_TIMERANGES.find(t => t >= timeRange);
  const combinedSeries = selectFrom(series)
    .enumerate()
    .map(({ sources, ...row }) => ({
      ...row,
      // choose meta from the source with most recent data
      meta: selectFrom(sources)
        .sort(s => selectFrom(s.data)
          .select('push_timestamp')
          .max())
        .last({}).meta,
      // multiple sources make up a single series, merge them here
      data: selectFrom(sources)
        .select('data')
        .flatten()
        .sort('push_timestamp')
        .toArray(),
    }))
    .toArray();

  const urls = {
    title: 'show Perfherder',
    url: URL({
      path: [TREEHERDER, 'perf.html#/graphs'],
      query: {
        timerange: bestRange,
        series: selectFrom(series)
          .select('sources')
          // each series has multiple sources, merge them
          .flatten()
          .select('meta')
          .map(({ repo, id, framework }) => [repo, id, 1, framework])
          .toArray(),
      },
    }),
    icon: LinkIcon,
  };

  return {
    standardOptions: generateStandardOptions(combinedSeries, timeDomain),
    urls,
  };
};

const getPerfherderData = async (series, timeDomain) => {
  const newData = await Promise.all(
    series.map(async row => {
      const sources = await getData(row.filter);

      // filter out old data
      return {
        ...row,
        sources: sources.map(({ data, ...row }) => ({
          ...row,
          data: data.filter(
            /* eslint-disable-next-line camelcase */
            ({ push_timestamp }) => timeDomain.includes(push_timestamp),
          ),
        })),
      };
    }),
  );

  if (missing(selectFrom(newData).exists('sources'))) {
    Log.error('can not get data for {{query|json}}', {
      query: series[0].filter,
    });
  }

  return perfherderFormatter(newData, timeDomain);
};

const styles = () => ({
  title: {
    color: '#56565a',
    fontSize: '1rem',
    backgroundColor: '#d1d2d3',
    padding: '.2rem .3rem .3rem .3rem',
    margin: '0 1rem 0 0',
  },
});

class PerfherderGraphContainerInternal extends React.Component {
  constructor(props) {
    super(props);
    const { timeDomain } = this.props;

    if (missing(timeDomain)) {
      Log.error('expecting a time range');
    }

    this.state = {
      standardOptions: null,
      urls: null,
      isLoading: true,
      notes: null,
    };
  }

  async componentDidUpdate(prevProps) {
    if (isEqual(this.props, prevProps)) {
      return;
    }
    return this.update();
  }

  async componentDidMount() {
    this.update();
  }

  async update() {
    const {
      series, style, urls: propsUrls, reference, timeDomain,
    } = this.props;

    this.setState({ isLoading: true });
    await sleep(0); // ALLOW UI TO UPDATE

    try {
      const config = await getPerfherderData(series, timeDomain);
      const { standardOptions, urls: moreUrls } = config;
      config.urls = [...toArray(propsUrls), ...toArray(moreUrls)];
      Data.setDefault(standardOptions, style);

      // ASK ANNOTATION SERVICE FOR ALERTS ON REVISIONS
      const { notes } = this.state;
      if (!notes) {
        (async () => {
          const authenticator = await Auth0Client.newInstance({});

          const revisions = selectFrom(standardOptions.series)
            .select('data')
            .flatten()
            .select('revision')
            .union()
            .sort()
            .toArray();

          try {
            const result = await authenticator.fetchJson(
              SETTINGS.annotation.query,
              {
                body: JSON.stringify({
                  from: 'sample_data',
                  where: { in: { revision12: revisions.map(r => r.substring(0, 12)) } },
                  format: 'list',
                }),
              },
            );

            // MARKUP DATA WITH NOTES
            if (exists(result.data)) {
              const detailNotes = selectFrom(result.data)
                .map(({ revision, description }) => selectFrom(standardOptions.series)
                  .select('data')
                  .flatten()
                  .where({ revision })
                  .map(d => {
                    // eslint-disable-next-line no-param-reassign
                    d.note = description;
                    return {
                      x: d.push_timestamp * 1000, y: d.value, note: description, id: revision,
                    };
                  }))
                .flatten()
                .toArray();

              this.setState({ notes: detailNotes });
            }
          } catch (error) {
            Log.warning('Can not get annotations', error);
          }
        })();
      }

      if (exists(reference)) {
        // ADD HORIZONTAL LINE
        const { label, ...rest } = reference;

        standardOptions.series.push({
          label,
          type: 'line',
          select: { axis: 'y', ...rest },
          style: { color: REFERENCE_COLOR },
        });
      }

      this.setState(config);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { title, missingDataInterval } = this.props;
    const {
      urls, standardOptions, isLoading, notes,
    } = this.state;

    return (
      <div key={title + Boolean(notes)} style={{ position: 'relative' }}>
        <ChartJsWrapper
          title={title}
          urls={urls}
          {...{
            style: { type: 'scatter' },
            isLoading,
            standardOptions,
            missingDataInterval,
            notes,
          }}
        />
      </div>
    );
  }
}

PerfherderGraphContainerInternal.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  reference: PropTypes.shape({
    range: PropTypes.shape({
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired,
    }),
    label: PropTypes.string.isRequired,
  }),
  series: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        filter: PropTypes.shape({}).isRequired,
        repo: PropTypes.shape({
          name: PropTypes.string.isRequired,
          revisionURL: PropTypes.string.isRequired,
        }).isRequired,
        standardOptions: PropTypes.shape({}),
      }),
    ),
    PropTypes.instanceOf(ArrayWrapper),
  ]).isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  timeDomain: PropTypes.shape({
    min: PropTypes.instanceOf(Date).isRequired,
    max: PropTypes.instanceOf(Date).isRequired,
    missingDataInterval: PropTypes.number,
  }),
};

const PerfherderGraphContainer = withStyles(styles)(withErrorBoundary(PerfherderGraphContainerInternal));

export { MOZILLA_CENTRAL, FENIX, PerfherderGraphContainer };
