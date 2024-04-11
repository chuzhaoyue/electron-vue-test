/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  overrides: [
    {
      files: ['src/**/*.*', 'build/**/*.*', 'electron/**/*.*', 'server/**/*.*'],
      rules: {
        'vue/multi-word-component-names': 'off',
        'no-undef': 'off'
      }
    }
  ],
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
