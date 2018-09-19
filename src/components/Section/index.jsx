import PropTypes from 'prop-types';
import SectionHeader from '../SectionHeader';
import SectionContent from '../SectionContent';

const Section = ({ title, children }) => (
  <div>
    <SectionHeader title={title} />
    <SectionContent>{children}</SectionContent>
  </div>
);

Section.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.shape({}).isRequired,
};

export default Section;
