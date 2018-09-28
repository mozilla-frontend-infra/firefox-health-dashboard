/* global fetch */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import LinearIndeterminate from './components/LinearIndeterminate';

const Dashboard = (props) => {
  const {
    title, subtitle, children, className, note, source, sourceTitle, link,
  } = props;
  const empty = !children;
  const $content = !empty ? children : 'Loading …';
  const cls = cx('dashboard', className, {
    'state-loading': empty,
    'state-fullscreen': window.frameElement || document.fullscreen,
  });
  const $note = note ? <div className='dashboard-note'>{note}</div> : null;
  const $link = link
    ? (
      <a href={link} target='_new'>
        {link.replace(/.*\/\//, '')}
      </a>
)
    : null;
  const $source = source
    ? (
      <div className='dashboard-source'>
        Source:
        {' '}
        <a href={source} target='_new' rel='noopener noreferrer'>
          {sourceTitle}
        </a>
        {$link}
      </div>
)
    : null;
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
      {props.loading && <LinearIndeterminate />}
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
  loading: PropTypes.bool,
};

export default Dashboard;
