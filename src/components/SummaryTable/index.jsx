/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import StatusWidget from '../StatusWidget';
import CONFIG from '../../utils/nimbledroid/config';
import { fluent } from '../../vendor/fluent';

const SummaryTable = ({ content = [], header }) => {
  const compareName = CONFIG.packageIdLabels[CONFIG.baseProduct];
  const compareColumn = fluent(header).findIndex(name => name === compareName);

  return (
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
        {content.map(
          ({ dataPoints = [], statusColor, summary, title, uid }) => (
            <tr key={uid}>
              <td className="title-container">
                <StatusWidget statusColor={statusColor} title={title} />
              </td>
              {dataPoints.map((datum, columnIndex) => {
                const className =
                  columnIndex === compareColumn ? `status-${statusColor}` : '';

                return (
                  <td key={columnIndex} className={className}>
                    {datum}
                  </td>
                );
              })}
              <td>{summary}</td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
};

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
