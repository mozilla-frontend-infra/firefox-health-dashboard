import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from './vendor/components/links';
import DashboardPage from './utils/DashboardPage';
import {
  AndroidIcon,
  BatteryIcon,
  DesktopIcon,
  VideoIcon,
} from './utils/icons';

const styles = {
  root: {
    color: 'white',
    backgroundColor: 'black',
    height: '100%',
  },
  links: {
    lineHeight: '3rem',
    fontSize: '2rem',
    display: 'flex',
    flex: '1',
    flexDirection: 'column',
    padding: '10rem 0 0 0',
    textAlign: 'center',
  },
  netlify: {
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: '100%',
    textAlign: 'center',
  },
};
const Home = ({ classes }) => (
  <DashboardPage
    classes={{
      root: classes.root,
    }}
    title="Firefox health"
    subtitle="Tracking metrics for Firefox products">
    <div className={classes.links}>
      <Link to="/android">
        <AndroidIcon /> Android
      </Link>
      <Link to="/quantum/32">
        <DesktopIcon /> Quantum 32bit
      </Link>
      <Link to="/quantum/64">
        <DesktopIcon /> Quantum 64bit
      </Link>
      <Link to="/power">
        <BatteryIcon /> Power Usage
      </Link>
      <Link to="/playback">
        <VideoIcon /> Playback
      </Link>
    </div>
    <div className={classes.netlify}>
      <a href="https://www.netlify.com">
        <img
          src="https://www.netlify.com/img/global/badges/netlify-dark.svg"
          alt="Netlify"
        />
      </a>
    </div>
  </DashboardPage>
);

Home.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(Home);
