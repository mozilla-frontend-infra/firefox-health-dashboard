/* eslint-disable linebreak-style */
import React, { Component } from 'react';
import Chart from 'react-chartjs-2';
import { frum } from '../vendor/queryOps';
import { missing } from '../vendor/utils';
import { withNavigation } from '../vendor/utils/navigation';
import { TP6_TESTS, TP6M_PAGES } from '../quantum/config';
import { getData } from '../vendor/perfherder';
import generateOptions from '../utils/chartJs/generateOptions';

class TP6mAggregate extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    // ALL LOADTIME FOR ALL SUITES IN SET

    // WHAT ARE THE SIGNATURES OF THE loadtime?
    const data = await getData(frum(TP6M_PAGES).select('framework'), {
      and: [
        { in: { test: frum(TP6_TESTS).select('id') } },
        {
          or: frum(TP6M_PAGES).select({
            eq: ['suite', 'framework', 'platform'],
          }),
        },
      ],
    });

    this.setState({ data });

    // DAILY AGGREGATE
    // SET NORMALIZATION CONSTANTS
  }

  render() {
    const { data } = this.state;

    if (missing(data)) return null;

    return (
      <Chart type="line" data={data} height="200" options={generateOptions()} />
    );
  }
}

export default withNavigation()(TP6mAggregate);
