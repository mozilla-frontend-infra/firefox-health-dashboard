import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  root: {
    color: '#d1d2d3',
    fontWeight: '300',
    margin: '.5rem .75rem .5rem',
  },
});

const SectionHeader = ({ classes, title }) => (
  <h2 className={classes.root}>{title}</h2>
);

SectionHeader.propTypes = {
  classes: PropTypes.shape({}),
  title: PropTypes.string.isRequired,
};

export default withStyles(styles)(SectionHeader);
