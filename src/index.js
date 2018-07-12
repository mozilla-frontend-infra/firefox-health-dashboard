import Raven from 'raven-js';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import deepOrange from '@material-ui/core/colors/deepOrange';
import './index.css';
import GenericErrorBoundary from './components/genericErrorBoundary';
import Routes from './routes';

if (process.env.NODE_ENV === 'production') {
  Raven.config('https://77916a47017347528d25824beb0a077e@sentry.io/1225660').install();
}

const theme = createMuiTheme({
  palette: {
    primary: deepOrange,
  },
});
const root = document.getElementById('root');
const load = () => render(
  (
    <AppContainer>
      <GenericErrorBoundary critical>
        <MuiThemeProvider theme={theme}>
          <Routes />
        </MuiThemeProvider>
      </GenericErrorBoundary>
    </AppContainer>
  ), root,
);

// This is needed for Hot Module Replacement
if (module.hot) {
  module.hot.accept('./routes', load);
}

load();
