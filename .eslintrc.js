module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint-config-standard-with-typescript',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    // Need to turn off rules, which conflicts with prettier
    'prettier'
  ],
  // Generally it's preferable to stick with ts-standard rules set.
  // If you are adding or disabling anything, please add related comments.
  rules: {
    // will put it back as a part of #646
    '@typescript-eslint/strict-boolean-expressions': 'off',
    // It doesn't work well with Typescript https://github.com/yannickcr/eslint-plugin-react/issues/2353
    'react/prop-types': 'off',
    // We need to mark async function call in useEffect, since we can't use async functions there
    'no-void': ['error', { allowAsStatement: true }],
    // This hurts readability of every more or less long text, which is annoying
    'react/no-unescaped-entities': 'off'
  },
  ignorePatterns: ['.eslintrc.js']
}
