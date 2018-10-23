import React, { Component } from 'react';
import PropTypes from 'prop-types';
import queryPerformanceData from '@mozilla-frontend-infra/perf-goggles';
import ChartJsWrapper from '../../components/ChartJsWrapper';
import perfherderFormatter from '../../utils/chartJs/perfherderFormatter';

class PerfherderGraphContainer extends Component {
    state = {
        data: null,
    };

    async componentDidMount() {
        this.fetchSetData(this.props.series, this.props.timeRange);
    }

    async fetchSetData(series, timeRange) {
        const data = await Promise.all(series
            .map(async (config) => {
                const seriesData = await queryPerformanceData(config, timeRange);
                const seriesDatum = (Object.values(seriesData)).pop();
                return {
                    ...seriesDatum,
                    label: config.label,
                };
        }));
        this.setState({ ...perfherderFormatter(data) });
    }

    render() {
        const { title } = this.props;
        const { data, options } = this.state;

        if (!data) {
            // XXX: We could add linear or circular progress bar
            return null;
        }
        return (
          <ChartJsWrapper
            type='line'
            data={data}
            options={options}
            title={title}
          />
        );
    }
}

PerfherderGraphContainer.propTypes = {
    series: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        extraOptions: PropTypes.shape({}),
        frameworkId: PropTypes.number.isRequired,
        option: PropTypes.string.isRequired,
        project: PropTypes.string.isRequired,
        suite: PropTypes.string.isRequired,
    })),
    title: PropTypes.string,
    timeRange: PropTypes.string,
};

export default PerfherderGraphContainer;
