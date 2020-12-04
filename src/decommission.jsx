import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid/Grid';
import Container from '@material-ui/core/Container';
import WarningIcon from '@material-ui/icons/Warning';

const useStyles = makeStyles({
  box: {
    margin: 0,
    position: 'absolute',
    top: '50%',
    left: '50%',
    msTransform: 'translate(-50%, -50%)',
    transform: 'translate(-50%, -50%)',
    boxShadow: '3px 3px 5px 6px #ccc',
    borderRadius: '10px',
    padding: '0px',
  },
  title: {
    color: 'white',
    backgroundColor: 'black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px 10px 0px 0px',
  },
  message: {
    color: 'black',
    fontSize: 'larger',
    alignContent: 'center',
    padding: '5px 10px 10px 10px',
    '& a': {
      textDecoration: 'underline',
    },
  },
});

const Decommission = props => {
  const {
    title, box, message,
  } = useStyles(props);
  return (
    <Container
      direction="row"
      justify="center"
      alignItems="center"
      maxWidth="sm"
      className={box}
    >
      <Grid className={title}>
        <WarningIcon />
        <h1 style={{ marginLeft: '10px' }}>
          health.graphics has been retired
        </h1>
      </Grid>
      <Grid className={message}>
        <Grid>
          <p>
            Thank you for visiting health.graphics, the previous home of the Firefox Health Dashboard. Due to
            realignment of resources based on our current priorities, this dashboard has been unmaintained for
            some time, leading to potential misrepresentation of our metrics, and we have made the decision to
            retire the site.
          </p>

          <p>
            Many of the visualisations that were shown on this dashboard can still be found at
            {' '}
            <a href="https://arewefastyet.com/">https://arewefastyet.com</a>
            , but if there&apos;s something in particular that you&apos;re unable to find we&apos;d be happy to answer questions
            {' '}
            <a href="https://chat.mozilla.org/#/room/#firefox-health-dashboard:mozilla.org">in our public Matrix channel</a>
            .
          </p>
          <p>
            You can read more about the dashboard&apos;s retirement, or provide your feedback
            {' '}
            <a href="https://github.com/mozilla-frontend-infra/firefox-health-dashboard/issues/729">in our issue tracker</a>
            .
          </p>
          <p>
            Thank you to all
            {' '}
            <a href="https://github.com/mozilla-frontend-infra/firefox-health-dashboard/graphs/contributors">those who have contributed to health.graphics</a>
            .
          </p>
        </Grid>
      </Grid>
    </Container>
  );
};

Decommission.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
};

export default Decommission;
