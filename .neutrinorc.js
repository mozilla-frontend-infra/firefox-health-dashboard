module.exports = {
  options: {
    debug: true
  },
  use: [
    [
      '@neutrinojs/airbnb-base',
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
            "indent": 0
          }
        }
      }
    ],
    [
      '@neutrinojs/react',
      {
        html: {
          title: 'platform-health'
        },
        devServer: {
          port: 3010,
          quiet: false
        },
      }
    ],
    '@neutrinojs/mocha'
  ]
};
