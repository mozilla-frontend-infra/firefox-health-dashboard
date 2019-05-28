import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { LinkIcon } from '../../utils/icons';
import ChartJsWrapper from '../../vendor/components/chartJs/ChartJsWrapper';
import CustomTooltip from '../../vendor/components/chartJs/CustomTooltip';
import { Data } from '../../vendor/datas';
import { withErrorBoundary } from '../../vendor/errors';
import { exists, missing } from '../../vendor/utils';
import { URL } from '../../vendor/requests';
import Date from '../../vendor/dates';
import { getData, TREEHERDER } from '../../vendor/perfherder';
import { selectFrom } from '../../vendor/vectors';
import { Log } from '../../vendor/logs';
import { TimeDomain } from '../../vendor/jx/domains';

// treeherder can only accept particular time ranges
const ALLOWED_TREEHERDER_TIMERANGES = [1, 2, 7, 14, 30, 60, 90].map(
  x => x * 24 * 60 * 60
);
const generateInitialOptions = (series, timeDomain) => {
  // TODO: map tests and suite scores to measurement units and
  // add some label for scale
  const { lowerIsBetter, unit } = series[0].sources[0].meta;

  return {
    tooltips: {
      enabled: false,
    },
    // Start using: chartSchema.md
    'axis.y.label': unit,
    'axis.y.reverse': !lowerIsBetter,
    'axis.x.min': timeDomain.min,
    'axis.x.max': timeDomain.max,
  };
};

/* This function combines Perfherder series and transforms it
into ChartJS formatting */
const perfherderFormatter = (series, timeDomain) => {
  const firstTime = timeDomain.min.unix();
  const timeRange = Date.today().unix() - firstTime;
  const bestRange = ALLOWED_TREEHERDER_TIMERANGES.find(t => t >= timeRange);
  const jointParam = {
    timerange: bestRange,
    series: selectFrom(series)
      .select('sources')
      // each series has multiple sources, merge them
      .flatten()
      .select('meta')
      .map(({ repo, id, framework }) => [repo, id, 1, framework])
      .toArray(),
  };
  const combinedSeries = selectFrom(series)
    .enumerate()
    .map(({ sources, ...row }) => ({
      ...row,
      // choose meta from the source with most recent data
      meta: selectFrom(sources)
        .sortBy(s =>
          selectFrom(s.data)
            .select('push_timestamp')
            .max()
        )
        .last({}).meta,
      // multiple sources make up a single series, merge them here
      data: selectFrom(sources)
        .select('data')
        .flatten()
        .sortBy('push_timestamp')
        .toArray(),
    }))
    .toArray();
  const data = {
    datasets: selectFrom(combinedSeries)
      .enumerate()
      .map(({ data, ...row }) => ({
        ...row,
        /* eslint-disable-next-line camelcase */
        data: data.map(({ push_timestamp, value }) => ({
          /* eslint-disable-next-line camelcase */
          x: new Date(push_timestamp * 1000),
          y: value,
        })),
      }))
      .toArray(),
  };

  return {
    options: generateInitialOptions(series.filter(Boolean), timeDomain),
    jointUrl: URL({
      path: [TREEHERDER, 'perf.html#/graphs'],
      query: jointParam,
    }),
    data,
    series: combinedSeries,
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
            ({ push_timestamp }) => timeDomain.includes(push_timestamp)
          ),
        })),
      };
    })
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

class PerfherderGraphContainer extends Component {
  constructor(props) {
    super(props);
    const { timeDomain } = this.props;

    if (missing(timeDomain)) {
      Log.error('expecting a time range');
    }

    this.state = {
      data: null,
      tooltipModel: null,
      tooltipIsLocked: false,
      canvas: null,
      isLoading: false,
    };
  }

  async componentDidMount() {
    const { series, style, reference, timeDomain } = this.props;

    try {
      this.setState({ isLoading: true });

      const config = await getPerfherderData(series, timeDomain);

      Data.setDefault(config.options, style);

      if (exists(reference) && exists(reference.value)) {
        const { label, value } = reference;
        const x = selectFrom(config.data.datasets)
          .select('data')
          .flatten()
          .select('x');

        config.data.datasets.push({
          label,
          data: [{ x: x.min(), y: value }, { x: x.max(), y: value }],
          style: {
            type: 'line',
            backgroundColor: 'gray',
            borderColor: 'gray',
            fill: false,
            pointRadius: '0',
            pointHoverRadius: '0',
            pointHoverBackgroundColor: 'gray',
            lineTension: 0,
          },
        });
      }

      this.setState(config);

      const self = this;

      this.setState(prevState => {
        const { options } = prevState;

        options.onClick = this.handleChartClick;
        options.tooltips.custom = function custom(tooltipModel) {
          if (!self.state.tooltipIsLocked) {
            // eslint-disable-next-line no-underscore-dangle
            self.setState({ tooltipModel, canvas: this._chart.canvas });
          }
        };

        return { ...prevState, options };
      });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  handleChartClick = () => {
    this.setState(prevState => ({
      tooltipIsLocked: !prevState.tooltipIsLocked,
    }));
  };

  render() {
    const { title } = this.props;
    const {
      data,
      series,
      jointUrl,
      options,
      canvas,
      tooltipModel,
      isLoading,
      tooltipIsLocked,
    } = this.state;

    return (
      <div key={title}>
        <ChartJsWrapper
          title={
            <div>
              {title}
              {jointUrl && (
                <a
                  href={jointUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="show Perfherder">
                  <LinkIcon />
                </a>
              )}
            </div>
          }
          style={{ type: 'scatter' }}
          data={data}
          isLoading={isLoading}
          options={options}
        />
        {tooltipModel && (
          <CustomTooltip
            tooltipModel={tooltipModel}
            series={series}
            canvas={canvas}
            isLocked={tooltipIsLocked}
          />
        )}
      </div>
    );
  }
}

PerfherderGraphContainer.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  series: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      filter: PropTypes.shape({}).isRequired,
      options: PropTypes.shape({
        includeSubtests: PropTypes.bool,
      }),
    })
  ),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  timeDomain: PropTypes.instanceOf(TimeDomain).isRequired(),
};

export default withStyles(styles)(withErrorBoundary(PerfherderGraphContainer));
