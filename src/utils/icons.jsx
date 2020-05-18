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
import CopyIconInternal from '@material-ui/icons/FilterNone';
import ImageIconInternal from '@material-ui/icons/Image';
import ChartIconInternal from '@material-ui/icons/InsertChart';
import AnnotationIconInternal from '@material-ui/icons/Announcement';
import AccountIconInternal from '@material-ui/icons/PersonOutline';
import LogoutIconInternal from '@material-ui/icons/ExitToApp';
import StarBorderInternal from '@material-ui/icons/StarBorder';
import FlareIconInternal from '@material-ui/icons/Flare';

import githubMark from '../static/GitHub-Mark.png';

const iconStyle = { verticalAlign: 'baseline', margin: '0 .2rem 0 .2rem' };
const HomeIcon = () => <HomeIconInternal style={iconStyle} />;
const TimerIcon = () => <TimerIconInternal style={iconStyle} />;
const BatteryIcon = () => <BatteryIconInternal style={iconStyle} />;
const VideoIcon = () => <VideoIconInternal style={iconStyle} />;
const DesktopIcon = () => <DesktopIconInternal style={iconStyle} />;
const AndroidIcon = () => <AndroidIconInternal style={iconStyle} />;
const FlareIcon = () => <FlareIconInternal style={iconStyle} />;
const AccountIcon = () => <AccountIconInternal style={iconStyle} />;
const LogoutIcon = () => <LogoutIconInternal style={iconStyle} />;


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

const CopyIcon = () => (
  <div
    style={{
      display: 'inline-block',
      margin: '-1rem 0',
      verticalAlign: 'middle',
    }}
  >
    <CopyIconInternal style={iconStyle} />
  </div>
);

const ImageIcon = () => (
  <div
    style={{
      display: 'inline-block',
      margin: '-1rem 0',
      verticalAlign: 'middle',
    }}
  >
    <ImageIconInternal style={iconStyle} />
  </div>
);

const ChartIcon = () => (
  <div
    style={{
      display: 'inline-block',
      margin: '-1rem 0',
      verticalAlign: 'middle',
    }}
  >
    <ChartIconInternal style={iconStyle} />
  </div>
);

const AnnotationIcon = () => (
  <div
    style={{
      display: 'inline-block',
      margin: '-1rem 0',
      verticalAlign: 'middle',
    }}
  >
    <AnnotationIconInternal style={iconStyle} />
  </div>
);
const StarIcon = () => (
  <div
    style={{
      display: 'inline-block',
      margin: '-1rem 0',
      verticalAlign: 'middle',
    }}
  >
    <StarBorderInternal style={iconStyle} />
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
  AccountIcon,
  AndroidIcon,
  AnnotationIcon,
  BatteryIcon,
  ChartIcon,
  CodeIcon,
  CopyIcon,
  DesktopIcon,
  DetailsIcon,
  FlareIcon,
  GithubIcon,
  HelpIcon,
  HomeIcon,
  ImageIcon,
  LinkIcon,
  LogoutIcon,
  StarIcon,
  TimerIcon,
  VideoIcon,
};
