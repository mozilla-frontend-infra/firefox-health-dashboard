import { Component } from 'react';
import cx from 'classnames';
import Raven from 'raven-js';

import BackendClient from '../../utils/BackendClient';
import Dashboard from '../../dashboard';
import NimbledroidGraphs from '../../components/NimbledroidGraphs';

export default class AndroidV2 extends Component {
  state = { nimbledroidData: {} }

  componentDidMount() {
    this.fetchAndroidData();
  }

  client = new BackendClient();

  async fetchAndroidData() {
    try {
      const nimbledroidData = await this.client.getData('nimbledroid');
      this.setState({ nimbledroidData });
    } catch (e) {
      if (e.message === 'Failed to fetch') {
        if (process.env.NODE_ENV === 'production') {
          this.setState({
            errorMessage: 'Failed to fetch data from the backend. We have reported it.',
          });
          Raven.captureMessage('Failed to fetch the Nimbledroid data from the backend.');
          Raven.captureException(e);
        } else if (process.env.NODE_ENV === 'development') {
          this.setState({
            errorMessage: 'Failed to fetch data from the backend. Check the console.',
          });
          console.error(e);
        }
      } else {
        // Unknown error; Raise it and let it report via Sentry
        throw e;
      }
    }
  }

  render() {
    const { errorMessage, nimbledroidData } = this.state;
    return (
      <Dashboard
        title='Android'
        subtitle='GeckoView vs WebView Page load (time in seconds, lower is better)'
        className={cx('summary')}
        loading={!errorMessage && Object.keys(nimbledroidData).length === 0}
      >
        <div className='row'>
          {Object.keys(nimbledroidData).length > 0 &&
            <NimbledroidGraphs
              nimbledroidData={nimbledroidData}
            />
          }
          {errorMessage &&
            <h2 style={{ color: 'red' }}>{errorMessage}</h2>
          }
        </div>
      </Dashboard>
    );
  }
}
