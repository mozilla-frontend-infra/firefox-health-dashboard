import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withErrorBoundary } from '../vendor/errors';
import ChartJsWrapper from '../vendor/components/chartJs/ChartJsWrapper';
import getBugsData from '../utils/bugzilla/getBugsData';

class BugzillaGraph extends Component {
  state = {
    data: null,
    isLoading: true,
  };

  async componentDidMount() {
    await this.fetchData(this.props);
  }

  async fetchData({ queries, startDate }) {
    this.setState({ isLoading: true });

    try {
      this.setState({
        standardOptions: {
          ...(await getBugsData(queries, startDate)),
          'axis.y.label': 'Number of bugs',
        },
      });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { title } = this.props;

    return <ChartJsWrapper title={title} {...this.state} />;
  }
}

BugzillaGraph.propTypes = {
  queries: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      parameters: PropTypes.shape({
        include_fields: PropTypes.string,
        component: PropTypes.string,
        resolution: PropTypes.oneOfType([
          PropTypes.arrayOf(PropTypes.string),
          PropTypes.string,
        ]),
        priority: PropTypes.arrayOf(PropTypes.string),
      }),
    })
  ),
  startDate: PropTypes.string,
  title: PropTypes.string,
};

export default withErrorBoundary(BugzillaGraph);
