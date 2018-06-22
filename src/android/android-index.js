import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import PropTypes from 'prop-types';
import { stringify } from 'query-string';
import cx from 'classnames';

import Dashboard from '../dashboard';
import GraphContainer from '../components/graph-container';
import config from './constants';
import GenericErrorBoundary from '../components/genericErrorBoundary';

export default class AndroidIndex extends React.Component {
  render() {
    return (
      <Dashboard
        title='Android'
        subtitle='GeckoView vs WebView Page load (time in seconds, lower is better)'
        className={cx('summary')}
      >
        <div className='row'>
          {[config.abcnews, config.wikiaFandom, config.buzzfeed].map(siteConfig => (
            <GenericErrorBoundary>
              <GraphContainer {...siteConfig} />
            </GenericErrorBoundary>
          ))}
        </div>
        <div className='row'>
          {[config.yelp, config.eurosport, config.ranker].map(siteConfig => (
            <GenericErrorBoundary>
              <GraphContainer {...siteConfig} />
            </GenericErrorBoundary>
          ))}
        </div>
        <div className='row'>
          {[config.healthyway, config.fashionbeans, config.lifehacker].map(siteConfig => (
            <GenericErrorBoundary>
              <GraphContainer {...siteConfig} />
            </GenericErrorBoundary>
          ))}
        </div>
        <div className='row'>
          {[config.spiegel, config.nytimes, config.reddit].map(siteConfig => (
            <GenericErrorBoundary>
              <GraphContainer {...siteConfig} />
            </GenericErrorBoundary>
          ))}
        </div>
        <div className='row'>
          {[config.wired, config.guardian, config.medium].map(siteConfig => (
            <GenericErrorBoundary>
              <GraphContainer {...siteConfig} />
            </GenericErrorBoundary>
          ))}
        </div>
        <div className='row'>
          {[config.washingtonpost, config.cnbc, config.gizmodo].map(siteConfig => (
            <GenericErrorBoundary>
              <GraphContainer {...siteConfig} />
            </GenericErrorBoundary>
          ))}
        </div>
        <div className='row'>
          {[config.facebook, config.flipkart, config.twitter].map(siteConfig => (
            <GenericErrorBoundary>
              <GraphContainer {...siteConfig} />
            </GenericErrorBoundary>
          ))}
        </div>
        <div className='row'>
          {[config.googlemaps, config.urbandictionary, config.glassdoor].map(siteConfig => (
            <GenericErrorBoundary>
              <GraphContainer {...siteConfig} />
            </GenericErrorBoundary>
          ))}
        </div>
        <div className='row'>
          {[config.wikipedia, config.imgur, config.amazon].map(siteConfig => (
            <GenericErrorBoundary>
              <GraphContainer {...siteConfig} />
            </GenericErrorBoundary>
          ))}
        </div>
        <div className='row'>
          {[config.yelpdotcom, config.zalando, config.ebaydotDE].map(siteConfig => (
            <GenericErrorBoundary>
              <GraphContainer {...siteConfig} />
            </GenericErrorBoundary>
          ))}
        </div>
        <div className='row'>
          {[config.expedia, config.booking, config.tripadvisor].map(siteConfig => (
            <GenericErrorBoundary>
              <GraphContainer {...siteConfig} />
            </GenericErrorBoundary>
          ))}
        </div>
        <div className='row'>
          {[config.rumble, config.google].map(siteConfig => (
            <GenericErrorBoundary>
              <GraphContainer {...siteConfig} />
            </GenericErrorBoundary>
          ))}
        </div>
      </Dashboard>
    );
  }
}
