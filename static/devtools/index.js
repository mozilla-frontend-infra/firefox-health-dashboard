/* global fetch */
import 'babel-polyfill';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { stringify } from 'query-string';
import Dashboard from './../dashboard';
import Widget from '../quantum/widget';
import Perfherder from '../quantum/perfherder';

export default class DevtoolsIndex extends React.Component {
  constructor(props) {
    super(props);
    document.body.classList.add('multipage');
  }

  render() {
    const sections = [
      {
        title: 'Simple',
        rows: [
          [
            <Perfherder
              key='inspector'
              title='Inspector'
              signatures={{
                Open: '18357f31a9a38476a54eaf17f1b03cf3deacc0e5',
                Close: '31f71c25eced354ad29660b6e7f9f4e725b5f02f',
                Reload: 'ae10d64fd856dfa03397cd6a2e17c2efd655e8be',
              }}
            />,
            <Perfherder
              key='network'
              title='Network'
              signatures={{
                Open: '60afb35fff6a07f2b71a9d8a80f46a76db921da4',
                Close: '589b06ba5672bb3200eda87c231ce2dcb428dfc0',
                Reload: 'ac8e6a6beb86b878fe1ee2685903736ea6bf63e6',
                RequestsFinished: '44a4bef9fbc06168544a8ee09342f4da73143aaa',
              }}
            />,
          ],
          [
            <Perfherder
              key='console'
              title='Console'
              signatures={{
                Open: '0307e41a1738b0a529697fb7cc6cf94a444a3585',
                Close: '61b17132972e84572192d284f77531fe4abfdf4e',
                Reload: 'e9f694021329b0c202b0a8ee6da9d63cb6234fe4',
              }}
            />,
            <Perfherder
              key='debugger'
              title='Debugger'
              signatures={{
                Open: '7f668e33f3feda038a6b5b54aad4bbbf8d0b644f',
                Close: '13c388cdad11d118a5a625eade2131fa723cc71b',
                Reload: '6287d81d630d8a118c5f346aca5db3ff1e8d9c0b',
              }}
            />,
          ],
        ],
      },
      {
        title: 'Complicated',
        rows: [
          [
            <Perfherder
              key='inspector'
              title='Inspector'
              signatures={{
                Open: '273365b480ae7add565868732d2518982467bd82',
                Close: '4b5c00ad93e6be7b9c7bee0cc03d3408dce374b2',
                Reload: '9e86a36d54e91115dc592dadb7ccc292b637b526',
              }}
            />,
            <Perfherder
              key='network'
              title='Network'
              signatures={{
                Open: '60afb35fff6a07f2b71a9d8a80f46a76db921da4',
                Close: 'f687ee347bcbdc55828148af029908049de69b7f',
                Reload: '8f2d4e9939b0373d64ab12524a70ff113665e24d',
                RequestsFinished: '57221ac36a0335e75378824a782cf24cd00eca98',
              }}
            />,
          ],
          [
            <Perfherder
              key='console'
              title='Console'
              signatures={{
                Open: '0307e41a1738b0a529697fb7cc6cf94a444a3585',
                Close: 'f9c432fa812404c24160a53113a485a55269b8b4',
                Reload: 'dc6ae04cdcc1e1611d7eceac526a1faa600f9cab',
              }}
            />,
            <Perfherder
              key='debugger'
              title='Debugger'
              signatures={{
                Open: 'b74c7b251fe25c595e7eac5f6dfc2810ba3f3e51',
                Close: 'ea37b4ffc0cfbc6c19dba91a7dc06d7bce9495bb',
                Reload: 'c7ac41c3f72dd52448268d28a76a7e316617aab4',
              }}
            />,
          ],
        ],
      },
      {
        title: 'Misc',
        rows: [
          [
            <Perfherder
              key='console'
              title='Console'
              signatures={{
                'Object Close': '8c4257891df71f6cd6d75d4589994516edfa764d',
                Bulklog: 'ac8b3fc550d14ba3c44d46aa2a697150a88f1b63',
                'Object Expand': '9391f6554797d91f3627ab46698b7b0a3d434d6b',
                Streamlog: '36c668dd021a2ef626ef86c6efc781d5f824ccc1',
                OpenWithCache: 'bba0fbd697662d1ec32e4bdde67427f4f724ee94',
              }}
            />,
            <Perfherder
              key='inspector'
              title='Inspector'
              signatures={{
                Mutations: 'c236658c1ed5bc6942a9aec574d8e0811f3596b2',
                'Cold Open': '336a60e0bef17634ef51e9d85bf67b5c991d31a6',
              }}
            />,
          ],
        ],
      },
    ];

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
