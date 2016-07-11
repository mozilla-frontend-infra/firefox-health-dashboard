/* global fetch */
import 'babel-polyfill';
import React, { PropTypes } from 'react';
import cx from 'classnames';

const Dashboard = (props) => {
  const { title, subtitle, children, className } = props;
  const empty = !children;
  const content = (!empty) ? children : 'Loading …';
  const cls = cx('dashboard', className, {
    'state-loading': empty,
    'state-fullscreen': window.frameElement || document.fullscreen,
  });
  const link = `${location.host}${location.pathname}`;
  return (
    <div className={cls}>
      <div className='dashboard-title'>
        <h1>
          {title}
          <small>{subtitle}</small>
        </h1>
        <div className='dashboard-link'>{link}</div>
      </div>
      <div className='dashboard-main'>
        {content}
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  title: PropTypes.string,
  className: PropTypes.string,
  subtitle: PropTypes.string,
};

export default Dashboard;
