import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import PropTypes from 'prop-types';
import { stringify } from 'query-string';
import cx from 'classnames';
import SETTINGS from '../settings';
import { getBugUrl, flowGraphProps } from './constants';
import DashboardPage from '../components/DashboardPage';

export default class FlowTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    await this.fetchData();
  }

  fetchData() {
    return fetch(
      `${SETTINGS.backend}/api/bz/burnup?${stringify(
        flowGraphProps.query
      )}&list=true`
    )
      .then(response => response.json())
      .then(data => this.setState({ data }));
  }

  render() {
    const tableStyle = {
      backgroundColor: 'white',
      color: 'black',
      width: '100%',
      maxWidth: '1200px',
      padding: '4em',
      margin: '0 auto',
    };
    const columns = [
      {
        Header: 'Bug',
        accessor: 'id',
        Cell: props => (
          <a
            href={getBugUrl(props.value)}
            rel="noopener noreferrer"
            target="_blank">
            {props.value}
          </a>
        ),
      },
      {
        Header: 'Date created',
        accessor: 'creation_time',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Whiteboard',
        accessor: 'whiteboard',
        minWidth: 200,
      },
      {
        Header: 'Assigned',
        accessor: 'assigned_to',
      },
      {
        Header: 'Last change time',
        accessor: 'last_change_time',
      },
    ];

    return (
      <DashboardPage
        title="Quantum"
        subtitle="P1 Bugs"
        className={cx('summary')}>
        <div style={{ backgroundColor: 'white' }}>
          <div style={tableStyle}>
            {this.state.data && (
              <ReactTable
                data={this.state.data}
                columns={columns}
                className="-striped"
              />
            )}
          </div>
        </div>
      </DashboardPage>
    );
  }
}

FlowTable.propTypes = {
  url: PropTypes.string,
};
