/* eslint-disable import/no-extraneous-dependencies */
const neutrino = require('neutrino');

module.exports = neutrino().eslintrc({
  rules: {
    'object-curly-newline': ['error', {
      ObjectExpression: { multiline: true, minProperties: 2, consistent: true },
      ObjectPattern: { multiline: true, minProperties: 2, consistent: true },
      ImportDeclaration: 'never',
      ExportDeclaration: { multiline: true, minProperties: 2, consistent: true },
    }],
    'array-bracket-newline': { multiline: true, minProperties: 2, consistent: true },
  },
});
