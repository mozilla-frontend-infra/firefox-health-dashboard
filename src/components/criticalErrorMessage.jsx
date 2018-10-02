import React from 'react';

const newIssue = 'https://github.com/mozilla/firefox-health-dashboard/issues/new';

const CriticalErrorMessage = () => (
  <p style={{ textAlign: 'center', fontSize: '1.5em' }}>
    <span>
There has been a critical error. We have reported it. If the issue is not fixed
      within few hours please file an issue:
    </span>
    <br />
    <a href={newIssue} target='_blank' rel='noopener noreferrer'>{newIssue}</a>
  </p>
);

export default CriticalErrorMessage;
