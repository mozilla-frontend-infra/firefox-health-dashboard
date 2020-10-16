import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import Grid from '@material-ui/core/Grid/Grid';

const useStyles = makeStyles({
  container: {
    backgroundColor: props => ((props.type === 'danger') ? 'red' : '#fff3cd'),
    color: props => ((props.type === 'danger') ? 'white' : '#856404'),
    fontWeight: '500',
    fontSize: 'larger',
    padding: '20px 10px',
    '& a': {
      textDecoration: 'underline',
    },
  },
});

const Banner = props => {
  const { container } = useStyles(props);
  return (
    <Grid
      container
      alignItems="center"
      direction="row"
      justify="center"
      wrap="nowrap"
      spacing="2"
      className={container}
    >
      <Grid item><WarningIcon /></Grid>
      <Grid item>{props.children}</Grid>
    </Grid>
  );
};

Banner.propTypes = {
  type: PropTypes.oneOf(['danger', 'warning']),
  children: PropTypes.node,
};

export default Banner;
