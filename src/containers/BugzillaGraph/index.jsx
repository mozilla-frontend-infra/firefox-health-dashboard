import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withErrorBoundary from '../../hocs/withErrorBoundary';
import ChartJsWrapper from '../../components/ChartJsWrapper';
import getBugsData from '../../utils/bugzilla/getBugsData';

class BugzillaGraph extends Component {
  state = {
    data: null,
    isLoading: false,
  };

  async componentDidMount() {
    this.fetchData(this.props);
  }

  async fetchData({ handleError, queries, startDate }) {
    try {
      this.setState({ isLoading: true });
      this.setState(await getBugsData(queries, startDate));
    } catch (error) {
      handleError(error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { data, isLoading } = this.state;
    const { title } = this.props;

    return (
      <ChartJsWrapper
        data={data}
        isLoading={isLoading}
        options={{ scaleLabel: 'Number of bugs' }}
        title={title}
      />
    );
  }
}

BugzillaGraph.propTypes = {
  handleError: PropTypes.func.isRequired,
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
