import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import './index.css';
import Routes from './routes';

render((
  <AppContainer>
    <Routes />
  </AppContainer>
), document.getElementById('root'));

if (process.env.NODE_ENV !== 'production') {
  const update = () => {
    const NextRoutes = require('./routes').default;

    render((
      <AppContainer>
        <NextRoutes />
      </AppContainer>
    ), document.getElementById('root'));
  };
  if (module.hot) {
    module.hot.accept('./routes', update);
  }
}
