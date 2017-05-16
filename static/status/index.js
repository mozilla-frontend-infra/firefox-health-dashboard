/* global fetch */
import 'babel-polyfill';
import React from 'react';
import PropTypes from 'prop-types';
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
    }),
  )(rows);
  return (
    <div className='features'>
      <header className='table-row'>
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
      const alt = (state.alt || '')
        .replace(/\s?public/i, '')
        .trim()
        .replace(/^support/i, 'positive')
        .replace(/^mixed.*/i, 'indecisive')
        .replace(/no\ssignal.*|^u$/i, '¯\\_(ツ)_/¯')
        .replace(/^(n)$/i, '');
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
          'status-versioned': state.version,
          'status-shrug': /^no.*signals$|^u$/i.test(state.alt),
        },
      );
      let icon = null;
      if (platform === 'firefox' && state.ref) {
        icon = (
          <i
            className='icon-ref'
            title='Shipping status from platform-status.mozilla.org'
          >
            ✓
          </i>
        );
      } else if (state.bz) {
        icon = (
          <i
            className='icon-ref icon-bz'
            title='Shipping status from bugzilla'
          />
        );
      }
      return (
        <span
          key={`feature-${id}-${platform}`}
          className={tdCls}
          title={state.alt || ''}
        >
          {label}
          {icon}
        </span>
      );
    });
  return (
    <div className='table-row feature'>
      <span
        key={`feature-${id}-title`}
        className='feature-title'
      >
        <a href={entry.link} target='_blank' rel='noopener noreferrer'>
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
          title='Chrome: Firefox Missing'
          rows={
            flow(
              // filter((feature) => feature.recent),
              filter(({ firefox }) => firefox.status !== 'shipped'),
              filter(({ firefox }) => firefox.status !== 'in-development'),
              sortBy(['completeness', 'recency']),
              reverse,
            )(popular)
          }
        />,
        <Table
          key='table-popular-done'
          title='Chromestatus: Chrome Not Shipped'
          rows={
            flow(
              filter(({ firefox, chrome }) => {
                return (
                  firefox.version
                    || firefox.status === 'shipped'
                    || firefox.status === 'in-development'
                  ) && chrome.status !== 'shipped';
              }),
              sortBy(['recency']),
              reverse,
            )(popular)
          }
        />,
        <Table
          key='table-caniuse'
          title='CanIUse: FF Not Shipped'
          rows={
            flow(
              // filter((feature) => feature.recency > 0),
              filter(feature => !feature.firefox || feature.firefox.status !== 'shipped'),
              sortBy(['recency']),
              reverse,
            )(caniuse)
          }
        />,
      ];
    }
    return (
      <Dashboard
        title='Platform Feature Comparison'
        subtitle='Aggregated from chromestatus.com and caniuse.com'
        className='status-index'
      >
        {tables}
      </Dashboard>
    );
  }
}
