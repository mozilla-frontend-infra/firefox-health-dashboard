import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LinkIcon from '@material-ui/icons/Link';
import { withStyles } from '@material-ui/core/styles';
import ChartJsWrapper from '../../components/ChartJsWrapper';
import getPerfherderData from '../../utils/perfherder/chartJs/getPerfherderData';
import CustomTooltip from '../../utils/chartJs/CustomTooltip';
import { withErrorBoundary } from '../../vendor/errors';
import perfherderFormatter from '../../utils/perfherder/chartJs/perfherderFormatter';

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
    await this.fetchSetData(this.props);
  }

  async fetchSetData({ series }) {
    try {
      this.setState({ isLoading: true });
      const rawData = await getPerfherderData(series);

      this.setState(perfherderFormatter(rawData));
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
      jointUrl,
      options,
      canvas,
      tooltipModel,
      isLoading,
      tooltipIsLocked,
    } = this.state;

    return (
      <div key={title}>
        <h2 className={classes.title}>
          <span>{title}</span>
          {jointUrl && (
            <a href={jointUrl} target="_blank" rel="noopener noreferrer">
              <LinkIcon className={classes.linkIcon} />
            </a>
          )}
        </h2>
        <ChartJsWrapper
          type="line"
          data={data}
          isLoading={isLoading}
          options={options}
        />
        {tooltipModel && (
          <CustomTooltip
            tooltipModel={tooltipModel}
            series={options.series}
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
      seriesConfig: PropTypes.shape({
        extraOptions: PropTypes.arrayOf(PropTypes.string),
        framework: PropTypes.number.isRequired,
        option: PropTypes.string,
        project: PropTypes.string.isRequired,
        suite: PropTypes.string.isRequired,
      }),
      options: PropTypes.shape({
        includeSubtests: PropTypes.bool,
      }),
    })
  ),
  title: PropTypes.string,
  timeRange: PropTypes.string,
};

export default withStyles(styles)(withErrorBoundary(PerfherderGraphContainer));
