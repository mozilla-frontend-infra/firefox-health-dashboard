import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import PropTypes from 'prop-types';
import { stringify } from 'query-string';
import cx from 'classnames';

import Dashboard from '../dashboard';
import GraphContainer from '../components/graph-container';
import { klarTargets, graphProps } from './constants';
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
          <GenericErrorBoundary>
            <GraphContainer
              query={{ site: 'abcnews.go.com' }}
              title='abcnews.go.com'
              legend={graphProps.legend}
              baselines={[{ value: klarTargets['abcnews.go.com'], label: '+20%' }]}
              target={graphProps.target}
              api={graphProps.api}
              keys={graphProps.keys}
              width={graphProps.width}
              height={graphProps.height}
              checkStatus
              targetValue={klarTargets['abcnews.go.com']}
              targetLine='klar'
            />
          </GenericErrorBoundary>
          <GenericErrorBoundary>
            <GraphContainer
              query={{ site: 'wikia-fandom' }}
              title='wikia/fandom'
              legend={graphProps.legend}
              baselines={[{ value: klarTargets['wikia-fandom'], label: '+20%' }]}
              target={graphProps.target}
              api={graphProps.api}
              keys={graphProps.keys}
              width={graphProps.width}
              height={graphProps.height}
              checkStatus
              targetValue={klarTargets['wikia-fandom']}
              targetLine='klar'
            />
          </GenericErrorBoundary>
          <GenericErrorBoundary>
            <GraphContainer
              query={{ site: 'buzzfeed' }}
              title='buzzfeed'
              legend={graphProps.legend}
              baselines={[{ value: klarTargets.buzzfeed, label: '+20%' }]}
              target={graphProps.target}
              api={graphProps.api}
              keys={graphProps.keys}
              width={graphProps.width}
              height={graphProps.height}
              checkStatus
              targetValue={klarTargets.buzzfeed}
              targetLine='klar'
            />
          </GenericErrorBoundary>
        </div>
        <div className='row'>
          <GenericErrorBoundary>
            <GraphContainer
              query={{ site: 'yelp.de' }}
              title='yelp.de'
              legend={graphProps.legend}
              baselines={[{ value: klarTargets['yelp.de'], label: '+20%' }]}
              target={graphProps.target}
              api={graphProps.api}
              keys={graphProps.keys}
              width={graphProps.width}
              height={graphProps.height}
              checkStatus
              targetValue={klarTargets['yelp.de']}
              targetLine='klar'
            />
          </GenericErrorBoundary>
          <GenericErrorBoundary>
            <GraphContainer
              query={{ site: 'eurosport.eu' }}
              title='eurosport.eu'
              legend={graphProps.legend}
              baselines={[{ value: klarTargets['eurosport.eu'], label: '+20%' }]}
              target={graphProps.target}
              api={graphProps.api}
              keys={graphProps.keys}
              width={graphProps.width}
              height={graphProps.height}
              checkStatus
              targetValue={klarTargets['eurosport.eu']}
              targetLine='klar'
            />
          </GenericErrorBoundary>
          <GenericErrorBoundary>
            <GraphContainer
              query={{ site: 'm.ranker.com' }}
              title='m.ranker.com'
              legend={graphProps.legend}
              baselines={[{ value: klarTargets['m.ranker.com'], label: '+20%' }]}
              target={graphProps.target}
              api={graphProps.api}
              keys={graphProps.keys}
              width={graphProps.width}
              height={graphProps.height}
              checkStatus
              targetValue={klarTargets['m.ranker.com']}
              targetLine='klar'
            />
          </GenericErrorBoundary>
        </div>
      </Dashboard>
    );
  }
}
