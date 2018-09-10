import PropTypes from 'prop-types';
import {
  generateSitesTableContent,
  siteMetrics,
  sortSitesByTargetRatio,
} from '../../utils/nimbledroid';
import GenericErrorBoundary from '../../components/genericErrorBoundary';

import SummaryTable from '../../components/SummaryTable';
import StatusWidget from '../../components/StatusWidget';

const SitesTable = ({ nimbledroidData, targetRatio }) => {
  const { tableContent, summary } = generateSitesTableContent(nimbledroidData, targetRatio);
  return (
    <div className="aligned-center sites-table">
      <GenericErrorBoundary>
        <div className="sites-overview">
          {summary.map(s => (<StatusWidget key={s.title.text} {...s} />))}
        </div>
      </GenericErrorBoundary>
      <div className="aligned-center">
        <SummaryTable
          header={['GeckoView', 'WebView', '% from target']}
          content={tableContent}
        />
      </div>
    </div>
  );
};

SitesTable.propTypes = {
  nimbledroidData: PropTypes.shape({}),
  targetRatio: PropTypes.number.isRequired,
};

export default SitesTable;
