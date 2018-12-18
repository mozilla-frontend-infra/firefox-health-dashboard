import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import DashboardPage from '../../components/DashboardPage';

const styles = ({
    content: {
        margin: '1rem',
    },
});

class JsTeam extends Component {
    static propTypes = {
        classes: PropTypes.shape({}).isRequired,
    };

    render() {
        const { classes } = this.props;
        return (
          <DashboardPage title='JavaScript Performance dashboard'>
            <div className={classes.content}>
              Under construction. Welcome to the future home of arewefastyet.com!
            </div>
          </DashboardPage>
        );
  }
}

export default withStyles(styles)(JsTeam);
