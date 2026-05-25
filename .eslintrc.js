module.exports = {
  root: true,

  extends: [
    '@react-native',
  ],

  plugins: [
    'import',
    'jsx-a11y',
  ],

  rules: {
    // import rules
    'import/first': 'error',
    'import/no-duplicates': 'error',
    'import/no-cycle': 'warn',

    // accessibility rules
    'jsx-a11y/alt-text': 'warn',
    'jsx-a11y/anchor-is-valid': 'off',

    // large component rules
    'max-lines-per-function': [
      'warn',
      {
        max: 200,
        skipBlankLines: true,
        skipComments: true,
      },
    ],

    complexity: [
      'warn',
      20,
    ],
  },
};
