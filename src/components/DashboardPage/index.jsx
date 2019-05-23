import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import {
  AndroidIcon,
  BatteryIcon,
  DesktopIcon,
  CodeIcon,
  HomeIcon,
} from '../../utils/icons';

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
    padding: '1rem 0 0 1rem',
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
      <div style={{ padding: '0 1rem 0 0', float: 'right' }}>
        <Link to="/" title="Home">
          <HomeIcon />
        </Link>
        <Link to="/android" title="Android Performance">
          <AndroidIcon />
        </Link>
        <Link to="/quantum/64" title="Quantum 64 Performance">
          <DesktopIcon />
        </Link>
        <Link to="/battery" title="Power Usage">
          <BatteryIcon />
        </Link>
        <a
          href="https://github.com/mozilla-frontend-infra/firefox-health-dashboard/"
          title="Source Code">
          <CodeIcon />
        </a>
      </div>
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
