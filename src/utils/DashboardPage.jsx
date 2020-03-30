import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { Link } from '../vendor/components/links';
import { AuthContext, AuthProvider } from '../vendor/auth0/client';
import { getWindowTitle } from './helpers';
import {
  AccountIcon,
  AndroidIcon,
  BatteryIcon,
  CodeIcon,
  DesktopIcon,
  HomeIcon,
  LogoutIcon,
  VideoIcon,
} from './icons';

const styles = {
  root: {
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
  },
  titleBar: {
    color: 'white',
    backgroundColor: 'black',
    borderBottom: '1px solid #fff',
    fontWeight: 100,
    height: '3rem',
    padding: '0rem 0 0 1rem',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
  },
  subtitle: {
    color: '#d1d2d3',
    fontWeight: 400,
    margin: '.5rem .6rem .5rem',
    padding: '.5em 0',
  },
  icons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  select: {
    color: 'white',
    '&:before': {
      borderColor: 'white',
    },
    '&:after': {
      borderColor: 'white',
    },
  },
  icon: {
    fill: 'white',
  },
};

class DashboardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      version: 'nightly',
    };
  }

  chooseVersion = event => {
    this.setState({ version: event.target.value });
    console.log('version:', this.state.version);
  };

  componentDidMount() {
    document.title = getWindowTitle(this.props.title);
  }

  render() {
    const {
      classes, children, title, subtitle,
    } = this.props;

    return (
      <AuthProvider>
        <div className={classes.root}>
          <div className={classes.titleBar}>
            <h1 className={classes.title}>
              {title}
              <small className={classes.subtitle}>{subtitle}</small>
            </h1>
            <div className={classes.icons}>
              <Select
                value={this.state.version}
                onChange={this.chooseVersion}
                displayEmpty
                className={classes.select}
                inputProps={{
                  classes: {
                    icon: classes.icon,
                  },
                }}
              >
                <MenuItem value="nightly">Nightly</MenuItem>
                <MenuItem value="release">Release</MenuItem>
              </Select>
              <Link to="/" title="Home">
                <HomeIcon />
              </Link>
              <Link to="/android" title="Android Performance">
                <AndroidIcon />
              </Link>
              <Link to="/windows/64" title="Windows 64 Performance">
                <DesktopIcon />
              </Link>
              <Link to="/power" title="Power Usage">
                <BatteryIcon />
              </Link>
              <Link to="/playback" title="Playback">
                <VideoIcon />
              </Link>

              <a
                href="https://github.com/mozilla-frontend-infra/firefox-health-dashboard/"
                title="Source Code"
              >
                <CodeIcon />
              </a>
              <AuthContext.Consumer>
                {({ authenticator, cookie }) => {
                  if (!authenticator) {
                    return (
                      <AccountIcon />
                    );
                  } if (!cookie) {
                    return (
                      /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
                      <a
                        onClick={() => authenticator.authorizeWithRedirect()}
                        title="Login"
                      >
                        <AccountIcon />
                      </a>
                    );
                  }
                  return (
                    /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
                    <a
                      onClick={() => authenticator.logout()}
                      title={`logout ${authenticator.getIdToken().claims.email}`}
                    >
                      <LogoutIcon />
                    </a>
                  );
                }}
              </AuthContext.Consumer>
            </div>
          </div>
          <>{children}</>
        </div>
      </AuthProvider>
    );
  }
}
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
