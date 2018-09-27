import { Component } from 'react';
import PropTypes from 'prop-types';
import queryPerformanceData from '@mozilla-frontend-infra/perf-goggles';
import PerfherderGraph from '../../components/PerfherderGraph';
import chartJsFormatter from '../../utils/perfherder/chartJsFormatter';

class PerfherderGraphContainer extends Component {
    state = {
        data: null,
        option: null,
    }

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
                    color: config.color,
                    label: config.label,
                };
        }));
        this.setState({ ...chartJsFormatter(data) });
    }

    render() {
        const { data, options } = this.state;

        if (!data) {
            // XXX: We could add linear or circular progress bar
            return null;
        }
        return (
          <PerfherderGraph
            data={data}
            options={options}
          />
        );
    }
}

PerfherderGraphContainer.propTypes = {
    series: PropTypes.arrayOf(PropTypes.shape({
        color: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        extraOptions: PropTypes.shape({}),
        frameworkId: PropTypes.number.isRequired,
        option: PropTypes.string.isRequired,
        project: PropTypes.string.isRequired,
        suite: PropTypes.string.isRequired,
    })),
    timeRange: PropTypes.string,
};

export default PerfherderGraphContainer;
