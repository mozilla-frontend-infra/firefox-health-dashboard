import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from './vendor/components/links';
import DashboardPage from './utils/DashboardPage';
import {
  AndroidIcon,
  BatteryIcon,
  DesktopIcon,
  FlareIcon,
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

class Home extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <DashboardPage
        classes={{
          root: classes.root,
        }}
        title="Firefox health"
        subtitle="Tracking metrics for Firefox products"
      >
        <div className={classes.links}>
          <Link to="/android">
            <AndroidIcon />
            Android
          </Link>
          <Link to="/windows/32">
            <DesktopIcon />
            Windows 32bit
          </Link>
          <Link to="/windows/64">
            <DesktopIcon />
            Windows 64bit
          </Link>
          <Link to="/power">
            <BatteryIcon />
            Power Usage
          </Link>
          <Link to="/playback">
            <VideoIcon />
            Playback
          </Link>
          <Link to="/fission">
            <FlareIcon />
            Fission
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
  }
}

Home.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(Home);
