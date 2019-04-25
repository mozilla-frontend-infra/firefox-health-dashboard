import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import fetchNimbledroidData from './fetchNimbledroidData';
import { CONFIG } from './config';
import { withErrorBoundary } from '../vendor/errors';

const styles = {
  root: {},
  spacing: {
    paddingRight: '0.5rem',
  },
};

class NimbledroidProductVersions extends Component {
  state = {
    meta: null,
  };

  async componentDidMount() {
    const { nimbledroidData, products } = this.props;
    const { meta } = nimbledroidData || (await fetchNimbledroidData(products));

    this.setState({ meta });
  }

  render() {
    const { classes } = this.props;
    const { meta } = this.state;

    return !meta ? null : (
      <div className={classes.root}>
        {Object.keys(meta).map(packageId => (
          <span key={packageId} className={classes.spacing}>
            {`${CONFIG.packageIdLabels[packageId]} (${
              meta[packageId].latestVersion
            })`}
          </span>
        ))}
      </div>
    );
  }
}

NimbledroidProductVersions.propTypes = {
  classes: PropTypes.shape({}),
  nimbledroidData: PropTypes.shape({}),
  products: PropTypes.arrayOf(PropTypes.string),
};

export default withStyles(styles)(
  withErrorBoundary(NimbledroidProductVersions)
);
