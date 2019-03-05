import React from 'react';
import ErrorPanel from '@mozilla-frontend-infra/components/ErrorPanel';

const newIssue =
  'https://github.com/mozilla/firefox-health-dashboard/issues/new';

export const CriticalErrorMessage = () => (
  <p style={{ textAlign: 'center', fontSize: '1.5em' }}>
    <span>
      There has been a critical error. We have reported it. If the issue is not
      fixed within few hours please file an issue:
    </span>
    <br />
    <a href={newIssue} target="_blank" rel="noopener noreferrer">
      {newIssue}
    </a>
  </p>
);

export const DefaultErrorMessage = props => (
  <ErrorPanel
    className={props.style}
    error="Something went wrong, please try again later."
  />
);

export const MissingDataErrorMessage = props => (
  <ErrorPanel
    className={props.style}
    error="This item has been missing data for at least 3 days."
  />
);

export const InvalidUrlMessage = () => (
  <p style={{ textAlign: 'center', fontSize: '1.5em' }}>
    <span>You have entered an invalid URL.</span>
  </p>
);
