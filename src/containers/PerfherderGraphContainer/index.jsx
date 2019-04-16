import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LinkIcon from '@material-ui/icons/Link';
import { withStyles } from '@material-ui/core/styles';
import ChartJsWrapper from '../../components/ChartJsWrapper';
import CustomTooltip from '../../utils/chartJs/CustomTooltip';
import { withErrorBoundary } from '../../vendor/errors';
import { missing, exists } from '../../vendor/utils';
import { toQueryString } from '../../vendor/convert';
import Date from '../../vendor/dates';
import { getData, TREEHERDER } from '../../vendor/perfherder';
import { selectFrom } from '../../vendor/vectors';
import { Log } from '../../vendor/logs';
import generateDatasetStyle from '../../utils/chartJs/generateDatasetStyle';
import SETTINGS from '../../settings';

const DEFAULT_TIMERANGE = Date.newInstance('today-6week').unix();
// treeherder can only accept particular time ranges
const ALLOWED_TREEHERDER_TIMERANGES = [1, 2, 7, 14, 30, 60, 90].map(
  x => x * 24 * 60 * 60
);
const generateInitialOptions = series => {
  // TODO: map tests and suite scores to measurement units and
  // add some label for scale
  const isTest = !missing(series[0].sources[0].meta.test);
  // CRAZY ASSUMPTION THAT TESTS ARE A MEASURE OF DURATION
  const higherIsBetter = isTest
    ? false
    : /* eslint-disable-next-line camelcase */
      !series[0].sources[0].meta.lower_is_better;

  return {
    reverse: higherIsBetter,
    scaleLabel: higherIsBetter ? 'Score' : 'Duration',
    tooltips: {
      enabled: false,
    },
    series,
  };
};

/* This function combines Perfherder series and transforms it
into ChartJS formatting */
const perfherderFormatter = series => {
  const firstTime = selectFrom(series)
    .select('sources')
    .flatten()
    .select('data')
    .flatten()
    .select('push_timestamp')
    .min();
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
      .map(({ data, ...row }, index) => ({
        ...row,
        ...generateDatasetStyle(SETTINGS.colors[index]),
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
    options: generateInitialOptions(series.filter(Boolean)),
    jointUrl: `${TREEHERDER}/perf.html#/graphs?${toQueryString(jointParam)}`,
    data,
    series: combinedSeries,
  };
};

const getPerfherderData = async series => {
  const newData = await Promise.all(
    series.map(async row => {
      const sources = await getData(row.seriesConfig);

      // filter out old data
      return {
        ...row,
        sources: sources.map(({ data, ...row }) => ({
          ...row,
          data: data.filter(
            /* eslint-disable-next-line camelcase */
            ({ push_timestamp }) => push_timestamp > DEFAULT_TIMERANGE
          ),
        })),
      };
    })
  );

  if (missing(selectFrom(newData).exists('sources')))
    Log.error('can not get data for {{query|json}}', {
      query: series[0].seriesConfig,
    });

  return perfherderFormatter(newData);
};

const styles = () => ({
  title: {
    color: '#56565a',
    fontSize: '1rem',
    backgroundColor: '#d1d2d3',
    padding: '.2rem .3rem .3rem .3rem',
    margin: '0 1rem 0 0',
  },
  linkIcon: {
    marginLeft: '0.2rem',
    marginBottom: -5,
  },
});

class PerfherderGraphContainer extends Component {
  state = {
    data: null,
    tooltipModel: null,
    tooltipIsLocked: false,
    canvas: null,
    isLoading: false,
  };

  async componentDidMount() {
    const { series, reference } = this.props;

    try {
      this.setState({ isLoading: true });
      const config = await getPerfherderData(series);

      if (exists(reference) && exists(reference.value)) {
        const { label, value } = reference;
        const x = selectFrom(config.data.datasets)
          .select('data')
          .flatten()
          .select('x');

        config.data.datasets.push({
          label,
          type: 'line',
          backgroundColor: 'gray',
          borderColor: 'gray',
          fill: false,
          pointRadius: '0',
          pointHoverRadius: '0',
          pointHoverBackgroundColor: 'gray',
          lineTension: 0,
          data: [{ x: x.min(), y: value }, { x: x.max(), y: value }],
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
    const { classes, title } = this.props;
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
            <span>
              {title}
              {jointUrl && (
                <a href={jointUrl} target="_blank" rel="noopener noreferrer">
                  <LinkIcon className={classes.linkIcon} />
                </a>
              )}
            </span>
          }
          type="line"
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
      seriesConfig: PropTypes.shape({}).isRequired,
      options: PropTypes.shape({
        includeSubtests: PropTypes.bool,
      }),
    })
  ),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  timeRange: PropTypes.string,
};

export default withStyles(styles)(withErrorBoundary(PerfherderGraphContainer));
