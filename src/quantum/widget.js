/* global fetch */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
// import moment from 'moment';

const enrich = (text, key = 'none') => {
  return typeof text === 'string'
    ? <span
      key={`enriched-${key}`}
      dangerouslySetInnerHTML={{
          // eslint-disable-line
        __html: text
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            .replace(
              /\[([^\]]+)\]\(([^)]+)/g,
              '<a href="$2" target="_blank" rel="noopener noreferrer">$1</em>',
            ),
      }}
    />
    : text;
};

export default class Widget extends React.Component {
  render() {
    const title = enrich(this.props.title);
    // const updated = this.props.updated && moment(this.props.updated);
    const $title = this.props.link
      ? (<a href={this.props.link} target='_blank' rel='noopener noreferrer'>
        {title}
      </a>)
      : title;
    let target = this.props.target;
    if (target) {
      target = ['Target: ', enrich(this.props.target)];
    }
    const reading = this.props.reading;
    const targetCls = ['widget-target-status'];
    let $targetStatus = null;
    if (this.props.targetStatus && this.props.targetStatus !== 'n/a') {
      const targetStatus = this.props.targetStatus;
      $targetStatus = (
        <aside className={cx(targetCls)}>
          {reading
            ? <span className='status-reading'>{reading}</span>
            : null
          }
          {targetStatus === 'pass'
            ? <span role='img' aria-label='Pass' key='icon-pass' className='status-icon'>
                😀
            </span>
            : <span role='img' aria-label='Fail' key='icon-fail' className='status-icon'>
                😟
            </span>}
        </aside>
      );
    }

    return (
      <div className={cx(`criteria-widget status-${this.props.status}`, this.props.className)}>
        <header>
          <h3>
            {$title}
          </h3>
          {$targetStatus}
        </header>
        <div
          className={cx('widget-content', {
            'state-loading': this.props.loading,
          })}
          ref={(node) => {
            if (node && this.props.viewport) {
              const rect = node.getBoundingClientRect();
              this.props.viewport([rect.width, rect.height]);
            }
          }}
        >
          {enrich(this.props.content, 'content')}
          {target &&
            <div key='target' className='widget-target'>
              {target}
            </div>}
        </div>
      </div>
    );
  }
}

Widget.defaultProps = {
  content: 'n\\a',
  title: 'Mission Control Metric',
  status: 'unknown',
  viewport: () => {},
};
Widget.propTypes = {
  content: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
  status: PropTypes.string,
  reading: PropTypes.string,
  title: PropTypes.string,
  target: PropTypes.string,
  targetStatus: PropTypes.string,
  explainer: PropTypes.string,
  commentary: PropTypes.string,
  viewport: PropTypes.func,
  link: PropTypes.string,
  updated: PropTypes.string,
  className: PropTypes.string,
  loading: PropTypes.bool,
};
