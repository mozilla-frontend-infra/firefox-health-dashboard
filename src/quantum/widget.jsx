/* global fetch */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Link } from '../vendor/utils/links';
import { DetailsIcon } from '../utils/icons';

const enrich = (text, key = 'none') =>
  typeof text === 'string' ? (
    <span
      key={`enriched-${key}`}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: text
          .replace(/\*([^*]+)\*/g, '<em>$1</em>')
          .replace(
            /\[([^\]]+)\]\(([^)]+)/g,
            '<a href="$2" target="_blank" rel="noopener noreferrer">$1</em>'
          ),
      }}
    />
  ) : (
    text
  );

export default class Widget extends React.Component {
  render() {
    const title = enrich(this.props.title);
    // const updated = this.props.updated && moment(this.props.updated);
    const $title = this.props.link ? (
      <a href={this.props.link} target="_blank" rel="noopener noreferrer">
        {title}
      </a>
    ) : (
      title
    );
    let $secondTitle;

    if (this.props.secondLink) {
      $secondTitle = (
        <Link to={this.props.secondLink} title="show details">
          <DetailsIcon />
        </Link>
      );
    } else {
      $secondTitle = '';
    }

    let { target } = this.props;

    if (target) {
      target = ['Target: ', enrich(this.props.target)];
    }

    const { reading } = this.props;
    let $targetStatus = null;

    if (this.props.targetStatus && this.props.targetStatus !== 'null,') {
      const { targetStatus } = this.props;

      $targetStatus = (
        <aside className="widget-target-status">
          {reading ? <span className="status-reading">{reading}</span> : null}
          {targetStatus === 'pass' ? (
            <span
              role="img"
              aria-label="Pass"
              key="icon-pass"
              className="status-icon">
              😀
            </span>
          ) : (
            <span
              role="img"
              aria-label="Fail"
              key="icon-fail"
              className="status-icon">
              😟
            </span>
          )}
        </aside>
      );
    }

    return (
      <div
        className={cx(
          `criteria-widget status-${this.props.status}`,
          this.props.className
        )}>
        <header className="sides-padding">
          <div>
            <h3>{$title}</h3>
            <span className="sides-padding">{$secondTitle}</span>
          </div>
          {$targetStatus}
        </header>
        <div
          className={cx('widget-content', {
            'state-loading': this.props.loading,
          })}
          ref={node => {
            if (node && this.props.viewport) {
              const rect = node.getBoundingClientRect();

              this.props.viewport([rect.width, rect.height]);
            }
          }}>
          {this.props.children}
          {this.props.content && enrich(this.props.content, 'content')}
          {target && (
            <div key="target" className="widget-target">
              {target}
            </div>
          )}
        </div>
      </div>
    );
  }
}

Widget.defaultProps = {
  children: null,
  content: null,
  title: 'Mission Control Metric',
  status: 'unknown',
  viewport: () => {},
};
Widget.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  content: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
  status: PropTypes.string,
  reading: PropTypes.string,
  title: PropTypes.string,
  secondLink: PropTypes.string,
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
