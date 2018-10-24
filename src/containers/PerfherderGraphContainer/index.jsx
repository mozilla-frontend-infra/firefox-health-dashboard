import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ChartJsWrapper from '../../components/ChartJsWrapper';
import getPerferherderData from '../../utils/perfherder/chartJs/getPerfherderData';

class PerfherderGraphContainer extends Component {
    state = {
        data: null,
    };

    async componentDidMount() {
        this.fetchSetData(this.props);
    }

    async fetchSetData({ series, timeRange }) {
        this.setState(await getPerferherderData(series, { timeRange }));
    }

    render() {
        const { title } = this.props;
        const { data, options } = this.state;

        return data ? (
          <ChartJsWrapper
            type='line'
            data={data}
            options={options}
            title={title}
          />
        ) : <div />;
    }
}

PerfherderGraphContainer.propTypes = {
    series: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        extraOptions: PropTypes.arrayOf(PropTypes.string),
        frameworkId: PropTypes.number.isRequired,
        option: PropTypes.string.isRequired,
        project: PropTypes.string.isRequired,
        suite: PropTypes.string.isRequired,
    })),
    title: PropTypes.string,
    timeRange: PropTypes.string,
};

export default PerfherderGraphContainer;
