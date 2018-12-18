import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DashboardPage from './components/DashboardPage';

const styles = {
  links: {
    color: 'white',
    backgroundColor: 'black',
    lineHeight: '3rem',
    fontSize: '2rem',
    display: 'flex',
    flex: '1',
    flexDirection: 'column',
    padding: '10rem 0 0 0',
    textAlign: 'center',
  },
};

const Home = ({ classes }) => (
  <DashboardPage
    title='Firefox health'
    subtitle='Tracking metrics for Firefox products'
  >
    <div className={classes.links}>
      <Link to='/android'>Android</Link>
      <Link to='/quantum/32'>Quantum 32bit</Link>
      <Link to='/quantum/64'>Quantum 64bit</Link>
      <Link to='/js-team'>JS team</Link>
    </div>
  </DashboardPage>
);

Home.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(Home);
