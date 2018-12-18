import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LinkIcon from '@material-ui/icons/Link';
import { withStyles } from '@material-ui/core/styles';
import ChartJsWrapper from '../../components/ChartJsWrapper';
import getPerferherderData from '../../utils/perfherder/chartJs/getPerfherderData';

const styles = () => ({
  title: {
    backgroundColor: 'black',
    padding: '.3rem',
  },
  linkIcon: {
    marginLeft: '0.2rem',
    marginBottom: -5,
  },
});

class PerfherderGraphContainer extends Component {
    state = {
        data: null,
    };

    async componentDidMount() {
        this.fetchSetData(this.props);
    }

    async fetchSetData({ series }) {
        this.setState(await getPerferherderData(series));
    }

    render() {
        const { classes, title } = this.props;
        const { data, jointUrl, options } = this.state;

        return (
          <div key={title}>
            <h2 className={classes.title}>
              <span>{title}</span>
              {jointUrl && (
                <a href={jointUrl} target='_blank' rel='noopener noreferrer'>
                  <LinkIcon className={classes.linkIcon} />
                </a>
              )}
            </h2>
            {data && (
              <ChartJsWrapper
                type='line'
                data={data}
                options={options}
              />
            )}
          </div>
        );
    }
}

PerfherderGraphContainer.propTypes = {
    classes: PropTypes.shape({}).isRequired,
    series: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        seriesConfig: PropTypes.shape({
            extraOptions: PropTypes.arrayOf(PropTypes.string),
            frameworkId: PropTypes.number.isRequired,
            option: PropTypes.string.isRequired,
            project: PropTypes.string.isRequired,
            suite: PropTypes.string.isRequired,
        }),
        options: PropTypes.shape({
            includeSubtests: PropTypes.bool,
        }),
    })),
    title: PropTypes.string,
    timeRange: PropTypes.string,
};

export default withStyles(styles)(PerfherderGraphContainer);
