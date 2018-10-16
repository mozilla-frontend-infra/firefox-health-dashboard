import React, { Component } from 'react';
import propTypes from 'prop-types';

import DashboardPage from '../../components/DashboardPage';
import Section from '../../components/Section';
import NimbledroidProductVersions from '../../containers/NimbledroidProductVersions';
import NimbledroidSiteDrilldown from '../../containers/NimbledroidSiteDrilldown';

class NimbledroidGraph extends Component {
  static propTypes = {
    site: propTypes.string,
    location: propTypes.shape({
      search: propTypes.string,
    }),
  };

  render() {
    const products = [
      'org.mozilla.klar',
      'com.chrome.beta',
    ];
    const targetRatio = 1.2;
    const site = this.props.location.search.replace('?site=', '');
    return (
      <DashboardPage title='Android' subtitle='Release criteria'>
        <Section title='Nimbledroid' subtitle='GeckoView vs Chrome Beta'>
          <NimbledroidProductVersions products={products} />
          <NimbledroidSiteDrilldown
            configuration={{
            baseProduct: 'org.mozilla.klar',
            compareProduct: 'com.chrome.beta',
            products: products,
            site: site,
            targetRatio: targetRatio,
            }}
          />
        </Section>
      </DashboardPage>
    );
  }
}

export default NimbledroidGraph;
