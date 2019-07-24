const airbnb = require('@neutrinojs/airbnb');
const react = require('@neutrinojs/react');
const jest = require('@neutrinojs/jest');
const copy = require('@neutrinojs/copy');

module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    airbnb(),
    react({
      html: {
        title: 'Firefox Health Dashboard'
      },
      env: {
        BACKEND: 'https://firefox-health-backend.herokuapp.com',
      },
      // Read https://stackoverflow.com/a/36623117
      // This is the key to making React Router work with neutrino
      // Fix issue with nested routes e.g /index/garbage
      publicPath: '/',
    }),
    jest({
      setupFilesAfterEnv: ['jest-extended'],
    },),
    copy({
      patterns: [
        { from: 'src/static/favicon.ico', to: 'favicon.ico' },
      ],
    })
  ]
};
