import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    backgroundColor: 'white',
    padding: '2rem',
  },
  dashboardTitle: {
    borderBottom: '1px solid #fff',
  },
  title: {
    color: 'white',
    backgroundColor: 'black',
    textAlign: 'center',
    fontSize: '2rem',
    padding: '1rem 1rem .7rem 1rem',
  },
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
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

export default withStyles(styles)(DashboardPage);
