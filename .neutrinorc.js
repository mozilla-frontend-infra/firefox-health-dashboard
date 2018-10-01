module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    [
      '@neutrinojs/airbnb',
      {
        eslint: {
          rules: {
            'no-console': 0,
            'no-nested-ternary': 0,
            'no-prototype-builtins': 0,
            'jsx-quotes': [
              'error',
              'prefer-single',
            ],
            'max-len': 1,
            'no-await-in-loop': 0,
            'no-param-reassign': 0,
            'no-return-assign': 0,
            'guard-for-in': 0,
            'arrow-body-style': 0,
            'no-restricted-syntax': 0,
            'no-unused-vars': [
              1,
              {
                vars: 'local',
                args: 'after-used',
                argsIgnorePattern: '^_',
                ignoreRestSiblings: true,
              },
            ],
            'no-loop-func': 0,
            'import/prefer-default-export': 0,
            'no-confusing-arrow': [
              'error',
              {
                allowParens: true,
              },
            ],
            'object-shorthand': 0,
            'class-methods-use-this': 0,
            camelcase: 0,
            'global-require': 0,
            'react/destructuring-assignment': 0,
            'react/prefer-stateless-function': 0,
            'react/jsx-filename-extension': 0,
            'react/forbid-prop-types': 0,
            'react/require-default-props': 0,
            'react/no-array-index-key': 0,
            'react/no-multi-comp': 0,
            'react/no-unused-prop-types': 0,
            'react/no-danger': 0,
            'react/react-in-jsx-scope': 0,
            'react/sort-comp': 0,
            'no-mixed-operators': 0,
            'generator-star-spacing': 0,
            'react/default-props-match-prop-types': 0,
            'jsx-a11y/anchor-is-valid': 0,
            'react/jsx-closing-tag-location': 0,
            indent: 0,
            'prefer-destructuring': 0,
            'padded-blocks': 0,
            'function-paren-newline': 0,
            'react/jsx-curly-brace-presence': 0,
            'react/jsx-no-target-blank': 0,
            'object-curly-newline': 0,
            'react/no-unused-state': 0,
            'jest/valid-expect': 0,
          },
        },
      },
    ],
    [
      '@neutrinojs/react',
      {
        html: {
          title: 'Firefox Health Dashboard',
          links: [
            {
              href: '/static/favicon.ico',
              rel: 'icon',
              type: 'image/x-icon',
            },
          ],
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
    '@neutrinojs/jest',
    [
      '@neutrinojs/copy', {
        patterns: [
          { from: 'src/static/favicon.ico', to: 'favicon.ico' },
        ],
      },
    ],
  ],
};
