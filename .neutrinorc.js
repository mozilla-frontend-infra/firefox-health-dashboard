/* eslint-disable import/no-extraneous-dependencies */
const airbnb = require('@neutrinojs/airbnb');
const react = require('@neutrinojs/react');
const jest = require('@neutrinojs/jest');
const copy = require('@neutrinojs/copy');

module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    airbnb({
      eslint: {
        rules: {
          'arrow-parens': ['error', 'as-needed'],
          'class-methods-use-this': 0,
          'consistent-return': 0,
          'jsx-a11y/control-has-associated-label': 0,
          'jsx-a11y/click-events-have-key-events': 0,
          'jsx-a11y/no-static-element-interactions': 0,
          'max-classes-per-file': 0,
          'max-len': 0,
          'no-mixed-operators': 0,
          'no-shadow': 0,
          'no-return-assign': 0,
          'react/default-props-match-prop-types': 0,
          'react/destructuring-assignment': 0,
          'react/forbid-prop-types': 0,
          'react/jsx-props-no-spreading': 0,
          'react/no-unused-prop-types': 0,
          'react/prefer-stateless-function': 0,
          'react/prop-types': 0,
          'react/require-default-props': 0,
          'react/sort-comp': 0,
          'react/state-in-constructor': 0,
        },
      },
    }),
    react({
      html: {
        title: 'Firefox Health Dashboard',
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
    }),
    copy({
      patterns: [
        { from: 'src/static/favicon.ico', to: 'favicon.ico' },
      ],
    }),
  ],
};
