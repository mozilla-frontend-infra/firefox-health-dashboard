import { Component } from 'react';
import cx from 'classnames';
import propTypes from 'prop-types';
import Raven from 'raven-js';

import BackendClient from '../../utils/BackendClient';
import Dashboard from '../../dashboard';
import SitesTable from './SitesTable';
import SiteDrillDown from './SiteDrillDown';

export default class Android extends Component {
  static propTypes = {
    site: propTypes.string,
    location: propTypes.shape({
      search: propTypes.string,
    }),
  }

  state = { nimbledroidData: {} }

  componentDidMount() {
    this.fetchAndroidData();
  }

  client = new BackendClient();

  async fetchAndroidData() {
    try {
      const nimbledroidData = await this.client.getData(
        'nimbledroid',
        { products: [
          'org.mozilla.klar',
          'org.mozilla.focus',
          'com.chrome.beta',
        ] },
      );
      this.setState({ nimbledroidData });
    } catch (e) {
      if (e.message === 'Failed to fetch') {
        this.setState({
          errorMessage: 'Failed to fetch data from the backend. We have reported it.',
        });
        if (process.env.NODE_ENV === 'production') {
          Raven.captureMessage('Failed to fetch the Nimbledroid data from the backend.');
          Raven.captureException(e);
        } else {
          console.error(e);
        }
      } else {
        throw e;
      }
    }
  }

  render() {
    const { errorMessage, nimbledroidData } = this.state;
    const numSites = Object.keys(nimbledroidData).length;
    const targetRatio = 1.2;
    // Using replace instead of query-string's parse() method allow for supporting
    // data for URLs like this "flipkart.com/search?q=moto%20g5%20plus&sid=tyy"
    // parse() would return 'flipkart.com/search?q' instead of the full url.
    const site = this.props.location.search.replace('?site=', '');
    return (
      <Dashboard
        title="Android"
        subtitle="GeckoView vs Chrome Beta Page load (time in seconds, lower is better)"
        className={cx('summary')}
      >
        <div className="android-view">
          {/* Needed until the background of the site is not black */}
          <div className="aligned-center">
            {numSites > 0 && !site && (
              <SitesTable
                nimbledroidData={nimbledroidData}
                targetRatio={targetRatio}
              />
            )}
            {errorMessage && <h2 className="error-message">{errorMessage}</h2>}
            {numSites > 0 && site && (
              <SiteDrillDown
                nimbledroidData={nimbledroidData}
                targetRatio={targetRatio}
                site={site}
              />
            )}
          </div>
        </div>
      </Dashboard>
    );
  }
}
