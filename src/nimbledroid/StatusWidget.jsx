import React from 'react';
import PropTypes from 'prop-types';

const Title = ({ enrich, hyperlink, text, tooltip }) => {
  const className = enrich ? 'enrich' : '';
  const span = <span className={className}>{text}</span>;

  return hyperlink ? (
    <a href={hyperlink} title={tooltip || hyperlink}>
      {span}
    </a>
  ) : (
    span
  );
};

Title.propTypes = {
  enrich: PropTypes.bool,
  hyperlink: PropTypes.string,
  text: PropTypes.string.isRequired,
  tooltip: PropTypes.string,
};

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
