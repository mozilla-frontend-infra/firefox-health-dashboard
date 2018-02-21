import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import './index.css';
import Routes from './routes';

console.log(process.env.NODE_ENV);

const root = document.getElementById('root');
const load = () => render(
  (
    <AppContainer>
      <Routes />
    </AppContainer>
  ), root,
);

// This is needed for Hot Module Replacement
if (module.hot) {
  module.hot.accept('./routes', load);
}

load();
