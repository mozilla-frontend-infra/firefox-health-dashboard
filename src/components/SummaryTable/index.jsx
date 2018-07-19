import PropTypes from 'prop-types';
import GenericErrorBoundary from '../../components/genericErrorBoundary';
import StatusWidget from '../../components/StatusWidget';

const SummaryTable = ({ content = [], header }) => (
  <table className='summary-table'>
    {header && (
      <thead>
        <tr>
          <th />
          {header.map(item => <th className='column' key={item}>{item}</th>)}
        </tr>
      </thead>
    )}
    <tbody>
      {content.map(({ dataPoints = [], statusColor, summary, title, uid }) => (
        <tr key={uid}>
          <td className='title-container'>
            <StatusWidget statusColor={statusColor} title={title} />
          </td>
          {dataPoints.map((datum, index) => <td key={index}>{datum}</td>)}
          <td>{summary}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

SummaryTable.propTypes = ({
  content: PropTypes.arrayOf(PropTypes.shape({
    dataPoints: PropTypes.arrayOf(PropTypes.string),
    summary: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
  })),
  header: PropTypes.arrayOf(PropTypes.string),
});

export default SummaryTable;
