import globals from 'globals';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import eslintConfigPrettier from 'eslint-config-prettier';

import { FlatCompat } from '@eslint/eslintrc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  eslintPluginUnicorn.configs['flat/recommended'],
  ...compat.extends('airbnb', 'plugin:react/jsx-runtime', 'airbnb/hooks'),
  eslintConfigPrettier,
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaVersion: 2023,
        sourceType: 'module',
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      'react/prop-types': 0,
      'import/prefer-default-export': 'off',
      'spaced-comment': 'off',
      'unicorn/filename-case': 'off',
      'react/jsx-boolean-value': 'off',
    },
  },
  {
    files: ['eslint.config.js', 'vite.config.js'],
    rules: {
      'import/no-extraneous-dependencies': 'off',
      'no-underscore-dangle': 'off',
    },
  },
  {
    ignores: ['dist'],
  },
];
