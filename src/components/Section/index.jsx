import React from 'react';
import PropTypes from 'prop-types';
import SectionHeader from '../SectionHeader';
import SectionContent from '../SectionContent';

const Section = ({ children, subtitle, title }) => (
  <div>
    <SectionHeader title={title} subtitle={subtitle} />
    <SectionContent>{children}</SectionContent>
  </div>
);

Section.propTypes = {
    children: PropTypes.shape({}).isRequired,
    subtitle: PropTypes.string,
    title: PropTypes.string.isRequired,
};

export default Section;
