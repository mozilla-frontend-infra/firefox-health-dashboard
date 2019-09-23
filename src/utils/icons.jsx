import React from 'react';
import LinkIconInternal from '@material-ui/icons/Launch';
import HomeIconInternal from '@material-ui/icons/Home';
import TimerIconInternal from '@material-ui/icons/Timer';
import BatteryIconInternal from '@material-ui/icons/BatteryChargingFull';
import VideoIconInternal from '@material-ui/icons/Videocam';
import DesktopIconInternal from '@material-ui/icons/DesktopWindows';
import AndroidIconInternal from '@material-ui/icons/PhoneAndroid';
import DetailsIconInternal from '@material-ui/icons/MoreHoriz';
import CodeIconInternal from '@material-ui/icons/Code';
import HelpIconInternal from '@material-ui/icons/Help';
import githubMark from '../static/GitHub-Mark.png';

const iconStyle = { verticalAlign: 'baseline', margin: '0 .2rem 0 .2rem' };
const HomeIcon = () => <HomeIconInternal style={iconStyle} />;
const TimerIcon = () => <TimerIconInternal style={iconStyle} />;
const BatteryIcon = () => <BatteryIconInternal style={iconStyle} />;
const VideoIcon = () => <VideoIconInternal style={iconStyle} />;
const DesktopIcon = () => <DesktopIconInternal style={iconStyle} />;
const AndroidIcon = () => <AndroidIconInternal style={iconStyle} />;
const LinkIcon = () => (
  <div
    style={{
      display: 'inline-block',
      margin: '-1rem 0',
      verticalAlign: 'middle',
    }}
  >
    <LinkIconInternal style={iconStyle} />
  </div>
);
const DetailsIcon = () => (
  <div
    style={{
      display: 'inline-block',
      margin: '-1rem 0',
      verticalAlign: 'middle',
    }}
  >
    <DetailsIconInternal style={iconStyle} />
  </div>
);
const CodeIcon = () => <CodeIconInternal style={iconStyle} />;
const HelpIcon = () => (
  <div
    style={{
      display: 'inline-block',
      margin: '-1rem 0',
      verticalAlign: 'middle',
    }}
  >
    <HelpIconInternal style={iconStyle} />
  </div>
);


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
  HelpIcon,
  HomeIcon,
};
