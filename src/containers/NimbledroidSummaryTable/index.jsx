import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { generateSitesTableContent } from '../../utils/nimbledroid';
import fetchNimbledroidData from '../../utils/nimbledroid/fetchNimbledroidData';
import withErrorBoundary from '../../vendor/errors';
import SummaryTable from '../../components/SummaryTable';
import StatusWidget from '../../components/StatusWidget';

const styles = {
  root: {
    margin: '0 0 0.7rem 0',
  },
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

  constructor(props) {
    super(props);
    const { configuration, nimbledroidData } = this.props;

    if (nimbledroidData) {
      this.state = generateSitesTableContent(nimbledroidData, configuration);
    }
  }

  async componentDidMount() {
    const { configuration } = this.props;
    const nimbledroidData = await fetchNimbledroidData(configuration.products);

    this.setState(generateSitesTableContent(nimbledroidData, configuration));
  }

  render() {
    const { showSites, summary, tableContent, tableHeader } = this.state;
    const { classes } = this.props;

    if (!tableContent) {
      return null;
    }

    return (
      <div className={classes.root}>
        {!showSites && (
          <div>
            <Button onClick={() => this.setState({ showSites: true })}>
              Show detailed view
            </Button>
            <div className={classes.summary}>
              {summary.map(s => (
                <StatusWidget key={s.title.text} {...s} />
              ))}
            </div>
          </div>
        )}
        {showSites && (
          <div>
            <Button onClick={() => this.setState({ showSites: false })}>
              Show summary view
            </Button>
            <SummaryTable header={tableHeader} content={tableContent} />
          </div>
        )}
      </div>
    );
  }
}

NimbledroidSummaryTable.propTypes = {
  classes: PropTypes.shape({}),
  nimbledroidData: PropTypes.shape({}),
  configuration: PropTypes.shape({
    baseProduct: PropTypes.string.isRequired,
    compareProduct: PropTypes.string.isRequired,
    products: PropTypes.arrayOf(PropTypes.string).isRequired,
    targetRatio: PropTypes.number.isRequired,
  }).isRequired,
};

export default withStyles(styles)(withErrorBoundary(NimbledroidSummaryTable));
