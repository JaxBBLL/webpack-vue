module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: ['plugin:vue/essential', 'standard'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2018,
    sourceType: 'module',
    allowImportExportEverywhere: true
  },
  plugins: ['vue'],
  rules: {
    eqeqeq: 0,
    quotes: 0,
    'space-before-function-paren': 0,
    semi: 0,
    'no-tab': 'off',
    'eslint-disable-next-line': 0,
    'no-useless-escape': 0,
    indent: 0,
    'no-tabs': 0,
    'no-trailing-spaces': 0,
    'no-mixed-spaces-and-tabs': 0,
    'no-multiple-empty-lines': 0,
    'no-multi-spaces': 0,
    'quote-props': 0,
    'comma-dangle': 0
  }
}
