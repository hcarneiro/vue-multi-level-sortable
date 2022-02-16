module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    'plugin:import/recommended',
    'fliplet',
  ],
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaVersion: 6,
  },
  parser: 'vue-eslint-parser',
  plugins: [
    'html',
    'vue',
  ],
  rules: {
    'no-param-reassign': [0],
    'import/no-unresolved': 0,
    'no-unused-vars': 1,
    'eol-last': 0,
    'no-alert': 0,
    'new-cap': [2, { 'capIsNewExceptions': ['Intercom'] }],
    'arrow-body-style': 0,
    'comma-dangle': [2, 'never'],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'vue/no-unused-components': 0,
    'import/named': 2,
  },
};
