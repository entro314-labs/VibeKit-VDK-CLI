import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import nodePlugin from 'eslint-plugin-node';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.ai/**',
      'templates/**',
      'test-output/**',
      'ignore-claude-code-examples/**',
      'debug-yaml.js',
      '*.min.js',
      'coverage/**',
      'test/test-output/**',
      'test/mock-project/**',
      'test-package/**',
      'remote repo/**',
      'ignore/**',
      '.claude/**',
      '.vdk/**',
      'test-fix/**',
      'test-init/**',
      'test-path-issue/**',
      'test-vdk-final/**',
      'test-vdk/**',
      'vdk-cli-*.tgz',
    ],
  },
  js.configs.recommended,
  {
    plugins: {
      import: importPlugin,
      node: nodePlugin,
      jsdoc: jsdocPlugin,
      'simple-import-sort': simpleImportSort,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        AbortController: 'readonly',
        Headers: 'readonly',
        Response: 'readonly',
        Request: 'readonly',
      },
    },
    rules: {
      // Existing rules
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-console': 'off',
      'prefer-const': 'warn',
      'no-var': 'error',

      // Import organization
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
      'import/first': 'warn',
      'import/newline-after-import': 'warn',
      'import/no-duplicates': 'warn',

      // JSDoc rules
      'jsdoc/require-description': 'warn',
      'jsdoc/require-param-description': 'warn',
      'jsdoc/require-returns-description': 'warn',
      'jsdoc/check-param-names': 'warn',
      'jsdoc/check-tag-names': 'warn',

      // Node.js specific
      'node/no-unsupported-features/es-syntax': 'off',
      'node/no-missing-import': 'off',
    },
  },
  prettierConfig,
];
