import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    color: 'white',
    backgroundColor: 'black',
    borderBottom: '1px solid #fff',
    fontWeight: 100,
    padding: '0.4rem 0 0 1rem',
  },
  subtitle: {
    color: '#d1d2d3',
    fontWeight: 400,
    margin: '.5rem .6rem .5rem',
    padding: '.5em 0',
  },
};

const DashboardPage = ({ classes, children, title, subtitle }) => (
  <div className={classes.root}>
    <div className={classes.title}>
      <h1>
        {title}
        <small className={classes.subtitle}>{subtitle}</small>
      </h1>
    </div>
    <Fragment>{children}</Fragment>
  </div>
);

DashboardPage.propTypes = {
  classes: PropTypes.shape({}),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

export default withStyles(styles)(DashboardPage);
