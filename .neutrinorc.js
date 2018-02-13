const postcssCssnext = require('postcss-cssnext');
const postcssVariables = require('postcss-css-variables');
const postcssImport = require('postcss-import');
const postcssNested = require('postcss-nested');
const postcssReporter = require('postcss-reporter');
const postcssSimpleExtend = require('postcss-simple-extend');
const mqpacker = require('css-mqpacker');

const acceptedExternalEnvs = {
  BACKEND: 'BACKEND' in process.env ?
    process.env.BACKEND : 'https://firefox-health-backend.herokuapp.com'
};

// Set environment variables to their default values if not defined
Object
  .keys(acceptedExternalEnvs)
.forEach(env => !(env in process.env) && (process.env[env] = acceptedExternalEnvs[env]));

module.exports = {
  use: [
    [
      '@neutrinojs/airbnb',
      {
        eslint: {
          rules: {
            "no-console": 0,
            "no-nested-ternary": 0,
            "no-prototype-builtins": 0,
            "jsx-quotes": [
              "error",
              "prefer-single"
            ],
            "max-len": 1,
            "no-await-in-loop": 0,
            "no-param-reassign": 0,
            "no-return-assign": 0,
            "guard-for-in": 0,
            "arrow-body-style": 0,
            "no-restricted-syntax": 0,
            "no-unused-vars": [
              1,
              {
                "vars": "local",
                "args": "after-used",
                "argsIgnorePattern": "^_",
                "ignoreRestSiblings": true
              }
            ],
            "no-loop-func": 0,
            "import/prefer-default-export": 0,
            "no-confusing-arrow": [
              "error",
              {
                "allowParens": true
              }
            ],
            "object-shorthand": 0,
            "class-methods-use-this": 0,
            "camelcase": 0,
            "global-require": 0,
            "react/prefer-stateless-function": 0,
            "react/jsx-filename-extension": 0,
            "react/forbid-prop-types": 0,
            "react/require-default-props": 0,
            "react/no-array-index-key": 0,
            "react/no-multi-comp": 0,
            "react/no-unused-prop-types": 0,
            "react/no-danger": 0,
            "no-mixed-operators": 0,
            "generator-star-spacing": 0,
            "jsx-quotes": 0,
            "react/default-props-match-prop-types": 0,
            "jsx-a11y/anchor-is-valid": 0,
            "react/jsx-closing-tag-location": 0,
            "no-nested-ternary": 0,
            "no-unused-vars": 0,
            "indent": 0,
            "prefer-destructuring": 0,
            "padded-blocks": 0,
            "function-paren-newline": 0,
            "react/jsx-curly-brace-presence": 0,
            "object-curly-newline": 0,
            "react/no-unused-state": 0
          }
        }
      }
    ],
    [
      '@neutrinojs/react',
      {
        html: {
          title: 'Firefox Health Dashboard',
          links: [
            "https://fonts.googleapis.com/css?family=Fira+Sans:300,400,400i,500",
            {
              href: '/static/favicon.ico',
              rel: 'icon',
              type: 'image/x-icon'
            }
          ]
        },
        style: {
          loaders: [
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [
                  postcssImport(),
                  postcssSimpleExtend(),
                  postcssNested(),
                  postcssVariables(),
                  postcssCssnext({
                    browsers: ['last 1 version'],
                  }),
                  postcssReporter({
                    throwError: true,
                  }),
                  mqpacker(),
                ]
              }
            }
          ]
        },
        env: Object.keys(acceptedExternalEnvs),
      }
    ],
    '@neutrinojs/mocha',
    (neutrino) => {
      // Read https://stackoverflow.com/a/36623117
      // This is the key to making React Router work with neutrino
      // Fix issue with nested routes e.g /index/garbage
      neutrino.config.output.publicPath('/');
    }
  ]
};
