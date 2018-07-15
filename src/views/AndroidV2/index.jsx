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
      this.setState({
        errorMessage: 'Failed to fetch data from the backend. We have reported it.',
      });
      if (e.message === 'Failed to fetch' && process.env.NODE_ENV === 'production') {
        Raven.captureMessage('Failed to fetch the Nimbledroid data from the backend.');
        Raven.captureException(e);
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
      >
        <div className='row'>
          {Object.keys(nimbledroidData).length > 0 &&
            <NimbledroidGraphs
              nimbledroidData={nimbledroidData}
            />
          }
          {Object.keys(nimbledroidData).length === 0 && !errorMessage &&
            <h2>The backend is loading data from Nimbledroid. Thanks for waiting.</h2>
          }
          {errorMessage &&
            <h2 style={{ color: 'red' }}>{errorMessage}</h2>
          }
        </div>
      </Dashboard>
    );
  }
}
