import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  root: {
    backgroundColor: 'black',
  },
});

// eslint-disable-next-line react/prop-types
const SectionHeader = ({ classes, title }) => (
  <h2 className={classes.root}>
    <span>{title}</span>
  </h2>
);

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
};

export default withStyles(styles)(SectionHeader);
