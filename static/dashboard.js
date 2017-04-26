/* global fetch */
import 'babel-polyfill';
import React, { PropTypes } from 'react';
import cx from 'classnames';

const Dashboard = (props) => {
  const { title, subtitle, children, className, note, source, sourceTitle } = props;
  const empty = !children;
  const $content = (!empty) ? children : 'Loading …';
  const cls = cx('dashboard', className, {
    'state-loading': empty,
    'state-fullscreen': window.frameElement || document.fullscreen,
  });
  const link = `${location.host}${location.pathname}`;
  const $note = note ? (
    <div className='dashboard-note'>{note}</div>
  ) : null;
  const $source = source ? (
    <div className='dashboard-source'>
      Source: <a href={source} target='_new'>
        {sourceTitle}
      </a>
    </div>
  ) : null;
  return (
    <div className={cls}>
      <div className='dashboard-title'>
        <h1>
          {title}
          <small>{subtitle}</small>
        </h1>
        {$note}
        {$source}
        <div className='dashboard-link'>{link}</div>
      </div>
      <div className='dashboard-main'>
        {$content}
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  title: PropTypes.string,
  className: PropTypes.string,
  subtitle: PropTypes.string,
  note: PropTypes.string,
  source: PropTypes.string,
  sourceTitle: PropTypes.string,
};

export default Dashboard;
