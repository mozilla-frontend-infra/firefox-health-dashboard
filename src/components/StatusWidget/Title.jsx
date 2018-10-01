import React from 'react';
import PropTypes from 'prop-types';

const Title = ({
  enrich, hyperlink, text, tooltip,
}) => {
  const className = enrich ? 'enrich' : '';
  const span = <span className={className}>{text}</span>;
  return (hyperlink)
    ? <a href={hyperlink} title={tooltip || hyperlink}>{span}</a> : span;
};

Title.propTypes = ({
  enrich: PropTypes.bool,
  hyperlink: PropTypes.string,
  text: PropTypes.string.isRequired,
  tooltip: PropTypes.string,
});

export default Title;
