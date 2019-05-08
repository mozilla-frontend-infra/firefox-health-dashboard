/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import StatusWidget from './StatusWidget';

const SummaryTable = ({ content = [], header }) => (
  <table className="summary-table">
    {header && (
      <thead>
        <tr>
          <th />
          {header.map(item => (
            <th className="column" key={item}>
              {item}
            </th>
          ))}
        </tr>
      </thead>
    )}
    <tbody>
      {content.map(({ dataPoints = [], summary, title, uid }) => (
        <tr key={uid}>
          <td className="title-container">
            <StatusWidget title={title} />
          </td>
          {dataPoints.map(({ datum, statusColor }, columnIndex) => {
            const className = `status-${statusColor}`;

            return (
              <td key={columnIndex} className={className}>
                {datum}
              </td>
            );
          }) || []}
          <td>{summary}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

SummaryTable.propTypes = {
  content: PropTypes.arrayOf(
    PropTypes.shape({
      dataPoints: PropTypes.arrayOf(PropTypes.string),
      summary: PropTypes.string.isRequired,
      uid: PropTypes.string.isRequired,
    })
  ),
  header: PropTypes.arrayOf(PropTypes.string),
};

export default SummaryTable;
