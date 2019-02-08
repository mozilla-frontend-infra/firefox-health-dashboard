import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit * 0.3,
  },
  text: {
    padding: `0 ${theme.spacing.unit * 2}px`,
  },
});
const BugzillaQueryUrl = ({ bugCount, classes, text, url }) => (
  <a href={url} target="_blank" rel="noopener noreferrer">
    {!bugCount && <Typography className={classes.padding}>{text}</Typography>}
    {bugCount && (
      <Badge color="primary" badgeContent={bugCount} className={classes.margin}>
        <Typography className={classes.text}>{text}</Typography>
      </Badge>
    )}
  </a>
);

BugzillaQueryUrl.propTypes = {
  bugCount: PropTypes.number,
  classes: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default withStyles(styles)(BugzillaQueryUrl);
