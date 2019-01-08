import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Line } from 'react-chartjs-2';

import registerTooltip from './registerTooltip';
import DashboardPage from '../../components/DashboardPage';

const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'My First dataset',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(85,192,192,0.4)',
        borderColor: 'rgba(85,192,192,0.4)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rrgba(85,192,192,0.4)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(85,192,192,0.4)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [65, 59, 80, 81, 56, 55, 40],
      },
      {
        label: 'My second dataset',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [66, 60, 82, 83, 58, 57, 43],
      },
    ],
  };

const styles = ({
    content: {
        margin: '1rem',
    },
});

class JsTeam extends Component {
    static propTypes = {
        classes: PropTypes.shape({}).isRequired,
    };

    constructor(props) {
        super(props);
        registerTooltip();
    }

    render() {
        const { classes } = this.props;
        return (
          <DashboardPage title='JavaScript Performance dashboard'>
            <div className={classes.content}>
              <Line data={data} />
            </div>
          </DashboardPage>
        );
  }
}

export default withStyles(styles)(JsTeam);
