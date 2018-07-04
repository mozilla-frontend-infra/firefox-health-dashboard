import PropTypes from 'prop-types';
import NimbledroidWidget from '../NimbledroidWidget';
import GenericErrorBoundary from '../../components/genericErrorBoundary';

const NimbledroidGraphs = ({ nimbledroidData }) => (
  nimbledroidData ?
    (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
          gridGap: '0.1em',
          width: '100%',
        }}
      >
        {Object.keys(nimbledroidData).map(profileName => (
          <GenericErrorBoundary key={profileName}>
            <NimbledroidWidget
              key={profileName}
              profile={nimbledroidData[profileName]}
            />
          </GenericErrorBoundary>
        ))}
      </div>
    )
  : undefined
);

NimbledroidGraphs.propTypes = {
  nimbledroidData: PropTypes.shape({}),
};

export default NimbledroidGraphs;
