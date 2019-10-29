/* eslint-disable camelcase */
import React from 'react';
import ReactQRCode from 'qrcode.react';
import { Log } from '../logs';
import { coalesce } from '../utils';

class QRCode extends React.Component {
  constructor(props, ...args) {
    super(props, ...args);
    const { onDone } = this.props;
    this.state = {
      url: null, user_code: null, fail: false, onDone: coalesce(onDone, () => 0),
    };
  }

  async componentDidMount() {
    const { onDone } = this.state;
    try {
      const { verification_uri_complete: url, user_code, isDone } = await this.props.auth0.authorizeWithDevice();
      this.setState({ url, user_code });
      try {
        await isDone.wait();
        this.setState({ url: null });
      } catch (e) {
        Log.warning('problem with code', e);
        this.setState({ fail: true });
      } finally {
        onDone();
      }
    } catch (e) {
      Log.warning('do not know how to handle QR code request failure', e);
      this.setState({ fail: true });
    }
  }

  render() {
    const { url, user_code, fail } = this.state;
    if (fail) return (<div>FAIL</div>);
    if (!url) return (<div>...</div>);
    return (
      <a href={url}>
        <div><ReactQRCode value={url} /></div>
        <div>{user_code}</div>
      </a>
    );
  }
}

// eslint-disable-next-line import/prefer-default-export
export { QRCode };
