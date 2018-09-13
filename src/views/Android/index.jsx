import { Component } from 'react';
import cx from 'classnames';
import propTypes from 'prop-types';
import Raven from 'raven-js';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import CriticalErrorMessage from '../../components/criticalErrorMessage';
import BackendClient from '../../utils/BackendClient';
import Dashboard from '../../dashboard';
import SummaryTable from '../../components/SummaryTable';
import SiteDrillDown from './SiteDrillDown';
import StatusWidget from '../../components/StatusWidget';
import { generateSitesTableContent } from '../../utils/nimbledroid';

const styles = () => ({
  button: {},
  sitesSummary: {
    width: '400px',
  },
});

class Android extends Component {
  static propTypes = {
    site: propTypes.string,
    location: propTypes.shape({
      search: propTypes.string,
    }),
  }

  state = {
    nimbledroidData: {},
    showSites: false,
  }

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
        this.setState({ errorMessage: true });
        if (process.env.NODE_ENV === 'production') {
          Raven.captureMessage('Failed to fetch the Nimbledroid data from the backend.');
          Raven.captureException(e);
        } else {
          console.error(e);
        }
      } else {
        this.setState({ errorMessage: true });
        throw e;
      }
    }
  }

  render() {
    const { errorMessage, nimbledroidData } = this.state;
    const numSites = Object.keys(nimbledroidData).length;
    const targetRatio = 1.2;
    const { tableContent, summary } = generateSitesTableContent(nimbledroidData, targetRatio);
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
              <div className="aligned-center">
                {!this.state.showSites && (
                  <div className={this.props.classes.sitesSummary}>
                    <Button
                      className={this.props.classes.button}
                      onClick={() => this.setState({ showSites: true })}
                    >Show detail view</Button>
                    {summary.map(s => (<StatusWidget key={s.title.text} {...s} />))}
                  </div>
                )}
                {this.state.showSites && (
                  <div className="aligned-center">
                    <Button
                      className={this.props.classes.button}
                      onClick={() => this.setState({ showSites: false })}
                    >Show summary view</Button>
                    <SummaryTable
                      header={['GeckoView', 'WebView', 'Chrome beta', '% from target']}
                      content={tableContent}
                    />
                  </div>
                )}
              </div>
            )}
            {errorMessage && <CriticalErrorMessage />}
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

export default withStyles(styles)(Android);
