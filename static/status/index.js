/* global fetch */
import 'babel-polyfill';
import React, { PropTypes } from 'react';
import cx from 'classnames';
import map from 'lodash/fp/map';
import filter from 'lodash/fp/filter';
import sortBy from 'lodash/fp/sortBy';
import reverse from 'lodash/fp/reverse';
import flow from 'lodash/fp/flow';
import Dashboard from '../dashboard';

const Table = ({ title, rows }) => {
  const headers = ['firefox', 'chrome', 'ie', 'safari'].map((platform) => {
    const cls = cx('feature-status', `status-${platform}`);
    return (
      <span
        key={`header-${platform}`}
        className={cls}
      >{platform}</span>
    );
  });
  const main = flow(
    map((entry) => {
      return (
        <Feature key={`feature-${entry.id}`} entry={entry} />
      );
    })
  )(rows);
  return (
    <div className='features'>
      <header className='table-row' ref='header'>
        <h2>{title}</h2>
        {headers}
      </header>
      {main}
    </div>
  );
};

Table.propTypes = {
  rows: PropTypes.array,
  title: PropTypes.string,
};

const Feature = ({ entry }) => {
  const { id } = entry;
  const cols = ['firefox', 'chrome', 'ie', 'safari']
    .map((platform) => {
      const state = entry[platform];
      const alt = (state.alt || '').replace(/\s?public/i, '');
      const label = state.version || {
        nope: alt,
        'in-development': 'Dev',
        'under-consideration': alt,
      }[state.status] || '';
      const tdCls = cx(
        'feature-status',
        `status-${platform}`,
        `status-${state.status}`,
        {
          'status-ref': platform === 'firefox' && state.ref,
          'status-bz': state.bz,
        }
      );
      let icon = null;
      if (platform === 'firefox' && state.ref) {
        icon = (
          <i className='icon-ref'>✓</i>
        );
      } else if (state.bz) {
        icon = (
          <i className='icon-ref'>✓</i>
        );
      }
      return (
        <span
          key={`feature-${id}-${platform}`}
          className={tdCls}
          title={alt || ''}
        >
          {label}
          {icon}
        </span>
      );
    });
  return (
    <div className='table-row feature'>
      <span
        key={`feature-${id}-category`}
        className='feature-category'
      >
        {entry.category}
      </span>
      <span
        key={`feature-${id}-title`}
        className='feature-title'
      >
        <a href={entry.link} target='_blank'>
          {entry.name}
        </a>
      </span>
      {cols}
    </div>
  );
};

Feature.propTypes = {
  entry: PropTypes.object,
};

export default class Status extends React.Component {
  state = {};

  componentDidMount() {
    this.fetchStatus();
  }

  async fetchStatus() {
    const popular = await (await fetch('/api/status/chrome/popular')).json();
    const caniuse = await (await fetch('/api/status/caniuse')).json();
    this.setState({ popular, caniuse });
  }

  render() {
    const { popular, caniuse } = this.state;
    let tables = null;
    if (popular) {
      tables = [
        <Table
          key='table-popular-missing'
          title='Missing Firefox in Popular'
          rows={
            flow(
              filter((feature) => !feature.caniuse),
              filter(({ firefox }) => !firefox.version && firefox.status !== 'in-development'),
              sortBy(['score', 'chrome.updated']),
              reverse
            )(popular)
          }
        />,
        <Table
          key='table-popular-done'
          title='Missing Firefox on CanIUse'
          rows={
            flow(
              filter((feature) => !feature.caniuse),
              filter(({ firefox }) => firefox.version || firefox.status === 'in-development'),
              sortBy(['score', 'chrome.updated']),
              reverse
            )(popular)
          }
        />,
        <Table
          key='table-caniuse'
          title='Missing Signals on CanIUse'
          rows={
            flow(
              sortBy(['recency', 'completeness']),
              filter((feature) => !feature.firefox || feature.firefox.status !== 'shipped'),
              reverse
            )(caniuse)
          }
        />,
      ];
    }
    return (
      <Dashboard
        title='Platform Status'
        subtitle='Features In Development'
        className='status-index'
      >
        {tables}
      </Dashboard>
    );
  }
}
