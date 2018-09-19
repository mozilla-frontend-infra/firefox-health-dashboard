import { Component } from 'react';
import cx from 'classnames';
import propTypes from 'prop-types';

import Dashboard from '../../dashboard';
import Section from '../../components/Section';
import NimbledroidSitesTable from '../../containers/NimbledroidSummaryTable';
import NimbledroidSiteDrilldown from '../../containers/NimbledroidSiteDrilldown';

class Android extends Component {
  static propTypes = {
    site: propTypes.string,
    location: propTypes.shape({
      search: propTypes.string,
    }),
  }

  render() {
    const targetRatio = 1.2;
    const site = this.props.location.search.replace('?site=', '');
    return (
      <Dashboard
        title="Android"
        subtitle="GeckoView vs Chrome Beta Page load (time in seconds, lower is better)"
        className={cx('summary')}
      >
        {!site && (
          <Section title='Nimbledroid'>
            <NimbledroidSitesTable
              products={[
                'org.mozilla.klar',
                'org.mozilla.focus',
                'com.chrome.beta',
              ]}
              targetRatio={targetRatio}
            />
          </Section>
        )}
        {site && (
          <Section title='Nimbledroid'>
            <NimbledroidSiteDrilldown
              products={[
                'org.mozilla.klar',
                'org.mozilla.focus',
                'com.chrome.beta',
              ]}
              targetRatio={targetRatio}
              site={site}
            />
          </Section>
        )}
      </Dashboard>
    );
  }
}

export default Android;
