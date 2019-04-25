import React, { Component } from 'react';
import propTypes from 'prop-types';
import DashboardPage from '../components/DashboardPage';
import Section from '../components/Section';
import NimbledroidProductVersions from './NimbledroidProductVersions';
import NimbledroidSiteDrilldown from './NimbledroidSiteDrilldown';
import { CONFIG } from './config';

class NimbledroidGraphPage extends Component {
  static propTypes = {
    site: propTypes.string,
    location: propTypes.shape({
      search: propTypes.string,
    }),
  };

  render() {
    const { products } = CONFIG;
    const nimbledroidSubTitle = `${
      CONFIG.packageIdLabels[CONFIG.baseProduct]
    } vs ${CONFIG.packageIdLabels[CONFIG.compareProduct]}`;
    const site = this.props.location.search.replace('?site=', '');

    return (
      <DashboardPage title="Android" subtitle="Release criteria">
        <Section title="Nimbledroid" subtitle={nimbledroidSubTitle}>
          <NimbledroidProductVersions products={products} />
          <NimbledroidSiteDrilldown
            configuration={{
              ...CONFIG,
              site,
            }}
          />
        </Section>
      </DashboardPage>
    );
  }
}

export default NimbledroidGraphPage;
