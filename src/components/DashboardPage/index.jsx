import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {},
  dashboardTitle: {
    borderBottom: '1px solid #fff',
    padding: '0.25rem 0 0 0.75rem',
  },
  title: {},
  subtitle: {
      color: '#d1d2d3',
      fontWeight: '400',
      margin: '.5rem .6rem .5rem',
      padding: '.5em 0',
  },
};

const DashboardPage = ({ classes, children, title, subtitle }) => {
  return (
    <div className={classes.root}>
      <div className={classes.dashboardTitle}>
        <h1 className={classes.title}>
          {title}
          <small className={classes.subtitle}>{subtitle}</small>
        </h1>
      </div>
      <div>
        {children}
      </div>
    </div>
  );
};

DashboardPage.propTypes = {
  classes: PropTypes.shape({}),
  children: PropTypes.array.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

export default withStyles(styles)(DashboardPage);
