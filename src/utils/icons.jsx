import React from 'react';
import LinkIco from '@material-ui/icons/Launch';
import HomeIco from '@material-ui/icons/Home';
import TimerIco from '@material-ui/icons/Timer';
import BatteryIco from '@material-ui/icons/BatteryChargingFull';
import VideoIco from '@material-ui/icons/Videocam';
import DesktopIco from '@material-ui/icons/DesktopWindows';
import AndroidIco from '@material-ui/icons/PhoneAndroid';
import DetailsIco from '@material-ui/icons/MoreHoriz';
import CodeIco from '@material-ui/icons/Code';
import githubMark from '../static/GitHub-Mark.png';

const iconStyle = { verticalAlign: 'baseline', margin: '0 .2rem 0 .2rem' };
const HomeIcon = () => <HomeIco style={iconStyle} />;
const TimerIcon = () => <TimerIco style={iconStyle} />;
const BatteryIcon = () => <BatteryIco style={iconStyle} />;
const VideoIcon = () => <VideoIco style={iconStyle} />;
const DesktopIcon = () => <DesktopIco style={iconStyle} />;
const AndroidIcon = () => <AndroidIco style={iconStyle} />;
const LinkIcon = () => (
  <div
    style={{
      display: 'inline-block',
      margin: '-1rem 0',
      verticalAlign: 'middle',
    }}>
    <LinkIco style={iconStyle} />
  </div>
);
const DetailsIcon = () => (
  <div
    style={{
      display: 'inline-block',
      margin: '-1rem 0',
      verticalAlign: 'middle',
    }}>
    <DetailsIco style={iconStyle} />
  </div>
);
const CodeIcon = () => <CodeIco style={iconStyle} />;
const GithubIcon = () => (
  <img
    src={githubMark}
    alt="octo-cat"
    style={{ verticalAlign: 'top', width: '1.5rem' }}
  />
);

export {
  LinkIcon,
  TimerIcon,
  BatteryIcon,
  VideoIcon,
  DesktopIcon,
  AndroidIcon,
  DetailsIcon,
  GithubIcon,
  CodeIcon,
  HomeIcon,
};
