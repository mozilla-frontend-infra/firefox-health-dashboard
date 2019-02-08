import React from 'react';
import PropTypes from 'prop-types';
import Title from './Title';

const StatusWidget = ({
  children,
  extraInfo,
  title,
  statusColor,
  summary,
  uid,
}) => (
  <div>
    <div
      key={uid || title.text}
      className={`status-widget status-${statusColor} padded`}>
      <Title {...title} />
      {summary && <span>{summary}</span>}
    </div>
    {children && <div>{children}</div>}
    {extraInfo && <div>{extraInfo}</div>}
  </div>
);

StatusWidget.propTypes = {
  children: PropTypes.shape({}),
  extraInfo: PropTypes.string,
  title: PropTypes.shape({
    text: PropTypes.string,
  }).isRequired,
  statusColor: PropTypes.string.isRequired,
  summary: PropTypes.string,
  uid: PropTypes.string,
};

export default StatusWidget;
