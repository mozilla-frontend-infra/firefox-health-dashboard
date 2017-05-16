/* global fetch */
import 'babel-polyfill';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const Dashboard = (props) => {
  const { title, subtitle, children, className, note, source, sourceTitle, link } = props;
  const empty = !children;
  const $content = (!empty) ? children : 'Loading …';
  const cls = cx('dashboard', className, {
    'state-loading': empty,
    'state-fullscreen': window.frameElement || document.fullscreen,
  });
  const direct = `${location.host}${location.pathname}`;
  const $note = note ? (
    <div className='dashboard-note'>{note}</div>
  ) : null;
  console.log(link);
  const $link = link ? (
    <a href={link} target='_new'>
      {link.replace(/.*\/\//, '')}
    </a>
  ) : null;
  const $source = source ? (
    <div className='dashboard-source'>
      Source: <a href={source} target='_new'>
        {sourceTitle}
      </a>
      {$link}
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
  link: PropTypes.string,
};

export default Dashboard;
