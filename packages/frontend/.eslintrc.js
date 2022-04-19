// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch/modern-module-resolution')

module.exports = {
  extends: [
    '@rushstack/eslint-config/profile/web-app',
    //'@rushstack/eslint-config/mixins/react',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  plugins: ['use-encapsulation'],
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  settings: {
    react: {
      version: '18.0',
    },
  },
  rules: {
    'brace-style': 'off',
    'comma-dangle': 'off',
    'comma-spacing': 'off',
    'no-return-await': 'off',
    'object-curly-spacing': 'off',
    'require-await': 'off',
    semi: 'off',
    '@typescript-eslint/consistent-type-definitions': 0,
    '@typescript-eslint/naming-convention': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@rushstack/typedef-var': 0,
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/semi': ['error', 'never'],
    '@typescript-eslint/brace-style': 'error',
    '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
    '@typescript-eslint/comma-spacing': 'error',
    '@typescript-eslint/consistent-indexed-object-style': 'error',
    '@typescript-eslint/consistent-type-exports': 'error',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports' },
    ],
    '@typescript-eslint/func-call-spacing': ['error', 'never'],
    '@typescript-eslint/no-explicit-any': ['error', { ignoreRestArgs: true }],
    '@typescript-eslint/object-curly-spacing': ['error', 'always'],
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/prefer-reduce-type-parameter': 'error',
    '@typescript-eslint/prefer-string-starts-ends-with': 'error',
    '@typescript-eslint/prefer-ts-expect-error': 'error',
    '@typescript-eslint/promise-function-async': 'error',
    '@typescript-eslint/require-await': 'error',
    '@typescript-eslint/return-await': 'error',
    '@typescript-eslint/type-annotation-spacing': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { ignoreRestSiblings: true },
    ],
    'react-hooks/exhaustive-deps': 'error',
    'use-encapsulation/prefer-custom-hooks': 'error',
  },
}
