import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import DashboardPage from '../../components/DashboardPage';
import BugzillaBurndown from '../../containers/BugzillaBurndown';
import BugzillaUrlContainer from '../../containers/BugzillaUrlContainer';

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
            <BugzillaUrlContainer
              includeBugCount
              queries={[
                {
                    text: 'All Fx66 perf bugs',
                    parameters: {
                        o1: 'equals',
                        v1: '1513237',
                        f1: 'blocked',
                        resolution: ['FIXED', 'VERIFIED'],
                    },
                },
              ]}
            />
            <BugzillaBurndown
              queries={[
                {
                    label: 'Open Fx66 perf bugs',
                    parameters: {
                        blocks: '1513237',
                        resolution: '---',
                    },
                },
                {
                    label: 'Closed Fx66 perf bugs',
                    parameters: {
                        blocks: '1513237',
                        resolution: ['FIXED', 'VERIFIED'],
                    },
                },
              ]}
              title='Firefox 66 performance issues'
            />
          </DashboardPage>
        );
  }
}

export default withStyles(styles)(JsTeam);
