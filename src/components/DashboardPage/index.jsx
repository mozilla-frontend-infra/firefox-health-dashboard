import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import githubMark from '../../static/GitHub-Mark.png';

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
    height: '3rem',
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
      <h1 style={{ display: 'inline' }}>
        {title}
        <small className={classes.subtitle}>{subtitle}</small>
      </h1>
      <span style={{ float: 'right' }}>
        <a href="https://github.com/mozilla-frontend-infra/firefox-health-dashboard/">
          <img
            src={githubMark}
            alt="Go to Github Repo"
            style={{ width: '2rem', padding: '0 0.5rem 0 0' }}
          />
        </a>
      </span>
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
