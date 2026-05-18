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
    'import/first': 'error',
    'import/no-duplicates': 'error',
    'import/no-cycle': 'warn',

    'jsx-a11y/alt-text': 'warn',
    'jsx-a11y/anchor-is-valid': 'warn',
  },
};
