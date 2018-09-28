import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { generateSitesTableContent } from '../../utils/nimbledroid';
import fetchNimbledroidData from '../../utils/nimbledroid/fetchNimbledroidData';
import withErrorBoundary from '../../hocs/withErrorBoundary';

import SummaryTable from '../../components/SummaryTable';
import StatusWidget from '../../components/StatusWidget';

const styles = {
  root: {},
  summary: {
    color: 'black',
    width: '400px',
  },
};

class NimbledroidSummaryTable extends Component {
  state = {
    tableContent: null,
    showSites: false,
  };

  async componentDidMount() {
    const { nimbledroidData, targetRatio } = this.props;
    if (nimbledroidData) {
      this.setTableContents(nimbledroidData, targetRatio);
    } else {
      try {
        const data = await fetchNimbledroidData(this.props.products);
        this.setTableContents(data, targetRatio);
      } catch (error) {
        this.props.handleError(error);
      }
    }
  }

  setTableContents(nimbledroidData, targetRatio) {
    this.setState({
      ...generateSitesTableContent(nimbledroidData, targetRatio),
    });
  }

  render() {
    if (!this.state.tableContent) {
      return null;
    }

    return (
      <div className={this.props.classes.root}>
        {!this.state.showSites && (
          <div>
            <Button onClick={() => this.setState({ showSites: true })}>
              Show detail view
            </Button>
            <div className={this.props.classes.summary}>
              {this.state.summary.map(s => (<StatusWidget key={s.title.text} {...s} />))}
            </div>
          </div>
        )}
        {this.state.showSites && (
          <div>
            <Button onClick={() => this.setState({ showSites: false })}>
              Show summary view
            </Button>
            <SummaryTable
              header={this.state.tableHeader}
              content={this.state.tableContent}
            />
          </div>
        )}
      </div>
    );
  }
}

NimbledroidSummaryTable.propTypes = {
  nimbledroidData: PropTypes.shape({}),
  products: PropTypes.arrayOf(PropTypes.string),
  targetRatio: PropTypes.number.isRequired,
};

export default withErrorBoundary(withStyles(styles)(NimbledroidSummaryTable));
