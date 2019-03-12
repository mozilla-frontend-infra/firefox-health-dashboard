import Raven from 'raven-js';
import React from 'react';

let handleError = (error, info) => {
  // eslint-disable-next-line no-console
  console.error(error);
  if (info) {
    // eslint-disable-next-line no-console
    console.info(info);
  }
};

if (process.env.NODE_ENV === 'production') {
  Raven.config(
    'https://77916a47017347528d25824beb0a077e@sentry.io/1225660'
  ).install();

  handleError = (error, info) => {
    Raven.captureException(error);
    if (info) Raven.captureMessage(info);
  };

}

const reportOrLog = handleError;

export default reportOrLog;
