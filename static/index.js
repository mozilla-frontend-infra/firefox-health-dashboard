import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import './index.css';
import Router from './routes';

render((
  <AppContainer>
    {Router}
  </AppContainer>
), document.getElementById('root'));

if (process.env.NODE_ENV !== 'production') {
  if (module.hot) {
    module.hot.accept('./routes', () => {
      render((
        <AppContainer>
        {require('./routes').default()}
        </AppContainer>
      ), document.getElementById('root'));
    });
  }
}
