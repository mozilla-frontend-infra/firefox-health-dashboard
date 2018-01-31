/* global fetch */
import 'babel-polyfill';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { stringify } from 'query-string';
import Dashboard from './../dashboard';
import Widget from '../quantum/widget';
import Perfherder from '../quantum/perfherder';
import Damp from './damp';

export default class DevtoolsIndex extends React.Component {
  constructor(props) {
    super(props);
    document.body.classList.add('multipage');
  }

  render() {
    const sections = Object.keys(Damp).map((title) => {
      const rows = Damp[title];
      return {
        title: title,
        rows: rows.map((tests) => {
          return Object.keys(tests).map((test) => {
            return [
              <Perfherder
                key={test}
                title={test}
                status='blue'
                signatures={{
                  DAMP: tests[test],
                }}
                target=''
              />,
            ];
          });
        }),
      };
    });

    let rowIdx = 0;
    const $content = sections.reduce((reduced, { title, rows, cssRowSecondClass }, sectionId) => {
      const add = [];
      for (const widgets of rows) {
        let className = 'row';
        // Add 2nd class if indicated
        className += (cssRowSecondClass) ? ` ${cssRowSecondClass}` : '';
        rowIdx += 1;
        add.push(
          <div className={className} key={`row-${rowIdx}`}>
            {widgets}
          </div>,
        );
      }
      add.unshift(
        <h2 key={sectionId}>
          <span>
            {title}
          </span>
        </h2>,
      );
      return reduced.concat(add);
    }, []);

    const $dashboard = (
      <Dashboard
        title='Firefox DevTools'
        subtitle='Perf Tracking'
        className={cx('summary')}
      >
        {$content}
      </Dashboard>
    );

    return $dashboard;
  }
}

DevtoolsIndex.propTypes = {
  location: PropTypes.object,
};
