/* global fetch */
import 'babel-polyfill';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

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
          <aside>Target: {enrich(this.props.target)}</aside>
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
        </div>
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
      </div>
    );
  }
}

Widget.defaultProps = {
  content: 'Coming soon',
  title: 'Mission Control Metric',
  target: 'Not set',
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
  className: PropTypes.string,
  loading: PropTypes.bool,
};
