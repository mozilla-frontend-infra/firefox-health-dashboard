import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  root: {
    color: 'white',
    fontWeight: '400',
    margin: '.5rem .75rem .5rem',
  },
  subtitle: {
    color: '#d1d2d3',
    fontSize: '0.75rem',
    fontWeight: '300',
    paddingLeft: '.9em',
  },
});

const SectionHeader = ({ classes, title, subtitle }) => (
  <h2 className={classes.root}>
    {title}
    {subtitle && <span className={classes.subtitle}>{subtitle}</span>}
  </h2>
);

SectionHeader.propTypes = {
  classes: PropTypes.shape({}),
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
};

export default withStyles(styles)(SectionHeader);
