import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withErrorBoundary } from '../../vendor/errors';
import ChartJsWrapper from '../../components/ChartJsWrapper';
import getBugsData from '../../utils/bugzilla/getBugsData';

class BugzillaGraph extends Component {
  state = {
    data: null,
  };

  async componentDidMount() {
    await this.fetchData(this.props);
  }

  async fetchData({ queries, startDate }) {
    try {
      this.setState(await getBugsData(queries, startDate));
    } catch (error) {
      this.props.handleError(error);
    }
  }

  render() {
    const { title } = this.props;
    const { data } = this.state;

    return (
      <ChartJsWrapper
        data={data}
        options={{ scaleLabel: 'Number of bugs' }}
        title={title}
      />
    );
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
