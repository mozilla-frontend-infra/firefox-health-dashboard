/* global fetch */
import 'babel-polyfill';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import moment from 'moment';

const enrich = (text) => {
  return (typeof text === 'string')
    ? (
      <span
        dangerouslySetInnerHTML={{ // eslint-disable-line
          __html: text
            .replace(
              /\*([^*]+)\*/g,
              '<em>$1</em>',
            )
            .replace(
              /\[([^\]]+)\]\(([^)]+)/g,
              '<a href="$2" target="_blank" rel="noopener noreferrer">$1</em>',
            ),
        }}
      />
    )
    : text;
};

export default class Widget extends React.Component {
  render() {
    const title = enrich(this.props.title);
    const updated = this.props.updated && moment(this.props.updated);
    const $title = (this.props.link)
      ? (
        <a
          href={this.props.link}
          target='_blank'
          rel='noopener noreferrer'
        >
          {title}
        </a>
      )
      : title;
    return (
      <div
        className={cx(
        `criteria-widget status-${this.props.status}`,
        this.props.className,
      )}
      >
        <header>
          <h3>{$title}</h3>
          {
            this.props.target &&
              <aside>Target: {enrich(this.props.target)}</aside>
          }
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
          {enrich(this.props.content)}
          {
            this.props.explainer &&
              <div
                className='widget-explainer'
              >
                {enrich(this.props.explainer)}
              </div>
          }
          {
            this.props.commentary &&
              <div
                className='widget-commentary'
              >
                {enrich(this.props.commentary)}
              </div>
          }
          {
            updated &&
            <div
              className='widget-updated'
            >
              Last triage on {updated.format('MMM Do')}
            </div>
          }
        </div>
      </div>
    );
  }
}

Widget.defaultProps = {
  content: 'n\\a',
  title: 'Mission Control Metric',
  status: 'unknown',
};
Widget.propTypes = {
  content: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
  status: PropTypes.string,
  title: PropTypes.string,
  target: PropTypes.string,
  explainer: PropTypes.string,
  commentary: PropTypes.string,
  viewport: PropTypes.function,
  link: PropTypes.string,
  updated: PropTypes.string,
  className: PropTypes.string,
  loading: PropTypes.bool,
};
