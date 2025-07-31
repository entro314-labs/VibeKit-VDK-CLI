import js from '@eslint/js';

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
      'vdk-cli-*.tgz'
    ]
  },
  js.configs.recommended,
  {
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
        Request: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      'no-console': 'off',
      'prefer-const': 'warn',
      'no-var': 'error'
    }
  }
];