import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  root: {
    color: 'black',
    backgroundColor: 'white',
  },
  whiteSpacing: {
    padding: '1em',
  },
});

// eslint-disable-next-line react/prop-types
const SectionContent = ({ classes, children }) => (
  <div className={classes.root}>
    <div className={classes.whiteSpacing}>{children}</div>
  </div>
);

export default withStyles(styles)(SectionContent);
