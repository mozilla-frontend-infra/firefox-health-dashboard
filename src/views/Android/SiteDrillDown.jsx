import PropTypes from 'prop-types';
import { siteMetrics } from '../../utils/nimbledroid';
import GenericErrorBoundary from '../../components/genericErrorBoundary';
import NimbledroidGraph from '../../components/NimbledroidGraph';
import StatusWidget from '../../components/StatusWidget';

const SiteDrillDown = ({ nimbledroidData, site, targetRatio }) => {
  const { ratio, symbol, color } = siteMetrics(
    nimbledroidData[site].GV,
    nimbledroidData[site].WV,
    targetRatio,
  );
  return (
    <GenericErrorBoundary>
      <StatusWidget
        extraInfo="Target: GeckoView <= Chrome Beta + 20%"
        statusColor={color}
        title={{
          enrich: true,
          text: site,
          hyperlink: site,
        }}
      >
        <NimbledroidGraph
          profile={nimbledroidData[site]}
          targetRatio={targetRatio}
        />
      </StatusWidget>
    </GenericErrorBoundary>
  );
};

SiteDrillDown.propTypes = ({
  nimbledroidData: PropTypes.shape({}).isRequired,
  site: PropTypes.string.isRequired,
  targetRatio: PropTypes.number.isRequired,
});

export default SiteDrillDown;
