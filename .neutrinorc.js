module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    '@mozilla-frontend-infra/react-lint',
    [
      '@neutrinojs/react',
      {
        html: {
          title: 'Firefox Health Dashboard',
        },
        devtool: {
          // Enable source-maps in production
          production: 'source-map',
        },
        env: {
          BACKEND: 'https://firefox-health-backend.herokuapp.com',
        },
        // Read https://stackoverflow.com/a/36623117
        // This is the key to making React Router work with neutrino
        // Fix issue with nested routes e.g /index/garbage
        publicPath: '/',
      },
    ],
    [
      '@neutrinojs/jest',
      {
        setupTestFrameworkScriptFile: 'jest-extended',
      },
    ],
    [
      '@neutrinojs/copy',
      {
        patterns: [{ from: 'src/static/favicon.ico', to: 'favicon.ico' }],
      },
    ],
  ],
};
